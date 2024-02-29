FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --ignore-scripts

COPY . .

RUN npm run build storage

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production --ignore-scripts

RUN adduser -D nonroot && chown -R nonroot:nonroot /usr/src/app

USER nonroot

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD [ "node", "dist/apps/storage/main" ]