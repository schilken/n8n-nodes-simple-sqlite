import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SimpleSqliteApi implements ICredentialType {
	name = 'simpleSqliteApi';
	displayName = 'Simple SQLite API';
	documentationUrl = 'https://github.com/schilken/n8n-nodes-simple-sqlite';
	properties: INodeProperties[] = [
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