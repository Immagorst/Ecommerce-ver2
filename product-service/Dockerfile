# Dockerfile for product-service

# Stage 1: Build the binary
FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY . .
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o /product-service-app .

# Stage 2: Create the final image
FROM alpine:latest
WORKDIR /
COPY --from=builder /product-service-app /product-service-app
EXPOSE 8080
ENTRYPOINT ["/product-service-app"]