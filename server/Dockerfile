FROM node:latest

EXPOSE 5000

RUN npm install npm@latest -g

WORKDIR /usr/src/server

ARG NODE_ENV

ENV NODE_ENV $NODE_ENV

COPY package*.json /usr/src/server/

RUN npm install

COPY . /usr/src/server

ENV PORT 5000

EXPOSE $PORT

CMD [ "make", "migrate"]

ENTRYPOINT ["make", "start"]
