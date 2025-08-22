
## Ressource table
### Operation  create

fields:
 sql of table definition

example: 
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

### Operation list

fields:
 no fields

fixed sql:
SELECT name 
FROM sqlite_master 
WHERE type='table'
ORDER BY name;


### Operation info

fields:
  table_name

example: 
SELECT sql
FROM sqlite_master
WHERE type='table' AND name='users';


## Ressource record
### Operation insert

fields:
  table_name  
  field_names, comma separated in one string  
  values, comma separated in one string  

example: 
INSERT INTO users (name, email)
VALUES ('Alice', 'alice@example.com');


### Operation list

fields:
  table_name  
  where_clause

example: 
SELECT * FROM users WHERE name = 'Alice';


### Operation update

fields:
  table_name  
  field_names, comma separated in one string  
  values, comma separated in one string  
  where_clause

example: 
UPDATE users
SET email = 'alice@newmail.com'
WHERE name = 'Alice';


### Operation delete

fields:
  table_name  
  where_clause

example: 
DELETE FROM users
WHERE name = 'Alice';