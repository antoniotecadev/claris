FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Configurações para evitar quedas de rede (ECONNRESET)
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]