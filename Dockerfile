FROM node:22-alpine

WORKDIR /app

COPY index.html blog.html portfolio.html ./
COPY image.png background.jpg ./
COPY assets ./assets
COPY server.js ./server.js

ENV NODE_ENV=production
ENV PORT=80
ENV MULTI_SCROBBLER_BASE_URL=http://multi-scrobbler:9078

EXPOSE 80

CMD ["node", "server.js"]
