import express from 'express';
import bodyParser from 'body-parser';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/user';
import initSequelize from './util/initSequelize';

dotenv.config();
const app = express();
const sequelize = initSequelize();
const now = new Date();

app.use(bodyParser.json());

app.get('/api/users', (req, res) => {
  sequelize.authenticate()
    .then(() => {
      User.sync()
        .then(() => {
          User.findAll()
          .then((users) => {
            res.json({
              users
            });
          })
          .catch((err) => {
            res.json({ message: err.toString() });
          });
        })
        .catch((err) => {
          res.json({ message: err.toString() });
        });
    })
    .catch((err) => {
      res.json({ message: err.toString() });
    });
});

app.post('/api/users', (req, res) => {
  User.sync()
    .then(() => {
      const reqPayload = req.body;
      const newUser = {
        firstName: reqPayload.firstName,
        lastName: reqPayload.lastName,
        username: reqPayload.username,
        password: bcryptjs.hashSync(reqPayload.password, 10),
        roleId: reqPayload.roleId,
        signUpDate: now.toISOString(),
        updatedAt: now.toISOString()
      };
      User.create(newUser)
        .then(() => {
          res.json({ message: `Yippe!! User ${newUser.firstName} was created.` });
        })
        .catch((err) => {
          res.json({ message: err.toString() });
        });
    })
    .catch((err) => {
      res.json({ message: err.toString() });
    });
});

export default app;
