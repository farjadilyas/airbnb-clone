# Getting the latest version
FROM node:latest

# Setting the working directory for app
WORKDIR /app

# Copying the package files
COPY package.json ./

# Installing node modules
RUN npm install --legacy-peer-deps

# Copy app src
COPY . .

# Exposing the React port
EXPOSE 3000

# Running the application (Entry Point)
CMD ["npm", "start"]
