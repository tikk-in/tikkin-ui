FROM node:20-alpine as build

COPY . /app
WORKDIR /app

RUN corepack enable
RUN corepack install
RUN yarn install
RUN yarn build

FROM nginx:1.27-alpine

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html



