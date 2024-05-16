import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

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

    it('should return a welcome message', (done) => {
        chai.request(app)
           .get('/')
           .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.message).to.equal("Welcome to E-Commerce-Ninja-BackEnd");
                done();
            });
    });
    it('should return 400 for invalid HTTP method', (done) => {
        chai.request(app)
           .post('/') 
           .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });
    it('should return 400 for invalid route', (done) => {
        chai.request(app)
           .get('/invalid-route')
           .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    }); 
    
    it('should respond within a reasonable time', (done) => {
        const startTime = Date.now();
        chai.request(app)
           .get('/')
           .end((err, res) => {
                const duration = Date.now() - startTime;
                expect(duration).to.be.lessThan(500); 
                done();
            });
    });
    
    
});