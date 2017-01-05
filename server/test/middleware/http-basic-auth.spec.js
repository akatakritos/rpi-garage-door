const httpBasicAuth = require('../../app/middleware/http-basic-auth');
const expect = require('chai').expect;
const td = require('testdouble');

class FakeResponse {

    constructor() {
        this.headers = {};
        this.statusCode = 0;
    }

    set(header, value) {
        this.headers[header] = value;
    }

    send(statusCode) {
        this.statusCode = statusCode;
    }

}

class FakeRequest {

}

describe('Basic Authentication', () => {

    let middleware;

    beforeEach(() =>  middleware = httpBasicAuth('foo', 'password'));

    describe('with no auth headers', () => {

        it('returns a 401', () => {

            const res = new FakeResponse();
            middleware({ headers: {} }, res);

            expect(res.statusCode).to.equal(401);
        });

        it ('sets the auth header Basic', () => {
            const res = new FakeResponse();
            middleware({ headers: {} }, res);

            expect(res.headers['WWW-Authenticate']).to.contain('Basic');
        });
    });

    describe('with correct u/p', () => {

        it('calls through to next()', () => {
            const next = td.function();
            const res = new FakeResponse();
            const req = {
                headers: {
                    authorization: httpBasicAuth.header('foo', 'password'),
                },
            };

            middleware(req, res, next);

            td.verify(next());
        });

    });

    describe('with incorrect u/p', () => {
        it('returns the failure status', () => {

            const res = new FakeResponse();
            const req = {
                headers: {
                    authorization: httpBasicAuth.header('baz', 'password'),
                },
            };

            middleware(req, res);


            expect(res.statusCode).to.equal(401);
            expect(res.headers['WWW-Authenticate']).to.be.ok;
        });

    });

});
