CREATE DATABASE calendar;

USE calendar;

CREATE TABLE appointments (
    attendee VARCHAR(255),
    dtstart DATE,
    dtstamp DATETIME,
    method VARCHAR(255),
    stat VARCHAR(255),
    uid VARCHAR(255) PRIMARY KEY
    UNIQUE KEY uniqueDtstart (dtstart)
);

