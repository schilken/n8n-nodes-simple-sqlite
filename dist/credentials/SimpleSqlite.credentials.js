"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleSqlite = void 0;
class SimpleSqlite {
    constructor() {
        this.name = 'simpleSqlite';
        this.displayName = 'Simple SQLite';
        this.properties = [
            {
                displayName: 'Database File Path',
                name: 'databasePath',
                type: 'string',
                default: '/Users/username/n8n-data/mydb.sqlite',
                required: true,
                description: 'Path to the SQLite database file',
            },
        ];
    }
}
exports.SimpleSqlite = SimpleSqlite;
