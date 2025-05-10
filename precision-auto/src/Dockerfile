FROM node:18-alpine
WORKDIR /app

# First copy ONLY package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install
COPY . . 

CMD ["npm", "run", "dev"]