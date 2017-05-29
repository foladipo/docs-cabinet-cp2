import express from 'express';
import bodyParser from 'body-parser';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/user';
import Document from './models/document';
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
        createdAt: now.toISOString(),
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

app.get('/api/documents', (req, res) => {
  sequelize.authenticate()
    .then(() => {
      Document.sync()
        .then(() => {
          Document.findAll()
          .then((documents) => {
            res.json({
              documents
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

app.post('/api/documents', (req, res) => {
  Document.sync()
    .then(() => {
      const reqPayload = req.body;
      const newDocument = {
        title: reqPayload.title,
        docContent: reqPayload.docContent,
        access: reqPayload.access,
        categories: reqPayload.categories,
        tags: reqPayload.tags,
        createdBy: reqPayload.userId,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };
      Document.create(newDocument)
        .then(() => {
          res.json({ message: `Wawu!! Document '${newDocument.title}' was created.` });
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
