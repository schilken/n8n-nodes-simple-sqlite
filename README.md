# n8n-nodes-simple-sqlite

A simple SQLite node for n8n that allows you to interact with SQLite databases.

## Features

- **Record Operations**: Select, Insert, Update, Delete records
- **Table Operations**: Create, List, Delete tables
- Support for any SQL query
- Error handling with continue-on-fail option

## Installation

### Method 1: Direct Installation to n8n Nodes Directory (Recommended)

This installs the node directly to your local n8n nodes directory:

```bash
# Run the automated install script
./install.sh
```

Or manually:
```bash
# Build the node
npm install
npm run build

# Install directly to n8n nodes directory
cd ~/.n8n/nodes
npm init -y  # Only needed if package.json doesn't exist
npm install /path/to/this/n8n-nodes-simple-sqlite
```

### Method 2: Global Installation

```bash
npm install
npm run build
npm pack
npm install -g ./n8n-nodes-simple-sqlite-*.tgz
```

### Method 3: Local n8n Project Installation

If you're running n8n from a local project directory:
```bash
cd /path/to/your/n8n/project
npm install /path/to/this/n8n-nodes-simple-sqlite
```

**After installation with any method, restart your n8n instance to see the node.**

## Usage

1. Add the "Simple SQLite" node to your workflow
2. Configure the database file path
3. Choose your resource (Record or Table) and operation
4. Enter your SQL query
5. Execute the workflow

### Example Queries

**Select all records:**
```sql
SELECT * FROM users;
```

**Insert a record:**
```sql
INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com');
```

**Create a table:**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE
);
```

## Configuration

- **Database File**: Path to your SQLite database file
- **Resource**: Choose between 'Record' or 'Table' operations
- **Operation**: Available operations depend on the selected resource
- **SQL Query**: The SQL statement to execute

## License

MIT
