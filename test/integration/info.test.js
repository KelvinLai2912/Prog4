process.env['DB_DATABASE'] = process.env.DB_DATABASE || 'shareamealtest';

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
          data.should.has.property('studentNumber').to.be.equal(2205954);
          done();
        });
    });
  });

