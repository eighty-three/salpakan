FROM node:14-buster-slim AS BUILD_IMAGE

RUN apt-get update && apt-get install -y git && apt-get install -y curl

RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

WORKDIR /src

COPY . .

# remove development dependencies
RUN npm install && npm prune --production && npm run build

# run node prune
RUN /usr/local/bin/node-prune

FROM node:14-buster-slim

WORKDIR /src

# copy from build image
COPY --from=BUILD_IMAGE /src/build ./build
COPY --from=BUILD_IMAGE /src/.env ./.env
COPY --from=BUILD_IMAGE /src/tsconfig.prod.json ./tsconfig.prod.json
COPY --from=BUILD_IMAGE /src/node_modules ./node_modules
COPY --from=BUILD_IMAGE /src/package.json ./package.json

CMD ["npm","run","startfast"]

# Ignore this

# FROM node:14-alpine

# WORKDIR /src

# COPY . .
# RUN npm install && npm prune --production

# CMD ["npm","start"]
