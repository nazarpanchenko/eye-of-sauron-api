const dotenv = require('dotenv').config();

const routes = [
    {
        name: 'Authorization',
        path: `${process.env.API_BASE_URL}/auth/sign-up`
    }
];

module.exports = routes;