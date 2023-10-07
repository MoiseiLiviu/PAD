package product

import (
	"context"
	"go-gateway/graph/model"
)

type Service interface {
	GetById(ctx context.Context, productID float64) (*ProductPayload, error)
	CreateProduct(ctx context.Context, input model.CreateProductInput, userId int32) (*ProductPayload, error)
}

type service struct {
	grpcClient ProductServiceClient
}

func NewService(grpcClient ProductServiceClient) Service {
	return &service{grpcClient: grpcClient}
}

func (s service) CreateProduct(ctx context.Context, input model.CreateProductInput, userId int32) (*ProductPayload, error) {
	var categoryIds []int32

	for _, categoryId := range input.CategoriesIds {
		categoryIds = append(categoryIds, int32(categoryId))
	}

	var imageUrl string
	if input.ImageURL == nil {
		imageUrl = ""
	} else {
		imageUrl = *input.ImageURL
	}

	res, err := s.grpcClient.CreateProduct(ctx, &CreateProductRequest{
		Name:           input.Name,
		UnitsAvailable: int32(input.UnitsAvailable),
		ImageUrl:       imageUrl,
		Price:          input.Price,
		CategoriesId:   categoryIds,
		UserId:         userId,
	})

	if err != nil {
		return nil, err
	}

	return res, nil
}

func (s service) GetById(ctx context.Context, productID float64) (*ProductPayload, error) {
	res, err := s.grpcClient.GetById(ctx, &GetProductByIdRequest{
		Id: int32(productID),
	})
	if err != nil {
		return nil, err
	}

	return res, nil
}
