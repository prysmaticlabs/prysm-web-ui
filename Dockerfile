FROM node:14-alpine

# set working directory
WORKDIR /app
ENV PORT 8080
EXPOSE $PORT

# install and cache app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Build
COPY . /app
RUN npm run build:prod

# Run on $PORT
CMD ng serve --host 0.0.0.0 --port $PORT --disableHostCheck
