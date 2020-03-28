# build stage
FROM node:lts-alpine as build-stage

ARG BASE_URL
ARG API_URL

ENV BASE_URL=${BASE_URL}
ENV API_URL=${API_URL}

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# production stage
FROM node:lts-alpine as production-stage

RUN npm i -g nuxt

COPY --from=build-stage /app/dist /usr/src/app/
EXPOSE 3030
CMD ["npm", "run", "start"]
