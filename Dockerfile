FROM node:14-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . /app
RUN npm run build:prod

# start app
CMD npm run ng serve --host 0.0.0.0

