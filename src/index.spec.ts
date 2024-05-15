import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from './index';

chai.use(chaiHttp);

describe('GET /', () => {
    it('should return 200', (done) => {
        chai.request(app)
           .get('/')
           .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.be.a('string');
                done();
            });
    });
});