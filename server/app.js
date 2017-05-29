import express from 'express';
import bodyParser from 'body-parser';
import Sequelize from 'sequelize';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/user';
import initSequelize from './util/initSequelize';

dotenv.config();
const app = express();
const sequelize = initSequelize();
const now = new Date();

app.use(bodyParser.json());

app.get('/api', (req, res) => {
  sequelize
    .authenticate()
    .then(() => {
      const Test = sequelize.define('test80', {
        firstName: {
          type: Sequelize.STRING
        },
        lastName: {
          type: Sequelize.STRING
        }
      });

      Test.sync()
        .then(() => {
          // Table created
          const testUser = {
            firstName: 'John',
            lastName: 'Hancock'
          };
          Test.create(testUser)
            .then(() => {
              res.json({ message: `User ${testUser.toString()} was created.` });
            });
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
