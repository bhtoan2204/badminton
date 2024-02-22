FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --ignore-scripts

COPY . .

RUN npm run build gateway

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production --ignore-scripts

COPY --from=development /usr/src/app/dist ./dist

RUN addgroup -S nodegroup && adduser -S nodeuser -G nodegroup
USER nodeuser

CMD [ "node", "dist/apps/gateway/main" ]