import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from './index';

chai.use(chaiHttp);
const router = () => chai.request(app)

describe('Initial configuration', () => {

    it('Should retutn `Welcome to E-Commerce-Ninja-BackEnd` when GET on /', (done) => {
        router()
            .get('/')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message', "Welcome to E-Commerce-Ninja-BackEnd");
                done(err);
            });
    });
});
