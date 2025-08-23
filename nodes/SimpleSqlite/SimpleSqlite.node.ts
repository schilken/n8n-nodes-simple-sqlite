import {
    IDataObject,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions,
    NodeConnectionType,
    NodeOperationError,
} from 'n8n-workflow';

import sqlite3 from 'sqlite3';

export class SimpleSqlite implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Simple SQLite',
		name: 'simpleSqlite',
		icon: 'file:SimpleSqlite.svg',
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
				name: 'simpleSqliteApi',
				required: true,
			},
		],
		properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
																noDataExpression: true,
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
																noDataExpression: true,
                displayOptions: {
                    show: { resource: ['record'] },
                },
                options: [
                    { name: 'List', value: 'list', action: 'List a record' },
                    { name: 'Insert', value: 'insert', action: 'Insert a record' },
                    { name: 'Update', value: 'update', action: 'Update a record' },
                    { name: 'Delete', value: 'delete', action: 'Delete a record' },
                ],
                default: 'list',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
																noDataExpression: true,
                displayOptions: {
                    show: { resource: ['table'] },
                },
                options: [
                    { name: 'Create', value: 'create', action: 'Create a table' },
                    { name: 'List', value: 'list', action: 'List a table' },
                    { name: 'Info', value: 'info', action: 'Info a table' },
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

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            try {
                // Get database file from credentials
                const credentials = await this.getCredentials('simpleSqlite');
                const dbFile = credentials.databasePath as string;
                
                const resource = this.getNodeParameter('resource', itemIndex) as string;
                const operation = this.getNodeParameter('operation', itemIndex) as string;

				let query = '';

				// Build SQL query based on resource and operation
				if (resource === 'table') {
					if (operation === 'create') {
						const sql = this.getNodeParameter('sql', itemIndex) as string;
						if (!sql.trim()) {
							throw new NodeOperationError(this.getNode(), new Error('SQL table definition cannot be empty'), {
                                itemIndex,
                            });
						}
						query = sql;
					} else if (operation === 'list') {
						query = `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;`;
					} else if (operation === 'info') {
						const tableName = this.getNodeParameter('table_name', itemIndex) as string;
						if (!tableName.trim()) {
							throw new NodeOperationError(this.getNode(), new Error('Table name cannot be empty'), {
                                itemIndex,
                            });
						}
						query = `SELECT sql FROM sqlite_master WHERE type='table' AND name='${tableName}';`;
					}
				} else if (resource === 'record') {
					const tableName = this.getNodeParameter('table_name', itemIndex) as string;
					if (!tableName.trim()) {
						throw new NodeOperationError(this.getNode(), new Error('Table name cannot be empty'), {
                            itemIndex,
                        });
					}

					if (operation === 'insert') {
						const fieldNames = this.getNodeParameter('field_names', itemIndex) as string;
						const values = this.getNodeParameter('values', itemIndex) as string;
						if (!fieldNames.trim() || !values.trim()) {
							throw new NodeOperationError(this.getNode(), new Error('Field names and values cannot be empty'), {
                                itemIndex,
                            });
						}
						query = `INSERT INTO ${tableName} (${fieldNames}) VALUES (${values});`;
					} else if (operation === 'list') {
						const whereClause = this.getNodeParameter('where_clause', itemIndex) as string;
						query = `SELECT * FROM ${tableName}`;
						if (whereClause.trim()) {
							query += ` WHERE ${whereClause}`;
						}
						query += ';';
					} else if (operation === 'update') {
						const fieldNames = this.getNodeParameter('field_names', itemIndex) as string;
						const values = this.getNodeParameter('values', itemIndex) as string;
						const whereClause = this.getNodeParameter('where_clause', itemIndex) as string;
						
						if (!fieldNames.trim() || !values.trim() || !whereClause.trim()) {
							throw new NodeOperationError(this.getNode(), new Error('Field names, values, and where clause cannot be empty for update operation'), {
                                itemIndex,
                            });
						}

						// Build SET clause by pairing field names with values
						const fields = fieldNames.split(',').map(f => f.trim());
						const vals = values.split(',').map(v => v.trim());
						
						if (fields.length !== vals.length) {
							throw new NodeOperationError(this.getNode(), new Error('Number of field names must match number of values'), {
                                itemIndex,
                            });
						}

						const setClauses = fields.map((field, index) => `${field} = ${vals[index]}`);
						query = `UPDATE ${tableName} SET ${setClauses.join(', ')} WHERE ${whereClause};`;
					} else if (operation === 'delete') {
						const whereClause = this.getNodeParameter('where_clause', itemIndex) as string;
						if (!whereClause.trim()) {
							throw new NodeOperationError(this.getNode(), new Error('Where clause cannot be empty for delete operation'), {
                                itemIndex,
                            });
						}
						query = `DELETE FROM ${tableName} WHERE ${whereClause};`;
					}
				}

				if (!query.trim()) {
					throw new NodeOperationError(this.getNode(), new Error('Unable to generate SQL query for the specified operation'), {
                        itemIndex,
                    });
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
						pairedItem: { item: itemIndex },
					});
				} else {
					throw error;
				}
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
