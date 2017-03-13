# An Online Web Editor

# Running the application
Install [MongoDB](https://docs.mongodb.com/getting-started/shell/installation/), [Redis](https://redis.io/download), [HAProxy](http://www.haproxy.org/#down) and start them all (To start haproxy, go to root of repository and run ```haproxy -f haroxy.cfg```).

## Run Frontend
```
cd frontend
npm install
npm run watch
```

## Run Authentication Service
```
cd authorization
npm install
node app.js
``` 

## Run Project Service
```
cd projects
npm install
node app.js
```
# Team Members

Justin Sabourin
Gordon Chan

# Description

We will be creating an online editor where users can:

1. Sign up (Optional: github sign in)
2. Create a new project
3. Start developing a website using html, css and javascript. They will be presented with an editor, where they can write their code. They will also be able to see a directory tree where they can create new files and folders, delete files or open a file in the editor. The editor will support multiple tabs and autosave. 
4. Can choose to create a new repository on github with their project (if they are signed in through github). They should have the option to see what files have changed, track files and commit them through the Web UI.
5. Be able to open a new tab and view their webpage, as they write the code.




# Key feautures for beta version

For the beta version:

1. Authentication (Sign in, Sign up)
2. Be able to view projects
3. Editor and directory tree should be finished (not autosave)
4. Be able to view their webpage


# Key features for final version

For final version:
1. Autosave completed
2. Github integration



# Technology we will use

## Frontend

In the front end we will use React and Redux. For the editor we will use Ace editor. For autosave we will use socket-io.

## Backend

In the backend we will use nodejs and express. For our database we will use mongodb. For our session store we will use redis. For our reverse proxy we will haproxy. For autosave we will use socket-io.

# Description of technical challenges

We must figure out a good way to store tree like structures (file directories) in our database. MongoDB has a few different models to accomplish this, so we must investigate these further. 

The github integration will require:
1. Use of the github API
2. Finding a way to transform our data model into a form that will allow us to communicate with github (finding diffs, making commits)
3. Keeping our data model in sync if the user makes commits to the repository outside of our application.

A possible security issue that we're going to be serving websites that have not been generated by us. We must make sure there are no security exploits (like being able to access routes that require authentication).

The autosave feature will require real time synchronization with the user and the server. On top of this, we must find an effecient way of sending updated information about files without sending extraneous, unneccessary information (like sending the whole file each time a file changed)





