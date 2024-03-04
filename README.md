# ECE452: Software Engineering Assignment 6
#### Deshna Doshi, dd1035, 206009273
### Algorithm Design Notes: 

**_JASMINE TEST CASES NOTE: Running 'npm test' more than once in a row (without resetting or clearing the database) will cause the Jasmine test cases to FAIL. The reason being, on the first iteration of the test cases, the valid scheduling test case (Test Case 1), will be added to the database. If you run 'npm test' again, it will recognize that the contents of Test Case 1 already exist in the database, and will throw a duplication error. Therefore, that test case will fail, despite it being correct and functional, due to the structure of a database and because we don't have the possibility of resetting the database on every iteration of running the Jasmine test cases._**

1. Please run the following before running the code, to ensure that it functions as expected: npm install mysql2 http fs url console crypto. 

2. The body of all GET requests sent through Postman or cURL must be of type application/json. JSON messages must be formatted correctly in terms of structure (the program will occasionally handle missing data), i.e. the program will require a correctly formatted JSON in the body of the requests to function. The data in the body may be invalid/incorrect.  

3. Only GET requests are permissible. 

4. The queries to create/set-up the database and table needed for this program are in 'create_database.sql'. 

5. Please look through the createPool function and change any necessary variables to match those in your system, before testing this program. 

6. When an appointment is cancelled, dtstart is set to null and the status is set to CANCELLED. This is due to requirement that dtstart must be unique. 

