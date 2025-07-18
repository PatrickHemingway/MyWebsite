-- Create the db
CREATE DATABASE duck_race_db;

\c duck_race_db


CREATE TABLE ducks (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    losses INTEGER NOT NULL DEFAULT 0
);

INSERT INTO ducks (name) VALUES ('Adam');
INSERT INTO ducks (name) VALUES ('Pierce');
INSERT INTO ducks (name) VALUES ('Gabe');
INSERT INTO ducks (name) VALUES ('Patrick');
INSERT INTO ducks (name) VALUES ('Zelda');

SELECT * FROM ducks;

DELETE FROM ducks;

SELECT * FROM ducks;


INSERT INTO ducks (name) VALUES ('Duck1');
INSERT INTO ducks (name) VALUES ('Duck2');
INSERT INTO ducks (name) VALUES ('Duck3');
INSERT INTO ducks (name) VALUES ('Duck4');
INSERT INTO ducks (name) VALUES ('Duck5');

--Out of psql and in node terminal
mkdir duck-backend
cd duck-backend
npm init -y
npm install express pg cors

touch server.js

    AI Use:
    Added server.js code

        Go to: http:--localhost:3001/ducks

    Added react component

Back to psql:

-- Editing Stats
UPDATE ducks
SET losses = 3
WHERE name = 'Duck2';

UPDATE ducks
SET losses = 0
WHERE name = 'Duck3';

-- END OF BASIC TABLE
-- START OF MULTI TABLE

-- psql

DROP TABLE IF EXISTS ducks;
-- Can no longer view table

CREATE TABLE races (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    total_races INTEGER DEFAULT 0
);

CREATE TABLE race_ducks (
    id SERIAL PRIMARY KEY,
    race_id INTEGER REFERENCES races(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0
);

-- Update server.js with correct imports
-- Updated frontend with many buttons and tools.
