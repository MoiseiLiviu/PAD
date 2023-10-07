package order

import (
	"context"
)

type Service interface {
	OrderStatus(ctx context.Context, orderID float64) (string, error)
}

type service struct {
	grpcClient OrderServiceClient
}

func NewService(grpcClient OrderServiceClient) Service {
	return &service{grpcClient: grpcClient}
}

func (s *service) OrderStatus(ctx context.Context, orderID float64) (string, error) {
	res, err := s.grpcClient.GetOrderStatus(ctx, &GetOrderStatusRequest{
		OrderId: int32(orderID),
	})
	if err != nil {
		return "", err
	}

	return OrderStatus_name[int32(res.Status)], nil
}
