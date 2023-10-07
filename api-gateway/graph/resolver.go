package graph

import (
	"go-gateway/graph/auth"
	"go-gateway/graph/cart"
	"go-gateway/graph/category"
	"go-gateway/graph/order"
	"go-gateway/graph/product"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type AuthResolver = auth.Resolver
type CartResolver = cart.Resolver
type ProductResolver = product.Resolver
type OrderResolver = order.Resolver
type CategoryResolver = category.Resolver

type Resolver struct {
	AuthResolver
	CartResolver
	CategoryResolver
	OrderResolver
	ProductResolver
}
