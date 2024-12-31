# Step 1: Build React App
FROM node:18-alpine

# Set the working directory
WORKDIR /bookbee-frontend

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code and build
COPY . .
RUN npm run build

# Expose port 80 for AWS
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]