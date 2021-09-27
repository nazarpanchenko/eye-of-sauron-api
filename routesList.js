const dotenv = require('dotenv').config();

const routes = [
    {
        name: 'Main',
        path: `${process.env.API_BASE_URL}`
    },
    {
        name: 'Authorization',
        path: `${process.env.API_BASE_URL}/auth/sign-up`
    }
];

module.exports = routes;