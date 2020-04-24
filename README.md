# DemographicsPrediction

Node installation:

1. curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
2. sudo apt-get install nodejs

node --version (should be 12.16.2)

npm --version (should be 6.14.4)

---
Inside backend dir run:

1. npm install (only once)
2. node server/server.js

---
Notes:

- package.json: Contains a list of the packages that we manually add using npm install --save < packagename >
- package-lock.json: Is auto created and gets updated on every npm install. Contains the dependencies of our packages.
- node_modules: Is auto created on npm install. Contains the files of our packages and their dependencies. We do not commit this dir.
