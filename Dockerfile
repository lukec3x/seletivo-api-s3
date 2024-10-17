FROM node:20.18.0-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]
