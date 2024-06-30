CREATE TABLE IF NOT EXISTS "user" (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(256),
    last_name VARCHAR(256),
    username VARCHAR(16) UNIQUE NOT NULL,
    email VARCHAR(256) UNIQUE NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'Member',
    hashed_password VARCHAR(512) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS treat (
    treat_id SERIAL PRIMARY KEY,
    title VARCHAR(512) NOT NULL,
    description VARCHAR(255),
    is_fulfilled BOOLEAN DEFAULT false,
    fulfilled_on TIMESTAMP,
    treat_user_id INT NOT NULL,
    FOREIGN KEY (treat_user_id) REFERENCES "user" (user_id)
);