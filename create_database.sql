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

-- Pre-loaded Entry 1
INSERT INTO appointments (attendee, dtstart, dtstamp, method, stat, uid)
VALUES ('preloaded1@gmail.com', '2024-09-25', '2024-03-02 00:00:00', 'REQUEST', 'CONFIRMED', 'A3xZ9k');

-- Pre-loaded Entry 2
INSERT INTO appointments (attendee, dtstart, dtstamp, method, stat, uid)
VALUES ('preloaded2@yahoo.com', '2024-07-16', '2024-03-02 00:00:00', 'REQUEST', 'TENTATIVE', 'P7qR2y');

-- Pre-loaded Entry 3
INSERT INTO appointments (attendee, dtstart, dtstamp, method, stat, uid)
VALUES ('preloaded3@outlook.com', '2025-05-14', '2024-03-02 00:00:00', 'REQUEST', 'TENTATIVE', '8645e2c5');

