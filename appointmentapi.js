const mysql = require('mysql2/promise');
const http = require('http');
const fs = require('fs');
const url = require('url');
const { time } = require('console');
const crypto = require('crypto');
const querystring = require('querystring');


const process = async (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (req.method === 'POST' && parsedUrl.pathname === '/schedule') {
        try {
            let body = '';

            await new Promise((resolve, reject) => {
                req.on('data', (chunk) => {
                    body += chunk.toString();
                });

                req.on('end', () => {
                    resolve();
                });

                req.on('error', (error) => {
                    reject(error);
                });
            });

            const data = JSON.parse(body);
            const { attendee, dtstart, method, stat } = data;

            console.log(attendee);
            console.log(dtstart);
            console.log(method);
            console.log(stat);

            const result = true; // Temporary placeholder

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: result, message: result ? 'Appointment scheduled successfully' : 'Failed to schedule appointment' }));
        } catch (error) {
            console.error('Error processing POST request:', error);

            const errorResponse = JSON.stringify({ success: false, message: 'Internal server error' });

            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(errorResponse);
            }
        }
    } else if (req.method === 'GET' && parsedUrl.pathname === '/lookup') {
        // Handle lookup logic here
        // You can access query parameters with parsedUrl.query
        // Example: const uid = parsedUrl.query.uid;

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Lookup endpoint');
    } else if (req.method === 'GET' && parsedUrl.pathname === '/cancel') {
        // Handle cancel logic here
        // You can access query parameters with parsedUrl.query
        // Example: const uid = parsedUrl.query.uid;

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Cancel endpoint');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
};

const server = http.createServer(process);


// const server = http.createServer((req, res) => {
//     const parsedUrl = url.parse(req.url, true);
    

      
//     if (req.method === 'POST' && parsedUrl.pathname === '/schedule') {

        
//         try {
//             // const data = querystring.parse(body);

//             req.on('data', (chunk) => {
//                 let body = ''; 

//                 const data = JSON.parse(body);

//                 const { attendee, dtstart, method, stat } = data;
        
//                 console.log(attendee); 
//                 console.log(dtstart); 
//                 console.log(method); 
//                 console.log(stat); 
                
//                 const result = true; // Temporary place holder

//                 res.writeHead(200, { 'Content-Type': 'application/json' });
//                 res.end(JSON.stringify({ success: result, message: result ? 'Appointment scheduled successfully' : 'Failed to schedule appointment' }));
    
//                 body += chunk.toString();
//             });

//             // const data = JSON.parse(body);

//             // const { attendee, dtstart, method, stat } = data;
    
//             // console.log(attendee); 
//             // console.log(dtstart); 
//             // console.log(method); 
//             // console.log(stat); 
//             // Perform scheduling logic
//             // const result = scheduleAppointment(attendee, dtstart, method, stat);
//             } catch (error) {
//                 console.error('Error processing POST request:', error);

//                 const errorResponse = JSON.stringify({ success: false, message: 'Internal server error' });

//                 if (!res.headersSent) {
//                     res.writeHead(500, { 'Content-Type': 'application/json' });
//                     res.end(errorResponse);
//                 }
//             }
    
    
//         // res.writeHead(200, { 'Content-Type': 'text/plain' });
//         // res.end('Scheduling endpoint');
//     } else if (req.method === 'GET' && parsedUrl.pathname === '/lookup') {
//         // Handle lookup logic here
//         // You can access query parameters with parsedUrl.query
//         // Example: const uid = parsedUrl.query.uid;
    
//         res.writeHead(200, { 'Content-Type': 'text/plain' });
//         res.end('Lookup endpoint');
//     } else if (req.method === 'GET' && parsedUrl.pathname === '/cancel') {
//         // Handle cancel logic here
//         // You can access query parameters with parsedUrl.query
//         // Example: const uid = parsedUrl.query.uid;
    
//         res.writeHead(200, { 'Content-Type': 'text/plain' });
//         res.end('Cancel endpoint');
//     } else {
//         res.writeHead(404, { 'Content-Type': 'text/plain' });
//         res.end('Not Found');
//     }
// });
  
const PORT = 3000;
  
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
  


