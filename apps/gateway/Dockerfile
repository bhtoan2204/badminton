FROM node:20.10.0-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm@10.8.0
RUN npm install --ignore-scripts --legacy-peer-deps

COPY libs ./libs
COPY proto ./proto
COPY apps/gateway ./apps/gateway
COPY tsconfig.json .
COPY nest-cli.json .

RUN npm run build gateway

FROM node:20.10.0-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production --ignore-scripts --legacy-peer-deps

RUN adduser -D nonroot && chown -R nonroot:nonroot /usr/src/app

USER nonroot

COPY --from=development /usr/src/app/apps/gateway ./apps/gateway
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/libs ./libs
COPY --from=development /usr/src/app/proto ./proto

CMD ["node", "dist/apps/gateway/src/main.js" ]