FROM node:8-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "npm-shrinkwrap.json*", "./"]
RUN npm config set registry https://registry.npm.taobao.org && \
 npm install --production --silent && mv node_modules ../ && \
 mkdir ~/logs
COPY . .
EXPOSE 8888
CMD node server.js