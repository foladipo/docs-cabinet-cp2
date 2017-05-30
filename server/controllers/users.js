import express from 'express';

const user = express();

function login(req, res) {
  res.json({ yippee: 'Got here men!' });
}

function logout(req, res) {
  res.json({ yippee: 'This is the logout function.' });
}

function signUp(req, res) {
  res.json({ yippee: 'You want to sign up? Fantastic!' });
}

function updateUserProfile(req, res) {
  res.json({ yippee: 'What\'s new, dear user?' });
}

function deleteUser(req, res) {
  res.json({ yippee: 'Awww... We are sorry to see you go...' });
}

/* Four use cases:
GET /users/ - Find matching instances of user.
GET /users/?limit={integer}&offset={integer} - Pagination for users.
GET /users/<id> - Find user.
GET /users/<id>/documents - Find all documents belonging to the user.*/
function findUsers(req, res) {
  res.json({ yippee: 'You want to know who else uses this app, no?' });
}

user.post('/login', login);
user.post('/logout', logout);
user.post('/', signUp);
user.put('/', updateUserProfile);
user.delete('/', deleteUser);
user.get('/', findUsers);

export default user;
