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
		properties: [
			{
				displayName: 'Database File',
				name: 'database',
				type: 'string',
				default: '/data/mydb.sqlite',
				required: true,
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
					{ name: 'Select', value: 'select' },
					{ name: 'Insert', value: 'insert' },
					{ name: 'Update', value: 'update' },
					{ name: 'Delete', value: 'delete' },
				],
				default: 'select',
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
					{ name: 'Delete', value: 'delete' },
				],
				default: 'list',
			},
			{
				displayName: 'SQL Query',
				name: 'query',
				type: 'string',
				default: '',
				required: true,
				description: 'SQL query to execute',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const dbFile = this.getNodeParameter('database', i) as string;
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				const query = this.getNodeParameter('query', i) as string;

				if (!query.trim()) {
					throw new Error('SQL query cannot be empty');
				}

				const db = new sqlite3.Database(dbFile);

				const result = await new Promise<any[]>((resolve, reject) => {
					if (operation === 'select' || operation === 'list') {
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

				returnData.push(...result);
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
