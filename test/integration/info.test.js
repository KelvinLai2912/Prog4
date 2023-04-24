const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../Index')
chai.should()
chai.use(chaiHttp)


describe('UC-102 Informatie opvragen', function () {
    it('TC-102-1 - Server info should return succesful information', (done) => {
      chai
        .request(server)
        .get('/api/info')
        .end((err, res) => {
          res.body.should.be.an('object');
          res.body.should.has.property('status').to.be.equal(201);
          res.body.should.has.property('message');
          res.body.should.has.property('data');
          let { data, message } = res.body;
          data.should.be.an('object');
          data.should.has.property('studentName').to.be.equal('Kelvin');
          data.should.has.property('studentNumber').to.be.equal(2205459);
          done();
        });
    });
  
    it('TC-102-2 - Server should return valid error when endpoint does not exist', (done) => {
      chai
        .request(server)
        .get('/api/doesnotexist')
        .end((err, res) => {
          assert(err === null);
  
          res.body.should.be.an('object');
          let { data, message, status } = res.body;
  
          status.should.equal(404);
          message.should.be.a('string').that.is.equal('Endpoint not found');
          data.should.be.an('object');
  
          done();
        });
    });
  });
  

 // TC-201-5 Gebruiker succesvol geregistreerd
 describe('UC-201 Register a new user', () => {
 it('TC-201-5 - User successfully registered', (done) => {
  chai
    .request(server)
    .post('/api/user')
    .send({
      firstName: 'John',
      lastName: 'Doe',
      emailAdress: 'johndoe@example.com',
      // Add other required fields
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.have.property('status').to.be.equal(200);
      res.body.should.have.property('message');
      res.body.should.have.property('data');
      const { data } = res.body;
      data.should.be.an('object');
      data.should.have.property('id');
      data.should.have.property('firstName').to.be.equal('John');
      data.should.have.property('lastName').to.be.equal('Doe');
      data.should.have.property('emailAdress').to.be.equal('johndoe@example.com');
      // Validate other fields
      done();
    });
  });
});

// TC-202-1 Toon alle gebruikers (minimaal 2)
describe('UC-202 Get all users', () => {
it('TC-202-1 - Show all users (minimum 2)', (done) => {
  chai
    .request(server)
    .get('/api/user')
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.have.property('status').to.be.equal(200);
      res.body.should.have.property('message');
      res.body.should.have.property('data');
      const { data } = res.body;
      data.should.be.an('array').that.has.lengthOf.at.least(2);
      done();
    });
  });
});  

// TC-204-3 Gebruiker-ID bestaat
describe('UC-204 Get user by ID', () => {
it('TC-204-3 - User ID exists', (done) => {
  const userId = 0; // Assuming user with ID 0 exists in the in-memory database
  chai
    .request(server)
    .get(`/api/user/${userId}`)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.have.property('status').to.be.equal(200);
      res.body.should.have.property('message');
      res.body.should.have.property('data');
      const { data } = res.body;
      data.should.be.an('object');
      data.should.have.property('id').to.be.equal(userId);
      // Validate other user properties
      done();
    });
  });
});  

// UC-206 Verwijderen van user
describe('UC-206 Delete user', () => {
  it('TC-206-4 - User successfully deleted', (done) => {
    // Voeg eerst een nieuwe gebruiker toe om te verwijderen
    const userToDelete = {
      firstName: 'John',
      lastName: 'Doe',
      emailAdress: 'johndoe@test.com'
    };

    chai
      .request(server)
      .post('/api/user')
      .send(userToDelete)
      .end((err, postRes) => {
        postRes.should.have.status(200);
        postRes.body.should.be.an('object');
        postRes.body.should.have.property('data');
        const createdUserId = postRes.body.data.id;

        // Verwijder de zojuist aangemaakte gebruiker
        chai
          .request(server)
          .delete(`/api/user/${createdUserId}`)
          .end((err, deleteRes) => {
            deleteRes.should.have.status(200);
            deleteRes.body.should.be.an('object');
            deleteRes.body.should.have.property('message').to.be.equal(`User met id ${createdUserId} is verwijderd`);

            // Controleer of de gebruiker daadwerkelijk is verwijderd
            chai
              .request(server)
              .get('/api/user')
              .end((err, getRes) => {
                getRes.should.have.status(200);
                getRes.body.should.be.an('object');
                getRes.body.should.have.property('data');
                getRes.body.data.should.be.an('array');
                getRes.body.data.should.not.deep.include.members([userToDelete]);

                done();
              });
          });
      });
  });
});