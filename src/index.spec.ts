import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from './index';

chai.use(chaiHttp);
const router = () => chai.request(app)

describe('Initial configuration', () => {
    
    // let server: any;
    // before((done) => {
    //     server = app.listen(0, () => {
    //         done();
    //     })
    // });
    // after((done)=>{
    //     server.close(done);
    // });
    // it("Should use process.env.PORT if available", (done) => {
    //     process.env.PORT = "5000";
    //     server = app.listen(0, () => {
    //         const port = server.address().port;
    //         expect(port).to.equal(5000);
    //         done();
    //     });
    // });

    it('should return 200', (done) => {
        router()
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