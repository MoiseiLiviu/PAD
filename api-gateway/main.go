package main

import (
	"context"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-redis/redis/v8"
	"go-gateway/graph"
	"go-gateway/graph/auth"
	"go-gateway/graph/cart"
	"go-gateway/graph/category"
	"go-gateway/graph/config"
	"go-gateway/graph/order"
	"go-gateway/graph/product"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"log"
	"net/http"
	"time"
)

var (
	maxConcurrentTasks = 20
	sem                = make(chan struct{}, maxConcurrentTasks)
)

func main() {
	cfg, err := config.NewConfig()
	if err != nil {
		panic(err)
	}

	rdb := redis.NewRing(&redis.RingOptions{
		Addrs: map[string]string{
			"shard1": "redis-service-1:6379",
			"shard2": "redis-service-2:6379",
			"shard3": "redis-service-3:6379",
		},
	})

	defer func(rdb *redis.Ring) {
		err := rdb.Close()
		if err != nil {
			panic(err)
		}
	}(rdb)

	authCon, err := grpc.Dial(cfg.AuthServiceUrl, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		panic(err)
	}
	grpcAuthClient := auth.NewAuthServiceClient(authCon)
	authSvc := auth.NewService(grpcAuthClient)
	authResolver := auth.NewResolver(authSvc)

	catalogCon, err := grpc.Dial(cfg.CatalogServiceUrl, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		panic(err)
	}
	grpcCatalogClient := product.NewProductServiceClient(catalogCon)
	productSvc := product.NewService(grpcCatalogClient)
	productResolver := product.NewResolver(productSvc, rdb)

	orderCon, err := grpc.Dial(cfg.OrderServiceUrl, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		panic(err)
	}
	grpcOrderClient := order.NewOrderServiceClient(orderCon)
	orderSvc := order.NewService(grpcOrderClient)
	orderResolver := order.NewResolver(orderSvc)

	cartCon, err := grpc.Dial(cfg.CartServiceUrl, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		panic(err)
	}
	grpcCartClient := cart.NewCartServiceClient(cartCon)
	cartSvc := cart.NewService(grpcCartClient)
	cartResolver := cart.NewResolver(cartSvc, rdb)

	grpcCategoryClient := category.NewCategoryServiceClient(catalogCon)
	categorySvc := category.NewService(grpcCategoryClient)
	categoryResolver := category.NewResolver(categorySvc, rdb)

	resolver := graph.Resolver{
		AuthResolver:     authResolver,
		ProductResolver:  productResolver,
		OrderResolver:    orderResolver,
		CartResolver:     cartResolver,
		CategoryResolver: categoryResolver,
	}

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &resolver}))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", auth.Middleware(authSvc)(contextMiddleware(srv)))
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, err := w.Write([]byte("OK"))
		if err != nil {
			log.Println("Failed to write \"OK\" to health probe")
		}
	})

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", cfg.Port)
	log.Fatal(http.ListenAndServe(":"+cfg.Port, nil))
}

func acquireSem() { sem <- struct{}{} }
func releaseSem() { <-sem }

func contextMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		acquireSem()
		defer releaseSem()

		timeoutDuration := 5 * time.Second
		ctx, cancel := context.WithTimeout(r.Context(), timeoutDuration)
		defer cancel()

		ctx = context.WithValue(ctx, "ResponseWriter", w)
		ctx = context.WithValue(ctx, "Request", r)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
