// Onze lokale 'in memory database'. Later gaan we deze naar een
// aparte module (= apart bestand) verplaatsen.
let database = {
  users: [
    {
      id: 0,
      firstName: 'Hendrik',
      lastName: 'van Dam',
      emailAdress: 'hvd@server.nl',
      isActive: '',
      password: '',
      phoneNumber: '',
      roles: '',
      street: '',
      city: '',
    },
    {
      id: 1,
      firstName: 'Marieke',
      lastName: 'Jansen',
      emailAdress: 'm@server.nl',
      isActive: '',
      password: '',
      phoneNumber: '',
      roles: '',
      street: '',
      city: '',
    }
  ],


  index: 2
};

module.exports = database;
// module.exports = database.index;
