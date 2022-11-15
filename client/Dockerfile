# builder
FROM node:18-alpine as builder

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL $REACT_APP_API_URL

ARG REACT_APP_API_BASE
ENV REACT_APP_API_BASE $REACT_APP_API_BASE

WORKDIR /app

COPY . .

RUN npm install npm@latest -g

RUN npm ci 

RUN npm run build --verbose



# Bundle static assets with nginx
FROM nginx:alpine as production

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY --from=builder /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
