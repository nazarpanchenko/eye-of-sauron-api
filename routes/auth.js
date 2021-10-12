const express = require('express');
const multer  = require('multer');
const upload = multer();
const DB = require('../db.js');
const authRouter = express.Router();

authRouter.post('/sign-up', [upload.none()], 
    function(req, res) {
       const body = JSON.parse(req.body.user);
       const { username, password } = body;
       
       const createUser = `INSERT INTO users
          (username, password, created_at) 
          VALUES(\'${username}'\, \'${password}'\, NOW())
       `;

       const getCreatedUser = `SELECT * FROM users
          WHERE username = \'${username}'
          LIMIT 1
       `;

        try {
            DB.query(createUser);

            DB.query(getCreatedUser, function(err, results) {
                const createdUser = results[0];
                console.log(createdUser);
                res.status(200).send(createdUser[createdUser.length - 1]);
            });

        } catch(err) {
            res.status(400).send({ status: 'signup failed', details: err.message });
        }
    }
);

authRouter.post('/sign-in', [upload.none()],
    function(req, res) {
       const user = JSON.parse(req.body.user);
       const { id } = user;

       const signInQuery = `SELECT * FROM users 
          WHERE id = \'${id}'\
          LIMIT 1
       `;

       try {
            DB.query(signInQuery, function(err, results) {
                const authorizedUser = results[0];
                
                req.session.userId = authorizedUser.userId;
                req.session.user = authorizedUser;
                res.status(200).send(authorizedUser);
            });

       } catch(err) {
            res.status(401).send({ status: 'authorization failed', details: err.message });
       }
    }
);

authRouter.get('/logout', 
    function(req, res) {
        req.session.destroy(function(err) {
            res.send({ status: 'Your user session have been terminated.' });
        });
    }
);

module.exports = authRouter;