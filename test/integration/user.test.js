const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../Index')
chai.should()
chai.use(chaiHttp)

let authToken;


before((done) => {
  chai.request(server)
    .post('/api/login')
    .send({
      emailAdress: 'j.doe@server.com',
      password: 'secret'
    })
    .end((err, res) => {
      console.log(res.body); //Shows result working login and getting a token
      if(res.body && res.body.data) {
        authToken = res.body.data.token;
      } else {
        console.error("Failed to get token from response body")
      }
      done();
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
          emailAdress: 'j.doe@domein.com',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').to.be.equal(400);
          res.body.should.have.property('message').to.include('Required field missing');
          done();
        });
    });
    
    // TC-201-4 - User already exists
    it('TC-201-4 - User already exists', (done) => {
      chai
      .request(server)
      .post('/api/user')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          emailAdress: 'j.doe@server.com',
          password: 'Welkom01',
          phoneNumber: '0612345678'
        })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.an('object');
          res.body.should.have.property('status').to.be.equal(403);
          res.body.should.have.property('message').to.include('User already exists');
          done();
        });
      });

      // TC-201-5 - User successfully registered -- omdat gebruiker aangemaakt wordt moet je de database legen anders krijgt hij melding user bestaat al
        it('TC-201-5 - User successfully registered', (done) => {

          chai
            .request(server)
            .post('/api/user')
            .send({
                firstName: 'Jena',
                lastName: 'Rose',
                emailAdress: 'j.rose@domein.com',
                password: 'Welkom01',
                phoneNumber: '0612345678'
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
              data.should.have.property('firstName').to.be.equal('Jena');
              data.should.have.property('lastName').to.be.equal('Rose');
              data.should.have.property('emailAdress').to.be.equal('j.rose@domein.com');
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
      .set('Authorization', `Bearer ${authToken}`)
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
      .set('Authorization', `Bearer ${authToken}`)
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
        .set('Authorization', `Bearer ${authToken}`)
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
    const existingUserId = 2;
    const updatedUser = {
      firstName: 'John',
      // emailAddress is intentionally missing
    };
    chai
      .request(server)
      .put(`/api/user/${existingUserId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedUser)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(400);
        res.body.should.have.property('message');
        done();
      });
  });

  //werkt niet omdat check van eigenaar token voor gaat
  it('TC-205-4 - User does not exist', (done) => {
    const nonExistentUserId = 0;
    chai
      .request(server)
      .put(`/api/user/${nonExistentUserId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(404);
        res.body.should.have.property('message');
        done();
      });
  });

  it('TC-205-5 - User not signed in', (done) => {
    const ExistentUserId = 1;
    chai
      .request(server)
      .put(`/api/user/${ExistentUserId}`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(401);
        res.body.should.have.property('message');
        done();
      });
  });

  it('TC-205-6 - User successfully updated', (done) => {
    const existingUserId = 2;
    const updatedUser = {
      firstName: 'John',
      emailAdress: 'j.doe@server.com',
    };
    chai
      .request(server)
      .put(`/api/user/${existingUserId}`)
      .set('Authorization', `Bearer ${authToken}`)
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
        data.should.have.property('emailAdress').to.be.equal('j.doe@server.com');
        done();
      });
  });

  });  


// UC-206 Delete user
  describe('UC-206 Delete user', () => {
    let createdUserId;
    let token;

    // TC-206-0 - Create a user to delete
    it('TC-206-0 - Create a user to delete', (done) => {
      const userToDelete = {
        firstName: 'Pepa',
        lastName: 'Big',
        emailAddress: 'p.big@test.com',
        password: 'Welkom01',
        phoneNumber: '06 12345678'
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
        token = postRes.body.token; // Extract the token from the response
        done();
      });
  });

    // TC-206-4 - User successfully deleted
    it('TC-206-4 - User successfully deleted', (done) => {
      chai
        .request(server)
        .delete(`/api/user/${createdUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, deleteRes) => {
          deleteRes.should.have.status(200);
          deleteRes.body.should.be.an('object');
          deleteRes.body.should.have.property('message').to.be.equal(`User with id ${createdUserId} has been deleted`);
          done();
        });
    });


    // TC-206-1 - User does not exist
    it('TC-206-1 - User does not exist', (done) => {
      const nonExistentUserId = 0; 
      chai
        .request(server)
        .get(`/api/user/${nonExistentUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          res.body.should.have.property('status').to.be.equal(404);
          res.body.should.have.property('message');
          done();
        });
    });
  });
