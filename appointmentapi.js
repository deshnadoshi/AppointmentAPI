const mysql = require('mysql2/promise');
const http = require('http');
const fs = require('fs');
const url = require('url');
const { time } = require('console');
const crypto = require('crypto');
const querystring = require('querystring');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'calendar',
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0
});
  

const process = async (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (req.method === 'GET' && parsedUrl.pathname === '/schedule') {
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

            // Need to add appointment booking logic here
            // To manipulate sql database
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
    }  else if (req.method === 'GET' && parsedUrl.pathname === '/nextndates') {

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
            const { startdate, enddate } = data;
            let result = true; 

            // The dates chosen are not formatted correctly. 
            if (!checkDateFormat(startdate) || !checkDateFormat(enddate)){
                result = false; 
            }
            
            // The dates chosen are not valid dates. 
            if (!isValidDate(startdate) || isValidDate(enddate)){
                result = false; 
            }

            // Load all of the existing dates from the SQL database. 
            try {
                const dtstart = 'dtstart';
                const connection = await pool.getConnection();
                const [rows] = await connection.execute(`SELECT \`${dtstart}\` FROM \`appointments\``);
                connection.release();
        
                let bookedDates = rows.map(row => row[dtstart]);
                // bookedDates contains all of the dates that are in the table
            
            } catch (error) {
                console.error('Error fetching column values:', error);
                throw error;
            }

            
             
            


            

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: result, message: result ? 'The following dates are available -' : 'There are no dates available/There may be a formatting error in your dates. Try again.' }));
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
            const { uid } = data;

            const result = true; 

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: result, message: result ? 'Appointment exists' : 'Appointment does not exist' }));
        } catch (error) {
            console.error('Error processing POST request:', error);

            const errorResponse = JSON.stringify({ success: false, message: 'Internal server error' });

            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(errorResponse);
            }
        }
    } else if (req.method === 'GET' && parsedUrl.pathname === '/cancel') {
        // Handle cancel logic here
        // You can access query parameters with parsedUrl.query
        // Example: const uid = parsedUrl.query.uid;

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
            const { uid } = data;

            const result = true; 

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: result, message: result ? 'Appointment cancelled successfully' : 'Appointment does not exist' }));
        } catch (error) {
            console.error('Error processing POST request:', error);

            const errorResponse = JSON.stringify({ success: false, message: 'Internal server error' });

            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(errorResponse);
            }
        }
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
  


// Helper Functions
function checkDateFormat(str){
    const date_regex = /^\d{4}-\d{2}-\d{2}$/;

    if (date_regex.test(str)){
        return true; 
    }

    return false; 
}

function isValidDate(date_str) {
    let year = Number(date_str.split("-")[0]); 
    let month = Number(date_str.split("-")[1]) - 1; 
    let day = Number(date_str.split("-")[2]); 

    const date = new Date(year, month, day); 

    return (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
    );
}
