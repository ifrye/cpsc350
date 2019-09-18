CREATE DATABASE workshop;
\c workshop

CREATE TABLE workshops (
	id serial PRIMARY KEY,
	workshop text NOT NULL,
	attendee text
);
GRANT SELECT, INSERT ON workshops to workshop;
GRANT USAGE on workshops_id_seq to workshop;
