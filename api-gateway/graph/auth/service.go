package auth

import (
	"context"
	"errors"
	"net/http"
	"time"
)

type Service interface {
	LoginUser(ctx context.Context, in *LoginInput) error
	Refresh(ctx context.Context) error
	Logout(ctx context.Context) error
	RegisterUser(ctx context.Context, in *RegisterUserInput) (int64, error)
	ValidateToken(ctx context.Context, token string) (int, error)
}

type service struct {
	grpcClient AuthServiceClient
}

func NewService(grpcClient AuthServiceClient) Service {
	return &service{grpcClient: grpcClient}
}

func (s *service) LoginUser(ctx context.Context, in *LoginInput) error {
	res, err := s.grpcClient.LoginUser(ctx, &LoginInput{
		Email:    in.Email,
		Password: in.Password,
	})
	if err != nil {
		return err
	}

	responseWriter, ok := ctx.Value("ResponseWriter").(http.ResponseWriter)
	if !ok {
		return errors.New("could not get response writer from context")
	}

	responseWriter.Header().Add("Set-Cookie", res.AccessTokenCookie)
	responseWriter.Header().Add("Set-Cookie", res.RefreshTokenCookie)

	return nil
}

func (s *service) Refresh(ctx context.Context) error {
	req, ok := ctx.Value("Request").(*http.Request)
	if !ok {
		return errors.New("could not get request from context")
	}

	refreshCookie, err := req.Cookie("Refresh")
	if err != nil {
		return errors.New("could not get refresh cookie from request")
	}

	res, err := s.grpcClient.Refresh(ctx, &RefreshRequest{
		RefreshToken: refreshCookie.Value,
	})
	if err != nil {
		return err
	}

	responseWriter, ok := ctx.Value("ResponseWriter").(http.ResponseWriter)
	if !ok {
		return errors.New("could not get response writer from context")
	}

	responseWriter.Header().Add("Set-Cookie", res.AccessTokenCookie)

	return nil
}

func (s *service) Logout(ctx context.Context) error {
	responseWriter, ok := ctx.Value("ResponseWriter").(http.ResponseWriter)
	if !ok {
		return errors.New("could not get response writer from context")
	}

	authCookie := http.Cookie{
		Name:    "Authentication",
		Value:   "",
		Expires: time.Unix(0, 0),
	}

	http.SetCookie(responseWriter, &authCookie)

	refreshCookie := http.Cookie{
		Name:    "Refresh",
		Value:   "",
		Expires: time.Unix(0, 0),
	}

	http.SetCookie(responseWriter, &refreshCookie)

	return nil
}

func (s *service) RegisterUser(ctx context.Context, in *RegisterUserInput) (int64, error) {
	res, err := s.grpcClient.RegisterUser(ctx, &RegisterUserInput{
		Email:    in.Email,
		Password: in.Password,
	})
	if err != nil {
		return 0, err
	}

	return res.UserId, nil
}

func (s *service) ValidateToken(ctx context.Context, token string) (int, error) {
	res, err := s.grpcClient.Validate(ctx, &ValidateRequest{
		Token: token,
	})
	if err != nil {
		return 0, err
	}

	return int(res.UserId), nil
}
