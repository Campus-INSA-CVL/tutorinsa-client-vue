FROM node:lts-alpine

ARG BASE_URL
ARG API_URL

ENV BASE_URL=${BASE_URL}
ENV API_URL=${API_URL}

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

EXPOSE 3030
CMD ["npm", "run", "start"]
