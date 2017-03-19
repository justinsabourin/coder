mongod --fork --logpath /home/server/logs/mongodb.log
haproxy -f haproxy.cfg
redis-server redis.conf
NODE_ENV="production" npm start --prefix frontend &
NODE_ENV="production" npm start --prefix authorization &
NODE_ENV="production" npm start --prefix content &
NODE_ENV="production" npm start --prefix projects 
