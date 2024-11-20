# FROM node:18-alpine


# RUN apk add --no-cache \
#     python3 \
#     py3-pip \
#     build-base \
#     pkgconf \
#     cairo-dev \
#     pango-dev \
#     libjpeg-turbo-dev \
#     giflib-dev

# WORKDIR /app

# COPY package.json .

# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD ["npm", "start"]


# Use the base image for Node.js
FROM node:20-alpine

# Install dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    py3-setuptools \
    python3-dev \
    build-base \
    pkgconf \
    cairo-dev \
    pango-dev \
    libjpeg-turbo-dev \
    giflib-dev

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]