# Use the official Node.js image from Docker Hub
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock if available
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container at /app
COPY . .

# Expose the port that the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]
