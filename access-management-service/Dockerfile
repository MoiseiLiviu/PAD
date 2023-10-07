# Stage 1: Build
FROM node:18 as build

WORKDIR /usr/src/app

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

# Add Python and other build tools to compile bcrypt for Alpine
RUN apk add --no-cache --virtual .build-deps python3 make g++ \
&& npm rebuild bcrypt --build-from-source \
&& apk del .build-deps

EXPOSE 5001

CMD [ "node", "dist/main.js" ]
