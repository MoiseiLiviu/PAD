package category

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/go-redis/redis/v8"
	"go-gateway/graph/auth"
	"go-gateway/graph/model"
	"time"
)

const allCategoriesKey = "allCategories"

type Resolver interface {
	CreateCategory(ctx context.Context, input model.CreateCategoryInput) (*model.CategoryGraphqlType, error)
	Categories(ctx context.Context) ([]*model.CategoryGraphqlType, error)
}

type resolver struct {
	svc         Service
	redisClient *redis.Client
}

func NewResolver(svc Service, redisClient *redis.Client) Resolver {
	return &resolver{svc: svc,
		redisClient: redisClient}
}

func (r *resolver) CreateCategory(ctx context.Context, input model.CreateCategoryInput) (*model.CategoryGraphqlType, error) {
	user := auth.UserIdForContext(ctx)
	if user == nil {
		return nil, fmt.Errorf("access denied")
	}

	categoryID, err := r.svc.CreateCategory(ctx, &input)
	if err != nil {
		return nil, err
	}

	r.redisClient.Del(ctx, allCategoriesKey)

	return &model.CategoryGraphqlType{
		ID:          categoryID,
		Name:        input.Name,
		Description: input.Description,
	}, nil
}

func (r *resolver) Categories(ctx context.Context) ([]*model.CategoryGraphqlType, error) {
	user := auth.UserIdForContext(ctx)
	if user == nil {
		return nil, fmt.Errorf("access denied")
	}

	result, err := r.redisClient.Get(ctx, allCategoriesKey).Result()
	// cache miss, fetch from catalog service
	if err == redis.Nil {
		res, err := r.svc.Categories(ctx)
		if err != nil {
			return nil, err
		}

		var categories []*model.CategoryGraphqlType
		for _, category := range res.Categories {
			categories = append(categories, &model.CategoryGraphqlType{
				ID:          int(category.Id),
				Name:        category.Name,
				Description: category.Description,
			})
		}

		serialized, err := json.Marshal(categories)
		if err != nil {
			return nil, err
		}

		r.redisClient.Set(ctx, allCategoriesKey, serialized, 5*time.Minute)

		return categories, nil
	} else if err != nil {
		return nil, err
	} else {
		var categories []*model.CategoryGraphqlType
		err := json.Unmarshal([]byte(result), &categories)
		if err != nil {
			return nil, err
		}

		return categories, nil
	}
}
