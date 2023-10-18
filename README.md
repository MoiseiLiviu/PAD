# Distributed Systems Programming Laboratory Works

### University: _Technical University of Moldova_

### Faculty: _Computers, Informatics and Microelectronics_

### Department: _Software Engineering and Automatics_

### Author: _Moisei Liviu_

----

## Abstract

&ensp;&ensp;&ensp; This repository contains the laboratory work tasks on the PAD subject at TUM.

## Checkpoint 1:

### Application Suitability:

* Scalability: One of the primary advantages of distributed systems is their ability to scale horizontally.
  E-commerce platforms experience varying loads, from typical daily traffic to sudden spikes during promotions,
  flash sales, or holiday seasons. With a distributed system, e-commerce backends can add more machines or nodes
  to the system to handle increased demand, ensuring seamless performance even during peak times.
* Flexibility & Modular Development: Distributed systems can be designed in a modular fashion. This allows e-commerce
  businesses
  to roll out new features, integrations, or updates on one part of the system without disrupting the entire platform.
  For instance,
  if an e-commerce platform wants to introduce a new recommendation engine or integrate a new payment gateway, they can
  do so on
  specific nodes. This modular approach accelerates development cycles, promotes continuous integration and delivery (
  CI/CD), and
  ensures that the platform can quickly adapt to changing market demands or technological advancements.
* High Availability & Fault Tolerance: Downtime can be extremely costly for e-commerce businesses, where every minute
  of outage can translate to significant financial losses. Distributed systems are designed to continue functioning even
  if one or more nodes fail. By replicating data across multiple nodes, these systems can automatically recover from
  failures,
  ensuring high availability. If one node (or even several) goes down, others can take over, allowing the e-commerce
  platform
  to remain operational.

Real-life examples:

- ***Alibaba***: As one of the biggest e-commerce companies in the world, especially in Asia, Alibaba must handle a vast
  amount of traffic, particularly during sales events like Singles' Day. Alibaba Cloud, their cloud computing
  subsidiary, offers a range of distributed services that the e-commerce side of Alibaba leverages for scalability and
  fault tolerance.

- ***Shopify***: Shopify powers over a million businesses worldwide. To ensure that each storefront can handle its
  traffic, especially during spikes, Shopify uses a distributed architecture. They make extensive use of Kubernetes, a
  container orchestration platform, to manage their distributed systems.

### Service Boundaries:

- **Access Management Service** - Responsible for user authentication, as well as getting or deleting user data.
- **Cart Service** - Responsible for the cart state.
- **Catalog Service** - Handles all product related operations.
- **Payment Service** - Handles payment operations.
- **Order Service** - Responsible for handling order creation, tracking and forwarding order status updates.
- **API Gateway** - Serves as the single entry point for all client requests. It routes the request to the appropriate
  service and aggregates the responses if necessary.
- **Service Discorvery** - Keeps a list of all service instances, their locations, and their health status. It helps the
  API Gateway route client requests to the appropriate service instance.

### Technology Stack

- **User Service**:
    * Language: JS
    * Framework: NestJS
    * Database: PostgreSQL
- **Catalog Service**:
    * Language: JS
    * Framework: NestJS
    * Database: PostgreSQL
- **Order Service**:
    * Language: JS
    * Framework: NestJS
    * Database: PostgreSQL
- **Access Management Service**:
    * Language: JS
    * Framework: NestJS
    * Database: PostgreSQL
- **Cart Service**:
    * Language: JS
    * Framework: NestJS
    * Database: MongoDB
- **API Gateway**:
    * Language: Go
- **Service Discorvery**:
    * Language: Go

### Communication Patterns

- **Client to Gateway:** Gateway exposes all the endpoints using GraphQL.
- **Inter-Service Communication:** gRPC. By using gRPC, services can invoke methods in other services as if they were
  local procedures. This can simplify communication patterns and ensure type safety.

### Data Management

1. **Database per Service**: Each microservice will manage its own database. This ensures loose coupling, as each
   service has full control over its data model and is not dependent on other services.
2. **API for Data Access**: Services will not access each other's databases directly. Instead, they will use the defined
   APIs to request any required data from another service. This maintains encapsulation and ensures changes to one
   service's data model don't impact other services.

### Gateway GraphQL schema

```
type CategoryGraphqlType {
id: Int!
name: String!
description: String!
}

type ProductCategoryGraphqlType {
id: Int!
name: String!
}

type ProductGraphqlType {
id: Int!
name: String!
price: Float!
unitsAvailable: Int!
imageUrl: String!
categories: [ProductCategoryGraphqlType!]
}

type CartItemGraphqlType {
productId: Int!
quantity: Int!
imageUrl: String!
price: Int!
name: String!
}

type CartGraphqlType {
userId: Int!
items: [CartItemGraphqlType!]!
}

type OrderCreatedType {
orderId: Int!
}

type OrderStatusGraphqlType {
value: OrderStatus!
}

enum OrderStatus {
UNKNOWN
CREATED
APPROVED
PAID
PAYMENT_FAILED
ITEMS_REJECTED
UNRECOGNIZED
}

type Query {
orderStatus(orderId: Float!): OrderStatusGraphqlType!
hello: String!
categories: [CategoryGraphqlType!]!
product(id: Float!): ProductGraphqlType!
cart: CartGraphqlType
}

type Mutation {
login(input: AuthLoginInput!): String!
logout: String!
refresh: String!
registerUser(input: RegisterUserInput!): String!
createCategory(input: CreateCategoryInput!): CategoryGraphqlType!
createProduct(input: CreateProductInput!): ProductGraphqlType!
addToCart(input: CartItemInput!): String!
updateItemQuantity(input: UpdateItemInput!): String!
clearCart: String!
initOrder: OrderCreatedType!
removeItem(productId: Float!): String!
}

input AuthLoginInput {
email: String!
password: String!
}

input RegisterUserInput {
email: String!
password: String!
}

input CreateCategoryInput {
name: String!
description: String!
}

input CreateProductInput {
name: String!
price: Float!
imageUrl: String
unitsAvailable: Int!
categoriesIds: [Int!]!
}

input CartItemInput {
productId: Int!
quantity: Int!
}

input UpdateItemInput {
productId: Int!
newQuantity: Int!
}
```

### Deployment and Scaling

1. *Containerization with **Docker***: All services will be packaged as docker images.
2. *Orchestration with **Kubernetes***: Deploying the whole system in a k8s cluster what would provide load balancing,
   service discovery, fault tolerance and so on.

This setup will ensure scalability, reliability, and ease of management.

### To deploy the app:

1. Apply all the yaml files inside the k8s-infra folder to your local cluster.
2. Connect to the postgres instance and create all the required dbs:
   - kubectl port-forward pgsql 5432:5432
   - access the instance on localhost and create the dbs: user, catalog, payment, order
3. The gateway service will be available at localhost:30000, fetch the graphql schema and start calling the endpoints.
