// const User = require('./user')

// const express = require('express')
// const app = express()
// const port = 3000
// const hostname = '127.0.0.1';

// app.use(express.json())

// // Start de server
// app.listen(port, () => {
//   console.log(`Example app listening on port http://${hostname}:${port}/`)
// })


// let users = []
// users.push(new User(1, 'kelvin.lai@hotmail.com', 'Kelvin', 'Lai'))
// users.push(new User(2, 'lazlo.herwich@hotmail.com', 'Lazlo', 'Herwich'))

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.post('/', (req, res) => {
//   res.send('Got a POST request')
// })

// app.use('*', (req, res, next) => {
//   const method = req.method;
//   console.log(`Methode ${method} aangeroepen`);
//   next();
// })

// // //UC-102 Opvragen systeem informatie
// app.get('/api/info', (req, res)=> {
//     // let pad = req.request.pad;
//     // console.log('op route ${pad}')
//     res.status(201).json({
//     status:201,
//     message: 'Server info-endpoint',
//     data: {
//       studentName: 'Kelvin',
//       studentNumber: 2205459,
//       description: 'description'
//     },
//     });
//   });


// // UC-201 Registreren als nieuwe gebruiker
// app.post('/user/register', (req, res) => {
//   const { id, email, firstname, lastname } = req.body;
//   const newUser = new User(id, email, firstname, lastname);
//   users.push(newUser);
//   res.json(newUser);
// })

// // UC-202
// app.get('/user', (req, res) => {
//   res.setHeader('Content-Type', 'application/json')
//   res.json(users)
// })

// // UC-202 filteren field 1 en 2
// app.get('/user?field1=:value1&field2=:value2', (req, res) => {
//   const { field1, field2 } = req.query;
//   const filteredUsers = users.filter(u => u.field1 === field1 && u.field2 === field2);
//   res.setHeader('Content-Type', 'application/json');
//   res.json(filteredUsers);
// })

// // UC-203
// app.get('/user/profile', (req, res) => {
//   // const userId = req.user.id;
//   // const userProfile = users.find(u => u.getId() === userId);
//   // res.setHeader('Content-Type', 'application/json');
//   // res.json(userProfile);
//   res.send('This function has not been implemented')
// })

// // UC-204
// app.get('/user/:id', (req, res) => {
//   res.setHeader('Content-Type', 'application/json')
//   let user = users.find(u => u.getId()===parseInt(req.params.id))
//   if (!user) return res.status(404).json({error: 'Unable to find user'})
//   res.json(user)
// })


// // UC-205
// app.put('/user/:id', (req, res) => {
//   const userId = parseInt(req.params.id);
//   const { email, firstname, lastname } = req.body;
//   const userIndex = users.findIndex(u => u.getId() === userId);
//   if (userIndex === -1) {
//     return res.status(404).json({ error: 'Unable to find user' });
//   }
//   const updatedUser = { ...users[userIndex], email, firstname, lastname };
//   users[userIndex] = updatedUser;
//   res.json(updatedUser);
// })

// // UC-206
// app.delete('/user/:id', (req, res) => {
//   const userId = parseInt(req.params.id);
//   const userIndex = users.findIndex(u => u.getId() === userId);
//   if (userIndex === -1) {
//     return res.status(404).json({ error: 'Unable to find user' });
//   }
//   const deletedUser = users.splice(userIndex, 1)[0];
//   res.json(deletedUser);
// })


// app.use((req, res, next) => {
//   res.status(404).send("Sorry can't find that!")
// })

// app.use((err, req, res, next) => {
//   console.error(err.stack)
//   res.status(500).send('Something broke!')
// })

// // Export de server zodat die in de tests beschikbaar is.
// module.exports = app;

const express = require('express');
const assert = require('assert');
const logger = require('./src/util/utils').logger;
const userRoutes = require('./src/routes/user.routes');

const app = express();
const port = 3000;

// For access to application/json request body
app.use(express.json());

// Algemene route, vangt alle http-methods en alle URLs af, print
// een message, en ga naar de next URL (indien die matcht)!
app.use('*', (req, res, next) => {
  const method = req.method;
  logger.trace(`Methode ${method} is aangeroepen`);
  next();
});

// Info endpoints
app.get('/api/info', (req, res) => {
  logger.info('Get server information');
  res.status(201).json({
    status: 201,
    message: 'Server info-endpoint',
    data: {
      studentName: 'Kelvin',
      studentNumber: 2205459,
      description: 'Welkom bij de server API van de share a meal.'
    }
  });
});

// Hier staan de referenties naar de routes
app.use('/api/user', userRoutes);

// Wanneer geen enkele endpoint matcht kom je hier terecht. Dit is dus
// een soort 'afvoerputje' (sink) voor niet-bestaande URLs in de server.
app.use('*', (req, res) => {
  logger.warn('Invalid endpoint called: ', req.path);
  res.status(404).json({
    status: 404,
    message: 'Endpoint not found',
    data: {}
  });
});

// Start de server
app.listen(port, () => {
  logger.info(`Example app listening on port ${port}`);
});

// Export de server zodat die in de tests beschikbaar is.
module.exports = app;
