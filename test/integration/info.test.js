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
  });

// UC-201 Register a new user
describe('UC-201 Register a new user', () => {
    // TC-201-1 - Required field missing
    it('TC-201-1 - Required field missing', (done) => {
      chai
        .request(server)
        .post('/api/user')
        .send({
          firstName: 'John',
          // lastName is missing
          emailAdress: 'john@example.com',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').to.be.equal(400);
          res.body.should.have.property('message').to.include('Required field missing');
          done();
        });
    });
  
    // TC-201-5 - User successfully registered
    it('TC-201-5 - User successfully registered', (done) => {
      const randomNum = Math.floor(Math.random() * 10000);
      const email = `johndoe${randomNum}@example.com`;
      chai
        .request(server)
        .post('/api/user')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          emailAdress: email,
          password: 'password123'
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');
          res.body.should.have.property('status').to.be.equal(201);
          res.body.should.have.property('message');
          res.body.should.have.property('data');
          const { data } = res.body;
          data.should.be.an('object');
          data.should.have.property('id');
          data.should.have.property('firstName').to.be.equal('John');
          data.should.have.property('lastName').to.be.equal('Doe');
          data.should.have.property('emailAdress').to.be.equal(email);
          done();
        });
    });
  
    // TC-201-4 - User already exists
    it('TC-201-4 - User already exists', (done) => {
      const email = 'existinguser@example.com';
      chai
        .request(server)
        .post('/api/user')
        .send({
          firstName: 'Existing',
          lastName: 'User',
          emailAdress: email,
          password: 'password123'
        })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.an('object');
          res.body.should.have.property('status').to.be.equal(403);
          res.body.should.have.property('message').to.include('User already exists');
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

// UC-204 Get user by ID
describe('UC-204 Get user by ID', () => {

  it('TC-204-2 - User ID does not exist', (done) => {
    const nonExistentUserId = 0; 
    chai
      .request(server)
      .get(`/api/user/${nonExistentUserId}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(404);
        res.body.should.have.property('message');
        done();
      });
  });

  it('TC-204-3 - User ID exists', (done) => {
    const existingUserId = 1; 
    chai
      .request(server)
      .get(`/api/user/${existingUserId}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(200);
        res.body.should.have.property('message');
        res.body.should.have.property('data');
        const { data } = res.body;
        data.should.be.an('object');
        data.should.have.property('id').to.be.equal(existingUserId);
        // Validate other user properties
        done();
      });
  });

});  

// UC-205 Update user data
describe('UC-205 Update user data', () => {

  it('TC-205-1 - Required field "emailAddress" is missing', (done) => {
    const existingUserId = 1;
    const updatedUser = {
      firstName: 'John',
      // emailAddress is intentionally missing
    };
    chai
      .request(server)
      .put(`/api/user/${existingUserId}`)
      .send(updatedUser)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(400);
        res.body.should.have.property('message');
        done();
      });
  });

  it('TC-205-4 - User does not exist', (done) => {
    const nonExistentUserId = 0;
    const updatedUser = {
      firstName: 'John',
      emailAdress: 'john.doe@example.com',
    };
    chai
      .request(server)
      .put(`/api/user/${nonExistentUserId}`)
      .send(updatedUser)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(404);
        res.body.should.have.property('message');
        done();
      });
  });

  it('TC-205-6 - User successfully updated', (done) => {
    const existingUserId = 1;
    const updatedUser = {
      firstName: 'John',
      emailAdress: 'john.doe@example.com',
    };
    chai
      .request(server)
      .put(`/api/user/${existingUserId}`)
      .send(updatedUser)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(200);
        res.body.should.have.property('message');
        res.body.should.have.property('data');
        const { data } = res.body;
        data.should.be.an('object');
        data.should.have.property('firstName').to.be.equal('John');
        data.should.have.property('emailAdress').to.be.equal('john.doe@example.com');
        done();
      });
  });

});  

// UC-206 Delete user
describe('UC-206 Delete user', () => {
  let createdUserId;

  // TC-206-0 - Create a user to delete
  it('TC-206-0 - Create a user to delete', (done) => {
    const userToDelete = {
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'johndoe@test.com',
      password: 'password123'
    };

    chai
      .request(server)
      .post('/api/user')
      .send(userToDelete)
      .end((err, postRes) => {
        postRes.should.have.status(200);
        postRes.body.should.be.an('object');
        postRes.body.should.have.property('data');
        createdUserId = parseInt(postRes.body.data.id);
        done();
      });
  });

  // TC-206-4 - User successfully deleted
  it('TC-206-4 - User successfully deleted', (done) => {
    chai
      .request(server)
      .delete(`/api/user/${createdUserId}`)
      .end((err, deleteRes) => {
        deleteRes.should.have.status(200);
        deleteRes.body.should.be.an('object');
        deleteRes.body.should.have.property('message').to.be.equal(`User with id ${createdUserId} has been deleted`);
        done();
      });
  });

  // TC-206-1 - User does not exist
  it('TC-206-1 - User does not exist', (done) => {
    const nonExistentUserId = 9999;
    chai
      .request(server)
      .delete(`/api/user/${nonExistentUserId}`)
      .end((err, deleteRes) => {
        deleteRes.should.have.status(404);
        deleteRes.body.should.be.an('object');
        deleteRes.body.should.have.property('message').to.be.equal(`User with id ${nonExistentUserId} not found`);
        done();
      });
  });
});
