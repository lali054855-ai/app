FROM node:18-alpine AS dependencies
WORKDIR /app
RUN apk add --no-cache --virtual .build-deps python3 make g++
COPY package*.json ./
RUN npm ci --omit=dev --build-from-source=true --nodedir=/usr/local

FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache libstdc++
COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules
COPY --chown=node:node package*.json ./
COPY --chown=node:node . .
EXPOSE 3000
USER node
CMD ["node", "./bin/www.js"]