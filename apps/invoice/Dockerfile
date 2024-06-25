FROM node:20.10.0-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk --no-cache add curl bash python3

# Downloading gcloud package
RUN curl https://dl.google.com/dl/cloudsdk/release/google-cloud-sdk.tar.gz > /tmp/google-cloud-sdk.tar.gz

# Installing the package
RUN mkdir -p /usr/local/gcloud
RUN tar -C /usr/local/gcloud -xvf /tmp/google-cloud-sdk.tar.gz 
RUN cat /usr/local/gcloud/google-cloud-sdk/install.sh
RUN /usr/local/gcloud/google-cloud-sdk/install.sh

# Adding the package path to local
ENV PATH $PATH:/usr/local/gcloud/google-cloud-sdk/bin

RUN npm install -g npm@10.8.0
RUN npm install --ignore-scripts

COPY libs ./libs
COPY proto ./proto
COPY apps/invoice ./apps/invoice
COPY tsconfig.json .
COPY nest-cli.json .

RUN npm run build invoice

FROM node:20.10.0-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV GOOGLE_APPLICATION_CREDENTIALS=/usr/src/app/apps/invoice/famfund-project-418407-51ac3415ac0d.json

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production --ignore-scripts
RUN gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}
RUN adduser -D nonroot && chown -R nonroot:nonroot /usr/src/app

USER nonroot

COPY --from=development /usr/src/app/apps/invoice ./apps/invoice
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/libs ./libs
COPY --from=development /usr/src/app/proto ./proto

CMD ["node", "dist/apps/invoice/src/main.js" ]