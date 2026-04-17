FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY index.html blog.html portfolio.html ./
COPY image.png ./image.png
COPY assets ./assets

EXPOSE 80
