const mysql = require('mysql2/promise');
const http = require('http');
const fs = require('fs');
const url = require('url');
const { time } = require('console');
const crypto = require('crypto');


    

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
  
    if (req.method === 'GET' && parsedUrl.pathname === '/schedule') {
        // Handle scheduling logic here
        // You can access query parameters with parsedUrl.query
        // Example: const bookThisDate = parsedUrl.query.book_this_date;
    
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Scheduling endpoint');
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
});
  
const PORT = 3000;
  
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
  


