# Use the official Golang image to create a build artifact.
FROM golang:1.20 AS builder

# Set the working directory outside of $GOPATH to enable the support for Go modules.
WORKDIR /src

# Copy go mod and sum files first
COPY go.mod go.sum ./

# Install dependencies
RUN go mod download

# Copy the local package files to the container workspace.
COPY . .

# Build the application.
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /go/bin/api-gateway

# Use the alpine image to create a lean production container.
FROM alpine:3.15 AS final

# Install necessary libraries for security.
RUN apk --no-cache add ca-certificates

# Set the binary to the container's binary directory.
COPY --from=builder /go/bin/api-gateway /go/bin/api-gateway

# Set the current directory.
WORKDIR /root/

# Command to run the executable.
ENTRYPOINT ["/go/bin/api-gateway"]
