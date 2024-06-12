FROM node:20.10.0-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm@10.8.0
RUN npm install --ignore-scripts

COPY libs ./libs
COPY proto ./proto
COPY apps/family ./apps/family
COPY tsconfig.json .
COPY nest-cli.json .

RUN npm run build family

FROM node:20.10.0-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production --ignore-scripts

RUN adduser -D nonroot && chown -R nonroot:nonroot /usr/src/app

USER nonroot

COPY --from=development /usr/src/app/apps/family ./apps/family
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/libs ./libs
COPY --from=development /usr/src/app/proto ./proto

CMD ["node", "dist/apps/family/src/main.js" ]
