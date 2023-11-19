package cart

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/go-redis/redis/v8"
	"go-gateway/graph/auth"
	"go-gateway/graph/model"
	"time"
)

const cache_prefix = "cart_"

type Resolver interface {
	AddToCart(ctx context.Context, input model.CartItemInput) (string, error)
	UpdateItemQuantity(ctx context.Context, input model.UpdateItemInput) (string, error)
	ClearCart(ctx context.Context) (string, error)
	RemoveItem(ctx context.Context, productID float64) (string, error)
	Cart(ctx context.Context) (*model.CartGraphqlType, error)
	InitOrder(ctx context.Context) (*model.OrderCreatedType, error)
}

type resolver struct {
	svc         Service
	redisClient *redis.Ring
}

func NewResolver(svc Service, redisClient *redis.Ring) Resolver {
	return &resolver{svc: svc,
		redisClient: redisClient}
}

// AddToCart is the resolver for the addToCart field.
func (r *resolver) AddToCart(ctx context.Context, input model.CartItemInput) (string, error) {
	user := auth.UserIdForContext(ctx)
	if user == nil {
		return "", fmt.Errorf("access denied")
	}

	err := r.svc.AddToCart(ctx, input, user.Id)
	if err != nil {
		return "", err
	}

	r.redisClient.Del(ctx, cache_prefix+fmt.Sprintf("%d", user.Id))

	return "Item added to cart", nil
}

// UpdateItemQuantity is the resolver for the updateItemQuantity field.
func (r *resolver) UpdateItemQuantity(ctx context.Context, input model.UpdateItemInput) (string, error) {
	user := auth.UserIdForContext(ctx)
	if user == nil {
		return "", fmt.Errorf("access denied")
	}

	err := r.svc.UpdateItemQuantity(ctx, input, user.Id)
	if err != nil {
		return "", err
	}

	r.redisClient.Del(ctx, cache_prefix+fmt.Sprintf("%d", user.Id))

	return "Item quantity updated", nil
}

// ClearCart is the resolver for the clearCart field.
func (r *resolver) ClearCart(ctx context.Context) (string, error) {
	user := auth.UserIdForContext(ctx)
	if user == nil {
		return "", fmt.Errorf("access denied")
	}

	err := r.svc.ClearCart(ctx, user.Id)
	if err != nil {
		return "", err
	}

	r.redisClient.Del(ctx, cache_prefix+fmt.Sprintf("%d", user.Id))

	return "Cart cleared", nil
}

// RemoveItem is the resolver for the removeItem field.
func (r *resolver) RemoveItem(ctx context.Context, productID float64) (string, error) {
	user := auth.UserIdForContext(ctx)
	if user == nil {
		return "", fmt.Errorf("access denied")
	}

	err := r.svc.RemoveItem(ctx, productID, user.Id)
	if err != nil {
		return "", err
	}

	r.redisClient.Del(ctx, cache_prefix+fmt.Sprintf("%d", user.Id))

	return "Item removed from cart", nil
}

// Cart is the resolver for the cart field.
func (r *resolver) Cart(ctx context.Context) (*model.CartGraphqlType, error) {
	user := auth.UserIdForContext(ctx)
	if user == nil {
		return nil, fmt.Errorf("access denied")
	}

	cacheResult, err := r.redisClient.Get(ctx, cache_prefix+fmt.Sprintf("%d", user.Id)).Result()

	// cache miss, fetch from cart service
	if err == redis.Nil {
		res, err := r.svc.Cart(ctx, user.Id)
		if err != nil {
			return nil, err
		}

		cartItemsGraphql := make([]*model.CartItemGraphqlType, len(res.Items))
		for i, item := range res.Items {
			cartItemsGraphql[i] = &model.CartItemGraphqlType{
				ProductID: int(item.ProductId),
				Quantity:  int(item.Quantity),
				ImageURL:  item.ImageUrl,
				Price:     int(item.Price),
				Name:      item.Name,
			}
		}

		cart := &model.CartGraphqlType{
			UserID: int(res.UserId),
			Items:  cartItemsGraphql,
		}

		serialized, err := json.Marshal(cart)
		if err != nil {
			return nil, err
		}

		r.redisClient.Set(ctx, cache_prefix+fmt.Sprintf("%d", user.Id), serialized, 5*time.Minute)

		return cart, nil
	} else if err != nil {
		return nil, err
	} else {
		var cart *model.CartGraphqlType
		err := json.Unmarshal([]byte(cacheResult), &cart)
		if err != nil {
			return nil, err
		}

		return cart, nil
	}
}

func (r *resolver) InitOrder(ctx context.Context) (*model.OrderCreatedType, error) {
	user := auth.UserIdForContext(ctx)
	if user == nil {
		return nil, fmt.Errorf("access denied")
	}

	orderID, err := r.svc.InitOrder(ctx, user.Id)
	if err != nil {
		return nil, err
	}

	r.redisClient.Del(ctx, cache_prefix+fmt.Sprintf("%d", user.Id))

	return &model.OrderCreatedType{
		OrderID: int(orderID),
	}, nil
}
