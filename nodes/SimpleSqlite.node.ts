import {
    IDataObject,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions,
    NodeConnectionType,
} from 'n8n-workflow';

import sqlite3 from 'sqlite3';

export class SimpleSqlite implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Simple SQLite',
		name: 'simpleSqlite',
		icon: 'file:sqlite.svg',
		group: ['transform'],
		version: 1,
		description: 'Work with SQLite databases',
		defaults: {
			name: 'Simple SQLite',
		},
		inputs: [<NodeConnectionType>'main'],
		outputs: [<NodeConnectionType>'main'],
		credentials: [
			{
				name: 'simpleSqlite',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Database File',
				name: 'database',
				type: 'string',
				default: '',
				required: false,
				description: 'Path to the SQLite database file. If empty, uses the path from credentials.',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{ name: 'Record', value: 'record' },
					{ name: 'Table', value: 'table' },
				],
				default: 'record',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: { resource: ['record'] },
				},
				options: [
					{ name: 'List', value: 'list' },
					{ name: 'Insert', value: 'insert' },
					{ name: 'Update', value: 'update' },
					{ name: 'Delete', value: 'delete' },
				],
				default: 'list',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: { resource: ['table'] },
				},
				options: [
					{ name: 'Create', value: 'create' },
					{ name: 'List', value: 'list' },
					{ name: 'Info', value: 'info' },
				],
				default: 'list',
			},
			// Table Create Operation Fields
			{
				displayName: 'SQL Table Definition',
				name: 'sql',
				type: 'string',
				displayOptions: {
					show: { 
						resource: ['table'],
						operation: ['create'] 
					},
				},
				default: 'CREATE TABLE IF NOT EXISTS users (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    name TEXT NOT NULL,\n    email TEXT UNIQUE NOT NULL,\n    created_at DATETIME DEFAULT CURRENT_TIMESTAMP\n);',
				required: true,
				description: 'SQL CREATE TABLE statement',
			},
			// Table Info Operation Fields
			{
				displayName: 'Table Name',
				name: 'table_name',
				type: 'string',
				displayOptions: {
					show: { 
						resource: ['table'],
						operation: ['info'] 
					},
				},
				default: '',
				required: true,
				description: 'Name of the table to get info for',
			},
			// Record Insert Operation Fields
			{
				displayName: 'Table Name',
				name: 'table_name',
				type: 'string',
				displayOptions: {
					show: { 
						resource: ['record'],
						operation: ['insert'] 
					},
				},
				default: '',
				required: true,
				description: 'Name of the table to insert into',
			},
			{
				displayName: 'Field Names',
				name: 'field_names',
				type: 'string',
				displayOptions: {
					show: { 
						resource: ['record'],
						operation: ['insert'] 
					},
				},
				default: '',
				required: true,
				description: 'Comma-separated field names (e.g., "name, email")',
			},
			{
				displayName: 'Values',
				name: 'values',
				type: 'string',
				displayOptions: {
					show: { 
						resource: ['record'],
						operation: ['insert'] 
					},
				},
				default: '',
				required: true,
				description: 'Comma-separated values (e.g., "\'Alice\', \'alice@example.com\'")',
			},
			// Record List Operation Fields
			{
				displayName: 'Table Name',
				name: 'table_name',
				type: 'string',
				displayOptions: {
					show: { 
						resource: ['record'],
						operation: ['list'] 
					},
				},
				default: '',
				required: true,
				description: 'Name of the table to select from',
			},
			{
				displayName: 'Where Clause',
				name: 'where_clause',
				type: 'string',
				displayOptions: {
					show: { 
						resource: ['record'],
						operation: ['list'] 
					},
				},
				default: '',
				required: false,
				description: 'WHERE clause (e.g., "name = \'Alice\'")',
			},
			// Record Update Operation Fields
			{
				displayName: 'Table Name',
				name: 'table_name',
				type: 'string',
				displayOptions: {
					show: { 
						resource: ['record'],
						operation: ['update'] 
					},
				},
				default: '',
				required: true,
				description: 'Name of the table to update',
			},
			{
				displayName: 'Field Names',
				name: 'field_names',
				type: 'string',
				displayOptions: {
					show: { 
						resource: ['record'],
						operation: ['update'] 
					},
				},
				default: '',
				required: true,
				description: 'Comma-separated field names to update (e.g., "email")',
			},
			{
				displayName: 'Values',
				name: 'values',
				type: 'string',
				displayOptions: {
					show: { 
						resource: ['record'],
						operation: ['update'] 
					},
				},
				default: '',
				required: true,
				description: 'Comma-separated values (e.g., "\'alice@newmail.com\'")',
			},
			{
				displayName: 'Where Clause',
				name: 'where_clause',
				type: 'string',
				displayOptions: {
					show: { 
						resource: ['record'],
						operation: ['update'] 
					},
				},
				default: '',
				required: true,
				description: 'WHERE clause (e.g., "name = \'Alice\'")',
			},
			// Record Delete Operation Fields
			{
				displayName: 'Table Name',
				name: 'table_name',
				type: 'string',
				displayOptions: {
					show: { 
						resource: ['record'],
						operation: ['delete'] 
					},
				},
				default: '',
				required: true,
				description: 'Name of the table to delete from',
			},
			{
				displayName: 'Where Clause',
				name: 'where_clause',
				type: 'string',
				displayOptions: {
					show: { 
						resource: ['record'],
						operation: ['delete'] 
					},
				},
				default: '',
				required: true,
				description: 'WHERE clause (e.g., "name = \'Alice\'")',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				let dbFile = this.getNodeParameter('database', i) as string;
				
				// If no database file specified, get it from credentials
				if (!dbFile || dbFile.trim() === '') {
					const credentials = await this.getCredentials('simpleSqlite');
					dbFile = credentials.databasePath as string;
				}
				
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let query = '';

				// Build SQL query based on resource and operation
				if (resource === 'table') {
					if (operation === 'create') {
						const sql = this.getNodeParameter('sql', i) as string;
						if (!sql.trim()) {
							throw new Error('SQL table definition cannot be empty');
						}
						query = sql;
					} else if (operation === 'list') {
						query = `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;`;
					} else if (operation === 'info') {
						const tableName = this.getNodeParameter('table_name', i) as string;
						if (!tableName.trim()) {
							throw new Error('Table name cannot be empty');
						}
						query = `SELECT sql FROM sqlite_master WHERE type='table' AND name='${tableName}';`;
					}
				} else if (resource === 'record') {
					const tableName = this.getNodeParameter('table_name', i) as string;
					if (!tableName.trim()) {
						throw new Error('Table name cannot be empty');
					}

					if (operation === 'insert') {
						const fieldNames = this.getNodeParameter('field_names', i) as string;
						const values = this.getNodeParameter('values', i) as string;
						if (!fieldNames.trim() || !values.trim()) {
							throw new Error('Field names and values cannot be empty');
						}
						query = `INSERT INTO ${tableName} (${fieldNames}) VALUES (${values});`;
					} else if (operation === 'list') {
						const whereClause = this.getNodeParameter('where_clause', i) as string;
						query = `SELECT * FROM ${tableName}`;
						if (whereClause.trim()) {
							query += ` WHERE ${whereClause}`;
						}
						query += ';';
					} else if (operation === 'update') {
						const fieldNames = this.getNodeParameter('field_names', i) as string;
						const values = this.getNodeParameter('values', i) as string;
						const whereClause = this.getNodeParameter('where_clause', i) as string;
						
						if (!fieldNames.trim() || !values.trim() || !whereClause.trim()) {
							throw new Error('Field names, values, and where clause cannot be empty for update operation');
						}

						// Build SET clause by pairing field names with values
						const fields = fieldNames.split(',').map(f => f.trim());
						const vals = values.split(',').map(v => v.trim());
						
						if (fields.length !== vals.length) {
							throw new Error('Number of field names must match number of values');
						}

						const setClauses = fields.map((field, index) => `${field} = ${vals[index]}`);
						query = `UPDATE ${tableName} SET ${setClauses.join(', ')} WHERE ${whereClause};`;
					} else if (operation === 'delete') {
						const whereClause = this.getNodeParameter('where_clause', i) as string;
						if (!whereClause.trim()) {
							throw new Error('Where clause cannot be empty for delete operation');
						}
						query = `DELETE FROM ${tableName} WHERE ${whereClause};`;
					}
				}

				if (!query.trim()) {
					throw new Error('Unable to generate SQL query for the specified operation');
				}

				const db = new sqlite3.Database(dbFile);

				const result = await new Promise<any[]>((resolve, reject) => {
					if (operation === 'list' || (resource === 'table' && (operation === 'list' || operation === 'info'))) {
						db.all(query, [], (err, rows) => {
							if (err) reject(err);
							else resolve(rows || []);
						});
					} else {
						db.run(query, function (err) {
							if (err) reject(err);
							else resolve([{ changes: this.changes, lastID: this.lastID }]);
						});
					}
				});

				db.close();

				// If no results returned from a SELECT query, return empty array
				if (Array.isArray(result) && result.length === 0 && (operation === 'list' || operation === 'info')) {
					returnData.push({});
				} else {
					returnData.push(...result);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						error: error instanceof Error ? error.message : String(error),
						json: {},
						pairedItem: { item: i },
					});
				} else {
					throw error;
				}
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
