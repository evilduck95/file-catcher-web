FROM node:lts-alpine3.20 as build
WORKDIR /usr/app
COPY . /usr/app
RUN npm ci
RUN npm run build

FROM nginx:stable-alpine3.19-perl
EXPOSE 80
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/app/build /usr/share/nginx/html