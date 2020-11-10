FROM node:14.15.0

# Install dependencies and copy source files
WORKDIR /home/trevor/aurora/server
COPY package.json .
RUN npm install
COPY . .