FROM node:lts-alpine@sha256:dc7cbd288ba1e4a67443f3ed756a042dfeba26349b873e6fd5f1b0909237bdc1
RUN apk add dumb-init
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --chown=node:node ./dist /usr/src/app
# COPY --chown=node:node ./package.json /usr/src/app
# COPY --chown=node:node ./package-lock.json /usr/src/app
# COPY --chown=node:node .env /usr/src/app
# RUN npm ci --only=production
USER node
CMD ["dumb-init", "node", "index.js"]