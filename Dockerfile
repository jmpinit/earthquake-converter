FROM resin/raspberrypi3-node

WORKDIR /usr/src/app

COPY package.json package.json

RUN npm install

COPY . .

CMD ["node", "src/index.js"]
