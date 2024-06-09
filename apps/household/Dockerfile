FROM node:20.10.0-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm@10.8.0
RUN npm install --ignore-scripts

COPY libs ./libs
COPY proto ./proto
COPY apps/household ./apps/household
COPY tsconfig.json .
COPY nest-cli.json .

RUN npm run build household

FROM node:20.10.0-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g pm2
RUN npm install --only=production --ignore-scripts

RUN adduser -D nonroot && chown -R nonroot:nonroot /usr/src/app

USER nonroot

COPY --from=development /usr/src/app/apps/household ./apps/household
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/libs ./libs
COPY --from=development /usr/src/app/proto ./proto

CMD ["pm2-runtime", "dist/apps/household/src/main.js" ]