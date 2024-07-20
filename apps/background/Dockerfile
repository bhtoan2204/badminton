FROM node:20.10.0-alpine AS development

RUN apk update && apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm@10.8.0
RUN npm install --ignore-scripts

COPY libs ./libs
COPY proto ./proto
COPY apps/background ./apps/background
COPY tsconfig.json .
COPY nest-cli.json .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN npm run build background

FROM node:20.10.0-alpine AS production

RUN apk update && apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV NODE_ENV=${NODE_ENV} \
  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production --ignore-scripts

RUN adduser -D nonroot && chown -R nonroot:nonroot /usr/src/app

USER nonroot

COPY --from=development /usr/src/app/apps/background ./apps/background
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/libs ./libs
COPY --from=development /usr/src/app/proto ./proto

CMD ["node", "dist/apps/background/src/main.js" ]