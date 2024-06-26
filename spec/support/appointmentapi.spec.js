const supertest = require('supertest');
const http = require('http');
const { server } = require('../../appointmentapi'); 

const app = supertest(server);

describe('Appointment API', () => {
    // Test Case 1: A valid schedule request should be accepted.
    it ('should return success message for a valid schedule request', async () => {
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
    });

    // Test Case 2: An invalid schedule request should not be accepted.
    it ('should return failure message for an invalid schedule request', async () => {
        const invalidRequest = {
            attendee: 'invalid',
            dtstart: '2024-0401',
            stat: 'invalid'
        };

        const response = await app
            .get('/schedule')
            .send(invalidRequest);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('One or more entries in your request is a duplicate or invalid/incorrectly formatted. Please try again.');
    });

    // Test Case 3: A valid lookup request should be accepted.  
    it ('should return success message for a valid lookup request', async () => {
        const invalidRequest = {
            uid : "A3xZ9k"
        };

        const response = await app
            .get('/lookup')
            .send(invalidRequest);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('Requested appointment exists');
    });

    // Test Case 4: An invalid lookup request should not be accepted.  
    it ('should return failure message for an invalid lookup request', async () => {
        const invalidRequest = {
            uid : "abc123"
        };

        const response = await app
            .get('/lookup')
            .send(invalidRequest);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('Requested appointment does not exist');
    });

    // Test Case 5: A valid cancellation request should be accepted.  
    it ('should return success message for a valid cancellation request', async () => {
        const invalidRequest = {
            uid : "8645e2c5"
        };

        const response = await app
            .get('/cancel')
            .send(invalidRequest);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('Appointment cancelled successfully');
    });

    // Test Case 6: An invalid cancellation request should not be accepted.  
    it ('should return failure message for an invalid cancellation request', async () => {
        const invalidRequest = {
            uid : "abc123"
        };

        const response = await app
            .get('/cancel')
            .send(invalidRequest);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('Appointment does not exist');
    });

    // Test Case 7: A valid find N dates request should be accepted. 
    it ('should return success message for a valid find N dates request', async () => {
        const invalidRequest = {
            startdate: "2024-01-14",
            enddate : "2025-02-13",
            N : "2"
        };

        const response = await app
            .get('/nextndates')
            .send(invalidRequest);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('The following dates are available');
    });

    // Test Case 8: An invalid findNDates request should not be accepted. 
    it ('should return failure message for an invalid find N dates request', async () => {
        const invalidRequest = {
            startdate: "2024-01-14",
            enddate : "202302-13",
            N : "4"
        };

        const response = await app
            .get('/nextndates')
            .send(invalidRequest);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('There are no dates available/There may be a formatting error in your dates. Try again');
    });


    // Test Case 9: End date should not be after start date.  
    it ('should return failure message for an end date that is after the start date', async () => {
        const invalidRequest = {
            startdate: "2024-01-14",
            enddate : "2023-02-13",
            N : "4"
        };

        const response = await app
            .get('/nextndates')
            .send(invalidRequest);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('There are no dates available/There may be a formatting error in your dates. Try again');
    });

    // Test Case 10: There should be no missing data in a find N dates request.  
    it ('should return failure message for missing data in a find N dates request', async () => {
        const invalidRequest = {
            startdate: "2024-01-14",
            enddate : "2023-02-13",
        };

        const response = await app
            .get('/nextndates')
            .send(invalidRequest);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('There are no dates available/There may be a formatting error in your dates. Try again');
    });

    // Test Case 11: There should be no missing data in a schedule request.  
    it ('should return failure message for missing data in a schedule request', async () => {
        const invalidRequest = {
            attendee: 'test@example.com',
            method: 'request',
            stat: 'confirmed'

        };

        const response = await app
            .get('/schedule')
            .send(invalidRequest);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('One or more entries in your request is a duplicate or invalid/incorrectly formatted. Please try again.');
    });

    // Test Case 12: An invalid attendee should not be able to process a schedule request.  
    it ('should return failure message for incorrect attendee in a schedule request', async () => {
        const invalidRequest = {
            attendee: 'john doe',
            dtstart : '2026-02-03',
            method: 'request',
            stat: 'confirmed'

        };

        const response = await app
            .get('/schedule')
            .send(invalidRequest);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('One or more entries in your request is a duplicate or invalid/incorrectly formatted. Please try again.');
    });

    // Test Case 13: An invalid dtstart should not be able to process a schedule request.  
    it ('should return failure message for incorrect dtstart in a schedule request', async () => {
        const invalidRequest = {
            attendee: 'test2@gmail.com',
            dtstart : '2025-01-01',
            method: 'request',
            stat: 'confirmed'

        };

        const response = await app
            .get('/schedule')
            .send(invalidRequest);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('One or more entries in your request is a duplicate or invalid/incorrectly formatted. Please try again.');
    });

    // Test Case 14: An invalid method should not be able to process a schedule request.  
    it ('should return failure message for incorrect method in a schedule request', async () => {
        const invalidRequest = {
            attendee: 'test3@gmail.com',
            dtstart : '2026-02-03',
            method: 'approved',
            stat: 'confirmed'

        };

        const response = await app
            .get('/schedule')
            .send(invalidRequest);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('One or more entries in your request is a duplicate or invalid/incorrectly formatted. Please try again.');
    });

    // Test Case 15: An invalid status should not be able to process a schedule request.  
    it ('should return failure message for incorrect status in a schedule request', async () => {
        const invalidRequest = {
            attendee: 'test3@gmail.com',
            dtstart : '2029-02-03',
            method: 'request',
            stat: 'checked'

        };

        const response = await app
            .get('/schedule')
            .send(invalidRequest);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('One or more entries in your request is a duplicate or invalid/incorrectly formatted. Please try again.');
    });



    
});