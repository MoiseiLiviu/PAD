# Stage 1: Build
FROM node:18 as build

WORKDIR /usr/src/app

# Download grpc-health-probe binary
RUN apt-get update && apt-get install -y wget && \
    wget -qO/grpc-health-probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/v0.4.4/grpc_health_probe-linux-amd64 && \
    chmod +x /grpc-health-probe

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Run
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./
# Copy grpc-health-probe binary
COPY --from=build /grpc-health-probe /usr/local/bin/

EXPOSE 5004

CMD [ "node", "dist/main.js" ]
