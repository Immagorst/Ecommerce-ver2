# Dockerfile for user-service

# Stage 1: Build the application
FROM node:18-alpine AS builder

# Add this line to install the postgresql client
RUN apk add --no-cache postgresql-client

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# Add entrypoint and copy wait-for-postgres.sh
COPY wait-for-postgres.sh ./
RUN chmod +x ./wait-for-postgres.sh
RUN npm run build

# Stage 2: Create the production image
FROM node:18-alpine
WORKDIR /usr/src/app

# Also add the client and script to the production image
RUN apk add --no-cache postgresql-client
COPY wait-for-postgres.sh ./
RUN chmod +x ./wait-for-postgres.sh

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

# Make sure your CMD or ENTRYPOINT uses the script
ENTRYPOINT ["./wait-for-postgres.sh"]
CMD ["user-service-db", "node", "dist/main"]