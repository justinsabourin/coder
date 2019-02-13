# An Online Web Editor


# Running the application with docker [only works in deployment]

```
mv docker-compose.yaml.old docker-compose.yaml
docker-compose up
```

# Running the application locally
Install [MongoDB](https://docs.mongodb.com/getting-started/shell/installation/) and [Memcached](https://memcached.org/downloads).

Open `app/config.dev.js` and change repoPath to `<ABSOLUTE PATH TO GIT REPO>/repositories`

## Run development
```
cd app
npm install
npm start
```

Then it should be running at [http://localhost:8080](http://localhost:8080)
