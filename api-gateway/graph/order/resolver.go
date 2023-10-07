package order

import (
	"context"
	"fmt"
	"go-gateway/graph/auth"
	"go-gateway/graph/model"
)

type Resolver interface {
	OrderStatus(ctx context.Context, orderID float64) (*model.OrderStatusGraphqlType, error)
}

type resolver struct {
	svc Service
}

func NewResolver(svc Service) Resolver {
	return &resolver{svc: svc}
}

// OrderStatus is the resolver for the orderStatus field.
func (r *resolver) OrderStatus(ctx context.Context, orderID float64) (*model.OrderStatusGraphqlType, error) {
	user := auth.UserIdForContext(ctx)
	if user == nil {
		return nil, fmt.Errorf("access denied")
	}

	orderStatus, err := r.svc.OrderStatus(ctx, orderID)
	if err != nil {
		return nil, err
	}

	return &model.OrderStatusGraphqlType{
		Value: model.OrderStatus(orderStatus),
	}, nil
}
