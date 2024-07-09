-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS LMS_21_June;

-- Switch to the database
USE LMS_21_June;

-- Create a table example (replace with your actual schema)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL
);

-- Insert initial data (replace with your actual data)
INSERT INTO users (username, email) VALUES
    ('user1', 'user1@example.com'),
    ('user2', 'user2@example.com');

-- Example of more complex schema and data
-- CREATE TABLE IF NOT EXISTS ...

-- INSERT INTO ... VALUES ...
