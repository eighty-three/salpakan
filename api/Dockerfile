FROM node:14-alpine AS BUILD_IMAGE

RUN apk update && apk add bash && apk add curl && apk add git

RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

WORKDIR /src

COPY . .

# remove development dependencies
RUN npm install --production && npm run build

# run node prune
RUN /usr/local/bin/node-prune

FROM node:14-alpine

WORKDIR /src

# copy from build image
COPY --from=BUILD_IMAGE /src/build ./build
COPY --from=BUILD_IMAGE /src/.env ./.env
COPY --from=BUILD_IMAGE /src/tsconfig.prod.json ./tsconfig.prod.json
COPY --from=BUILD_IMAGE /src/node_modules ./node_modules
COPY --from=BUILD_IMAGE /src/package.json ./package.json

RUN ls -a
RUN ls ./build/utils


 CMD ["npm","run","startfast"]

# Ignore this

# FROM node:14-alpine

# WORKDIR /src

# COPY . .
# RUN npm install && npm prune --production

# CMD ["npm","start"]
