package category

import (
	"context"
	"fmt"
	"go-gateway/graph/model"
)

type Service interface {
	Categories(ctx context.Context) (*GetAllCategoriesResponse, error)
	CreateCategory(ctx context.Context, input *model.CreateCategoryInput) (int, error)
}

type service struct {
	grpcClient CategoryServiceClient
}

func NewService(grpcClient CategoryServiceClient) Service {
	return &service{grpcClient: grpcClient}
}

func (s *service) Categories(ctx context.Context) (*GetAllCategoriesResponse, error) {
	res, err := s.grpcClient.GetAll(ctx, &GetAllCategoriesRequest{})
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (s *service) CreateCategory(ctx context.Context, input *model.CreateCategoryInput) (int, error) {
	res, err := s.grpcClient.CreateCategory(ctx, &CreateCategoryRequest{
		Name:        input.Name,
		Description: input.Description,
	})

	if err != nil {
		return 0, err
	}

	if res.Status != 201 {
		return 0, fmt.Errorf("error creating category: %s", res.Error)
	}

	return int(res.CategoryId), nil
}
