CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,        
  pin CHAR(6) NOT NULL       
);

CREATE TABLE businesses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE services (
id SERIAL PRIMARY KEY,
business_id INT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
name TEXT NOT NULL,
parent_service_id INT REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE chat_history (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_id INT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'bot')),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


select * from users;


select * from users where email='john@example.com';