FROM node:20-alpine

WORKDIR /app

RUN apk update
RUN apk upgrade
RUN npm upgrade -g
RUN npm i -g --force pnpm

COPY package*.json ./
RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000
CMD [ "node", "dist/main.js" ]
