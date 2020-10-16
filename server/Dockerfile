FROM node

# Install dependencies and copy source files
WORKDIR /usr/server
COPY package.json .
RUN npm install --quiet
COPY . .