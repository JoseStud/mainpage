FROM node:22-alpine

WORKDIR /app

COPY public ./public
COPY src/server ./src/server

ENV NODE_ENV=production
ENV PORT=80
ENV MULTI_SCROBBLER_BASE_URL=http://multi-scrobbler:9078

EXPOSE 80

CMD ["node", "src/server/index.js"]
