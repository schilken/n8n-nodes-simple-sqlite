import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SimpleSqlite implements ICredentialType {
	name = 'simpleSqlite';
	displayName = 'Simple SQLite';
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