import { Sequelize } from 'sequelize'

import { dbhost, dbport, dbuser, dbpass, dbbase } from "./config";

const sequelize = new Sequelize(dbbase, dbuser, dbpass, {
    host: dbhost,
    port: dbport,
    dialect: 'mariadb',
    dialectOptions: {
        timezone: 'Etc/GMT+8',
    },
    logging: console.log,
});

export { sequelize }
