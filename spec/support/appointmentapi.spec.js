const request = require('supertest');
const http = require('http');
const app = require('../../appointmentapi'); // Update the path accordingly

describe('Appointment API', () => {
    let server;

    beforeEach(() => {
        server = http.createServer(app.process);
    });

    afterEach((done) => {
        server.close(done);
    });

    it('should return success message for a valid schedule request', (done) => {
        const validRequest = {
            attendee: 'test@example.com',
            dtstart: '2024-04-01',
            method: 'request',
            stat: 'confirmed'
        };

        request(server)
            .post('/schedule')
            .send(validRequest)
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body.success).toBe(true);
                expect(res.body.message).toContain('The appointment has been scheduled successfully');
                done();
            });
    });

    it('should return error message for an invalid schedule request', (done) => {
        const invalidRequest = {
            attendee: 'invalid-email',
            dtstart: '2024-04-01',
            method: 'invalid-method',
            stat: 'invalid-stat'
        };

        request(server)
            .post('/schedule')
            .send(invalidRequest)
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body.success).toBe(false);
                expect(res.body.message).toContain('One or more entries in your request is a duplicate or invalid/incorrectly formatted');
                done();
            });
    });

    // Add more test cases for other endpoints and scenarios

    it('should return success message for a valid lookup request', (done) => {
        const validLookupRequest = {
            uid: 'valid-uid'
        };

        request(server)
            .get('/lookup')
            .query(validLookupRequest)
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body.success).toBe(true);
                expect(res.body.message).toContain('Requested appointment exists');
                done();
            });
    });

    // Add more test cases for other endpoints and scenarios
});
