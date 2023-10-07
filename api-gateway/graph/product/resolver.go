package product

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/go-redis/redis/v8"
	"go-gateway/graph/auth"
	"go-gateway/graph/model"
	"time"
)

const cache_prefix = "product_"

type Resolver interface {
	CreateProduct(ctx context.Context, input model.CreateProductInput) (*model.ProductGraphqlType, error)
	Product(ctx context.Context, id float64) (*model.ProductGraphqlType, error)
}

type resolver struct {
	svc         Service
	redisClient *redis.Client
}

func NewResolver(svc Service, redisClient *redis.Client) Resolver {
	return &resolver{svc: svc,
		redisClient: redisClient}
}

func (r *resolver) CreateProduct(ctx context.Context, input model.CreateProductInput) (*model.ProductGraphqlType, error) {
	user := auth.UserIdForContext(ctx)
	if user == nil {
		return nil, fmt.Errorf("access denied")
	}

	product, err := r.svc.CreateProduct(ctx, input, user.Id)
	if err != nil {
		return nil, err
	}

	var categories []*model.ProductCategoryGraphqlType

	for _, category := range product.Categories {
		categories = append(categories, &model.ProductCategoryGraphqlType{
			ID:   int(category.Id),
			Name: category.Name,
		})
	}

	res := &model.ProductGraphqlType{
		ID:             int(product.Id),
		Name:           product.Name,
		UnitsAvailable: int(product.UnitsAvailable),
		ImageURL:       product.ImageUrl,
		Price:          product.Price,
		Categories:     categories,
	}

	serialized, err := json.Marshal(res)
	if err != nil {
		return nil, err
	}

	r.redisClient.Set(ctx, fmt.Sprintf("%s%d", cache_prefix, product.Id), serialized, 5*time.Minute)

	return res, nil
}

func (r *resolver) Product(ctx context.Context, id float64) (*model.ProductGraphqlType, error) {
	user := auth.UserIdForContext(ctx)
	if user == nil {
		return nil, fmt.Errorf("access denied")
	}

	cacheResult, err := r.redisClient.Get(ctx, fmt.Sprintf("%s%d", cache_prefix, id)).Result()
	//cache miss, fetch from catalog service
	if err == redis.Nil {
		product, err := r.svc.GetById(ctx, id)
		if err != nil {
			return nil, err
		}

		var categories []*model.ProductCategoryGraphqlType

		for _, category := range product.Categories {
			categories = append(categories, &model.ProductCategoryGraphqlType{
				ID:   int(category.Id),
				Name: category.Name,
			})
		}

		res := &model.ProductGraphqlType{
			ID:             int(product.Id),
			Name:           product.Name,
			UnitsAvailable: int(product.UnitsAvailable),
			ImageURL:       product.ImageUrl,
			Price:          product.Price,
			Categories:     categories,
		}

		serialized, err := json.Marshal(res)
		if err != nil {
			return nil, err
		}

		r.redisClient.Set(ctx, fmt.Sprintf("%s%d", cache_prefix, product.Id), serialized, 5*time.Minute)

		return res, nil
	} else if err != nil {
		return nil, err
	} else {
		var product *model.ProductGraphqlType
		err := json.Unmarshal([]byte(cacheResult), &product)
		if err != nil {
			return nil, err
		}

		return product, nil
	}
}
