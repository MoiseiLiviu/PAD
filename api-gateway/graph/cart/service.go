package cart

import (
	"context"
	"go-gateway/graph/model"
)

type Service interface {
	AddToCart(ctx context.Context, input model.CartItemInput, userId int32) error
	UpdateItemQuantity(ctx context.Context, input model.UpdateItemInput, userId int32) error
	ClearCart(ctx context.Context, userId int32) error
	RemoveItem(ctx context.Context, productID float64, userId int32) error
	Cart(ctx context.Context, userId int32) (*CartPayload, error)
	InitOrder(ctx context.Context, userId int32) (int32, error)
}

type service struct {
	grpcClient CartServiceClient
}

func NewService(grpcClient CartServiceClient) Service {
	return &service{grpcClient: grpcClient}
}

func (s *service) AddToCart(ctx context.Context, input model.CartItemInput, userId int32) error {
	_, err := s.grpcClient.AddItem(ctx, &AddItemToCartRequest{
		UserId:    userId,
		ProductId: int32(input.ProductID),
		Quantity:  int32(input.Quantity),
	})
	if err != nil {
		return err
	}

	return nil
}

func (s *service) UpdateItemQuantity(ctx context.Context, input model.UpdateItemInput, userId int32) error {
	_, err := s.grpcClient.UpdateItemQuantity(ctx, &UpdateItemQuantityRequest{
		ProductId:   int32(input.ProductID),
		NewQuantity: int32(input.NewQuantity),
		UserId:      userId,
	})
	if err != nil {
		return err
	}

	return nil
}

func (s *service) ClearCart(ctx context.Context, userId int32) error {
	_, err := s.grpcClient.ClearCart(ctx, &ClearCartRequest{
		UserId: userId,
	})
	if err != nil {
		return err
	}

	return nil
}

func (s *service) RemoveItem(ctx context.Context, productID float64, userId int32) error {
	_, err := s.grpcClient.RemoveItem(ctx, &RemoveItemRequest{
		ProductId: int32(productID),
		UserId:    userId,
	})
	if err != nil {
		return err
	}

	return nil
}

func (s *service) Cart(ctx context.Context, userId int32) (*CartPayload, error) {
	res, err := s.grpcClient.GetCartByUserId(ctx, &GetCartByUserIdRequest{
		UserId: userId,
	})
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (s *service) InitOrder(ctx context.Context, userId int32) (int32, error) {
	res, err := s.grpcClient.InitOrder(ctx, &InitOrderRequest{
		UserId: userId,
	})

	if err != nil {
		return 0, err
	}

	return res.OrderId, nil
}
