package config

import (
	"github.com/caarlos0/env"
	"github.com/joho/godotenv"
	"log"
)

type Config struct {
	//RedisNodesUrls    []string `env:"REDIS_NODES_URLS" envSeparator:","`
	OrderServiceUrl   string `env:"ORDER_SERVICE_URL" envDefault:"localhost:5003"`
	CatalogServiceUrl string `env:"PRODUCT_SERVICE_URL" envDefault:"localhost:5002"`
	AuthServiceUrl    string `env:"AUTH_SERVICE_URL" envDefault:"localhost:5001"`
	CartServiceUrl    string `env:"CART_SERVICE_URL" envDefault:"localhost:5004"`
	Port              string `env:"PORT" envDefault:"3000"`
}

func NewConfig() (Config, error) {
	var cfg Config

	err := godotenv.Load()
	if err != nil {
		log.Println("Failed to load .env file.")
	}

	if err := env.Parse(&cfg); err != nil {
		return cfg, err
	}

	return cfg, nil
}
