FROM node:17.8-alpine

COPY . /srv

WORKDIR /srv

RUN npm install
RUN npm install -g serve
RUN npm install jszip
RUN npm install d3
RUN npm install react-loader-spinner --save

RUN npm run build

CMD ["serve", "-s", "build", "-l", "3000"]