const mysql = require('mysql2/promise');
const http = require('http');
const fs = require('fs');
const url = require('url');
const { time } = require('console');
const crypto = require('crypto');
const querystring = require('querystring');
const { start } = require('repl');

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
            let result = true; 
            
            // Get all the dates that are already taken.
            let bookedDates = [];
            try {
                const dtstart = 'dtstart';
                const connection = await pool.getConnection();
                const [rows] = await connection.execute(`SELECT \`${dtstart}\` FROM \`appointments\``);
                connection.release();
        
                let bookedDates = rows.map(row => row[dtstart]);
                // bookedDates contains all of the dates that are already in the table
            } catch (error) {
                console.error('Error fetching column values:', error);
                throw error;
            }

            let checkAttendee = false; 
            let checkDtstart = false; 
            let checkMethod = false; 
            let checkStat = false; 


            const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
            const phoneRegex = /^\d{3}-?\d{3}-?\d{4}$/;

            if (attendee && (emailRegex.test(attendee) || phoneRegex.test(attendee))){
                checkAttendee = true; 
            }

            let selectedDate = new Date(dtstart); 
            
            if (dtstart && isValidDate(dtstart) && !isWeekend(selectedDate) && !isBankHoliday(dtstart) && checkDateFormat(dtstart) && !bookedDates.includes(selectedDate)){
                // If it is valid, not a weekend, not a bank holiday, in the correct format, and not already selected, it is a viable date.
                checkDtstart = true; 
            }


            if (method && method.toLowerCase() === "request"){
                checkMethod = true; 
            }

            if (stat && (stat.toLowerCase() === "confirmed" || stat.toLowerCase() === "tentative")){
                checkStat = true; 
            }

            let confirmationCode = ""; 
            let dtstamp = new Date();  

            if (checkAttendee && checkDtstart && checkMethod && checkStat){
                result = true; 
                confirmationCode = generateConfirmationCode(); 
                try {
                    const connection = await pool.getConnection();

                    const query = `
                      INSERT INTO appointments (attendee, dtstart, dtstamp, method, stat, uid)
                      VALUES (?, ?, ?, ?, ?, ?)
                    `;
                
                    const params = [
                        attendee,
                        dtstart,
                        dtstamp,
                        method.toUpperCase(),
                        stat.toUpperCase(),
                        confirmationCode
                    ];
                
                    const [newEntry] = await connection.execute(query, params);
                    connection.release();
                                
                } catch (error) {
                    
                    if (error.code === 'ER_DUP_ENTRY') {
                        result = false; 
                    } else {
                        console.error('Error adding new entry:', error);
                        throw error;
                    }
                }
                          
            } else {
                result = false; 
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            const responseMessage = result
                ? `The appointment has been scheduled successfully. Here is the confirmation code: ${JSON.stringify(confirmationCode)}`
                : 'One or more entries in your request is a duplicate or invalid/incorrectly formatted. Please try again.';
          
          
            res.end(JSON.stringify({ success: result, message: responseMessage }));
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
            const { startdate, enddate, N} = data;
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
            let bookedDates = [];
            try {
                const dtstart = 'dtstart';
                const connection = await pool.getConnection();
                const [rows] = await connection.execute(`SELECT \`${dtstart}\` FROM \`appointments\``);
                connection.release();
        
                let bookedDates = rows.map(row => row[dtstart]);
                // bookedDates contains all of the dates that are already in the table
            
            } catch (error) {
                console.error('Error fetching column values:', error);
                throw error;
            }

            let availableDates = findNDates(new Date(startdate), new Date(enddate), bookedDates, N); 
            if (availableDates.length > 0){
                result = true; 
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            const responseMessage = result
                ? `The following dates are available - ${JSON.stringify(availableDates)}`
                : 'There are no dates available/There may be a formatting error in your dates. Try again.';
          
          
            res.end(JSON.stringify({ success: result, message: responseMessage }));


        } catch (error) {
            console.error('Error processing POST request:', error);

            const errorResponse = JSON.stringify({ success: false, message: 'Internal server error' });

            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(errorResponse);
            }
        }
    } else if (req.method === 'GET' && parsedUrl.pathname === '/lookup') {
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

            let result = false; 
            let appointmentData = null; 


            try {

                const connection = await pool.getConnection();
                const [foundUID] = await connection.execute('SELECT `uid` FROM `appointments` WHERE `uid` = ?', [uid]);
                const [foundAppointment] = await connection.execute('SELECT * FROM `appointments` WHERE `uid` = ?', [uid]);

                connection.release();
                if (foundUID.length > 0){
                    result = true; 
                    appointmentData = foundAppointment[0]; 
                }
                   
            } catch (error) {
                result = false; 
                console.error('Error fetching column values:', error);
                throw error;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: result, message: result ? 'Requested appointment exists' : 'Requested appointment does not exist', details: appointmentData }));
        } catch (error) {
            console.error('Error processing POST request:', error);

            const errorResponse = JSON.stringify({ success: false, message: 'Internal server error' });

            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(errorResponse);
            }
        }
    } else if (req.method === 'GET' && parsedUrl.pathname === '/cancel') {

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

            let result = false; 

            try {

                const connection = await pool.getConnection();
                const [foundUID] = await connection.execute('SELECT `uid` FROM `appointments` WHERE `uid` = ?', [uid]);
                connection.release();
                if (foundUID.length > 0){
                    await connection.execute('UPDATE `appointments` SET `stat` = ?, `dtstart` = NULL WHERE `uid` = ?', ['CANCELED', uid]);
                    result = true; 
                }
                   
            } catch (error) {
                result = false; 
                console.error('Error fetching column values:', error);
                throw error;
            }

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

function isValidDate(dateStr) {
    let year = Number(dateStr.split("-")[0]); 
    let month = Number(dateStr.split("-")[1]) - 1; 
    let day = Number(dateStr.split("-")[2]); 

    const date = new Date(year, month, day); 

    return (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
    );
}

function findNDates(startdate, enddate, unavailabledates, N){
    let availDates = []; 

    let currentDate = startdate; 
    let counter = 0; 

    while (currentDate < enddate && availDates.length < 4 && counter < N){
        currentDate.setDate(currentDate.getDate() + 1); 

        let checkOverlap = compareDates(currentDate, unavailabledates);
        
        if (!isWeekend(currentDate) && !isBankHolidayDateObj(currentDate) && checkOverlap == false){
            availDates.push(new Date(currentDate)); 
            counter++; 
        }
    }


    return availDates;

}

function isBankHoliday(dateStr){
    let month = Number(dateStr.split("-")[1]); 
    let day = Number(dateStr.split("-")[2]); 

    const bankHolidays = [
        "1-1", // New Year's Day
        "7-4", // Independence Day
        "12-25",  // Christmas Day
        "2-19", // President's Day
        "6-19", // Juneteenth
        "11-11", // Veterans Day
        "11-28" // Thanksgiving
    ];

    
    if (bankHolidays.includes(month + "-" + day)){
        return true; 
    }

    return false; 

}

function isBankHolidayDateObj(date_obj){


    const bank_holidays = [
        "01-01", // New Year's Day
        "07-04", // Independence Day
        "12-25",  // Christmas Day
        "02-19", // President's Day
        "06-19", // Juneteenth
        "11-11", // Veterans Day
        "11-28" // Thanksgiving
    ];

    if (bank_holidays.includes(date_obj.getMonth() + "-" + date_obj.getDate())){
        return true; 
    }

    return false; 

}

function isWeekend(dateObj){
    const isWeekend = (dateObj.getDay() === 5 || dateObj.getDay() === 6); 
    if (isWeekend){
        return true;  
    }

    return false; 

}

function compareDates(dateObj, dateArr){
    for (let i = 0; i < dateArr.length; i++){
        if (dateArr[i].toString() === dateObj.toString()){
            return true;   
        }
    }

    return false; 
}

function generateConfirmationCode() {
    const timestamp = new Date().getTime().toString();
    const hash = crypto.createHash('sha256').update(timestamp).digest('hex');
    const code = hash.substring(0, 8); 
  
    return code;
}

module.exports = {server}; 