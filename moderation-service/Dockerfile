FROM node:alpine
WORKDIR /app
copy package.json ./
RUN npm install
copy ./ ./
CMD ["npm", "start"]
