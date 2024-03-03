const mysql = require('mysql2/promise');
const http = require('http');
const fs = require('fs');
const url = require('url');
const { time } = require('console');
const crypto = require('crypto');



const pool = mysql.createPool({
    host: 'localhost',  
    user: 'root',       
    password: 'root',  
    database: 'calendar',  
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

