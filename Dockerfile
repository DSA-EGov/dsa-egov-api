FROM node:20-slim

WORKDIR /app

RUN npm install -g npm@10.2.5 && \
     npm install -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000
CMD [ "node", "dist/main.js" ]
