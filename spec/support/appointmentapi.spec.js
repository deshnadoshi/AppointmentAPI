const supertest = require('supertest');
const http = require('http');
const { server } = require('../../appointmentapi'); 

const app = supertest(server);

describe('Appointment API', () => {
    // Test Case 1: A valid schedule request should be accepted.
    /**it('should return success message for a valid schedule request', async () => {
        const validRequest = {
            attendee: 'test@example.com',
            dtstart: '2024-04-01',
            method: 'request',
            stat: 'confirmed'
        };

        const response = await app
            .get('/schedule')
            .send(validRequest);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('The appointment has been scheduled successfully');
    });**/

    // Test Case 2: A valid schedule request should be accepted.
    it('should return failure message for an invalid schedule request', async () => {
        const invalidRequest = {
            attendee: 'invalid',
            dtstart: '2024-0401',
            stat: 'invalid'
        };

        const response = await app
            .get('/schedule')
            .send(invalidRequest);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('One or more entries in your request is a duplicate or invalid/incorrectly formatted. Please try again.');
    });



    
});