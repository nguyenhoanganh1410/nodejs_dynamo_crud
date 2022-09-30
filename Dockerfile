FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# The app that I am running uses the port 3000, we will be using EXPOSE instruction so that it can be mapped by the docker daemon: 
EXPOSE 3000

# And then the final command to start our project with npm start:
CMD ["npm","start"]
