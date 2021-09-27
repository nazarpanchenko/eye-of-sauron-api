const express = require('express');
const multer  = require('multer');
const upload = multer();
const DB = require('../db.js');
const authRouter = express.Router();

authRouter.post('/sign-up', [upload.none()], 
    function(req, res) {
       const body = JSON.parse(req.body.user);
       const { username, password } = body;

       let allUsers = [];
       let createdUser = {};
       let createdUserId = null;
       
       const createUser = `INSERT INTO users
          (username, password, created_at) 
          VALUES(\'${username}'\, \'${password}'\, NOW())
       `;

       const getAllUsers = `SELECT * FROM users`;

       const getCreatedUser = `SELECT * FROM users
          WHERE id = ${createdUserId}
       `;

        try {
            DB.query(createUser, function(err) {
                if (err) {
                    throw err;
                }
            });

            DB.query(getAllUsers, function(err, results) {
                if (err) {
                    throw err;
                } else {
                    allUsers = [ ...results ];
                }
            });
            createdUserId = allUsers[allUsers.length - 1];

            DB.query(getCreatedUser, function(err, results) {
                if (err) {
                    throw err;
                } else {
                    createdUser = results[0];
                }
            });

            res.status(200).send(createdUser);
        } catch(err) {
            res.status(400).send({ status: 'signup failed', details: err.message });
        } finally {
            DB.end();
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
            DB.query(signInQuery, 
                function(err, results) {
                    if (err) {
                        throw err;
                    } else {
                        const authorizedUser = results[0];
                        req.session.userId = authorizedUser.userId;
                        req.session.user = authorizedUser;
                        res.status(200).send(authorizedUser);
                    }
                }
            );
       } catch(err) {
            res.status(401).send({ status: 'authorization failed', details: err.message });
       } finally {
           DB.end();
       }
    }
);

authRouter.get('/logout', 
    function(req, res) {
        req.session.destroy(function(err) {
            res.send('You have been logged out.');
        });
    }
);

module.exports = authRouter;