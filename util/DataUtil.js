

const { Pool } = require('pg')

const pool = new Pool({
    user: 'deployment_app',
    host: 'devdb2.nex.lan',
    database: 'dev2',
    password: 'd',
    port: '5432'
});

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback)
    }
};
