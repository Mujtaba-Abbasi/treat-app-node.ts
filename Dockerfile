FROM node:20

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json ./
COPY tsconfig*.json ./
COPY pnpm*.yaml ./

RUN pnpm install

COPY src ./src

ENV NODE_ENV=production

EXPOSE 4000

CMD ["pnpm", "start"]