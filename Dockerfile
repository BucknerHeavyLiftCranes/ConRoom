# Use the official Node.js image as the base
FROM node:22

# Set the working directory inside the container
WORKDIR /workspace


# Set the user to root to avoid permission issues during dependency installation
USER root

# Install git in the container (if not already installed)
RUN apt-get update && apt-get install -y git

# Copy the package.json and package-lock.json first to install dependencies
COPY package.json package-lock.json ./

# Install all dependencies (front-end, back-end, shared)
RUN npm install

# Copy the rest of the application code into the container
COPY . ./

# Expose the necessary port (adjust this if needed for your app)
EXPOSE 5173

# Set ownership of the entire workspace directory to the 'node' user
RUN chown -R node:node /workspace

# Set permissions to avoid EACCES errors during subsequent steps
RUN chmod -R 775 /workspace

# Switch to the non-root 'node' user
USER node

# Start both the back-end and front-end (adjust the command as necessary)
CMD ["npm", "run", "devStart"]
