-- 20230701_01_create_initial_tables.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE IF NOT EXISTS "user" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name VARCHAR(256),
    last_name VARCHAR(256),
    username VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(256) UNIQUE NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'Member',
    hashed_password VARCHAR(512) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS treat (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(512) NOT NULL,
    description TEXT,
    is_fulfilled BOOLEAN DEFAULT false,
    fulfilled_on TIMESTAMP,
    user_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_session (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE
);

CREATE OR REPLACE VIEW user_view AS 
   SELECT 
     id AS "id", 
     first_name AS "firstName", 
     last_name AS "lastName", 
     username AS "username", 
     email AS "email", 
     role AS "role", 
     is_active AS "isActive", 
     created_at AS "createdAt" 
   FROM "user";