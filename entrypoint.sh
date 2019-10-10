#!/bin/sh

set -x

# Kill myself
rm -rf Dockerfile entrypoint.sh

# Cron time
if [ -z "$RESTART" ]; then
    RESTART=60
fi

# NODE_ENV
if [ -z "$NODE_ENV" ]; then
    NODE_ENV=development
else
    NODE_ENV=production
fi

# Test flag
if [ -z "$FLAG" ]; then
    FLAG="d3ctf{Th1s_is_an_3xamp1e_fl114g}"
fi

# Database environment configuration
## Starting mysql
mysqld_safe &

## Waiting for mysql
sleep 10

## Init database
if [ -z "$DBBASE" ]; then
    DBBASE=ctf
fi

if [ -z "$DBUSER" ]; then
    DBUSER=ctf
fi

if [ -z "$DBPASS" ]; then
    DBPASS=$(cat /dev/urandom | head -n 10 | md5sum | head -c 32)
fi

mysql -e "CREATE DATABASE ${DBBASE};"
mysql -e "GRANT USAGE ON *.* TO '${DBUSER}'@'localhost' IDENTIFIED BY '${DBPASS}' WITH GRANT OPTION; GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP ON ${DBUSER}.* TO '${DBUSER}'@'localhost' IDENTIFIED BY '${DBPASS}'; GRANT EXECUTE ON ${DBBASE}.* TO '${DBUSER}'@'localhost' IDENTIFIED BY '${DBPASS}'; FLUSH PRIVILEGES;"
mysql -e "CREATE TABLE ${DBBASE}.Users (id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, username varchar(255), password varchar(255), data longtext, createdAt datetime NOT NULL, updatedAt datetime NOT NULL);"
mysql -e "INSERT INTO ${DBBASE}.Users (id, username, password, data, createdAt, updatedAt) VALUES (1, 'admin', '$(cat /dev/urandom | head -n 10 | md5sum | head -c 16)', '{\"Hint\":\"You know, I love to put important things in my memory, instead of disks or files.\"}','2019-10-10 00:00:00', '2019-10-10 00:00:00');"

# Install deps
cd /app && yarn
chown -R www.www /app

# Modify for prototype pollution
sed -i '412a\       if (key !== "username" && key !== "id" && key !== "password" && key !== "data" && key !== "createdAt" && key !== "updatedAt") { continue; }' \
    /app/node_modules/sequelize/lib/dialects/abstract/query-generator.js

# Install typescript
npm i typescript -g

# Compile source code
su - www -c "cd /app && rm -rf dist && mkdir dist && cp -r ./src/views ./dist/views && tsc"

# Ready to start
while true; do
    echo "Starting..."
    su - node -c "DBUSER=${DBUSER} DBPASS=${DBPASS} DBBASE=${DBBASE} NODE_ENV=${NODE_ENV} FLAG=${FLAG} LISTENADDR=0.0.0.0 node /app/dist/index.js" &
    sleep ${RESTART}
    echo "Restarting...."
    killall node
    mysql -e "UPDATE ${DBBASE}.Users SET data=NULL where id != 1;"
done;
