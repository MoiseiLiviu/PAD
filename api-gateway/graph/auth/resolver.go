package auth

import (
	"context"
	"fmt"
	"go-gateway/graph/model"
	"strconv"
)

type Resolver interface {
	Login(ctx context.Context, input model.AuthLoginInput) (string, error)
	Logout(ctx context.Context) (string, error)
	Refresh(ctx context.Context) (string, error)
	RegisterUser(ctx context.Context, input model.RegisterUserInput) (string, error)
}

type resolver struct {
	svc Service
}

func NewResolver(svc Service) Resolver {
	return &resolver{svc: svc}
}

// Login is the resolver for the login field.
func (r *resolver) Login(ctx context.Context, input model.AuthLoginInput) (string, error) {
	err := r.svc.LoginUser(ctx, &LoginInput{
		Email:    input.Email,
		Password: input.Password,
	})

	if err != nil {
		return "", err
	}

	return "Login successful", nil
}

// Logout is the resolver for the logout field.
func (r *resolver) Logout(ctx context.Context) (string, error) {
	user := UserIdForContext(ctx)
	if user == nil {
		return "", fmt.Errorf("access denied")
	}

	err := r.svc.Logout(ctx)
	if err != nil {
		return "", err
	}

	return "Logout successful", nil
}

// Refresh is the resolver for the refresh field.
func (r *resolver) Refresh(ctx context.Context) (string, error) {
	user := UserIdForContext(ctx)
	if user == nil {
		return "", fmt.Errorf("access denied")
	}

	err := r.svc.Refresh(ctx)
	if err != nil {
		return "", err
	}

	return "Refresh successful", nil
}

// RegisterUser is the resolver for the registerUser field.
func (r *resolver) RegisterUser(ctx context.Context, input model.RegisterUserInput) (string, error) {
	id, err := r.svc.RegisterUser(ctx, &RegisterUserInput{
		Email:    input.Email,
		Password: input.Password,
	})

	if err != nil {
		return "", err
	}

	return "User registered with id: " + strconv.FormatInt(id, 10), nil
}
