const validations = require('../../src/shared/model-validations');

module.exports = {

    // DB
    dbUri: 'mongodb://localhost/mydb',

    logging: {
        dbUri: 'mongodb://localhost/multi-tenant-logs'
    },

    // jsonwebtoken secret
    jwtSecret: '!!secret phrase!!',

    // Model validations
    validations // :validations
};