const validations = require('../../src/shared/model-validations');

module.exports = {

    // DB
    dbUri: 'mongodb://localhost/mydb',

    logging: {
        dbUri: 'mongodb://localhost/mydb'
    },

    // jsonwebtoken secret
    jwtSecret: '!!secret phrase!!',

    // Model validations
    validations // :validations
};