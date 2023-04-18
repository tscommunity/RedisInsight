/* eslint-disable dot-notation */
import { expect } from '@playwright/test';
import { Chance } from 'chance';
import request from 'supertest';
import { asyncFilter, doAsyncStuff } from '../async-helper';
import { AddNewDatabaseParameters, databaseParameters } from '../../pageObjects/add-redis-database-page';
import { Common } from '../common';

const chance = new Chance();
const common = new Common();
const endpoint = common.getEndpoint();

/**
 * Add a new Standalone database through api using host and port
 * @param databaseParameters The database parameters
 */
export async function addNewStandaloneDatabaseApi(databaseParameters: AddNewDatabaseParameters): Promise<void> {
    const uniqueId = chance.string({ length: 10 });
    const requestBody = {
        'name': databaseParameters.databaseName,
        'host': databaseParameters.host,
        'port': Number(databaseParameters.port),
        'username': databaseParameters.databaseUsername,
        'password': databaseParameters.databasePassword
    };

    if (databaseParameters.caCert) {
        requestBody['tls'] = true;
        requestBody['verifyServerCert'] = false;
        requestBody['caCert'] = {
            'name': `ca}-${uniqueId}`,
            'certificate': databaseParameters.caCert.certificate
        };
        requestBody['clientCert'] = {
            'name': `client}-${uniqueId}`,
            'certificate': databaseParameters.clientCert?.certificate,
            'key': databaseParameters.clientCert?.key
        };
    }

    const response = await request(endpoint).post('/databases')
        .send(requestBody)
        .set('Accept', 'application/json');
    expect(response.status).toEqual(201);
    expect(await response.body.name).toEqual(databaseParameters.databaseName);
}

/**
 * Get all databases through api
 */
export async function getAllDatabases(): Promise<string[]> {
    const response = await request(endpoint).get('/databases')
        .set('Accept', 'application/json').expect(200);
    return await response.body;
}

/**
 * Get database through api using database name
 * @param databaseName The database name
 */
export async function getDatabaseIdByName(databaseName?: string): Promise<string> {
    if (!databaseName) {
        throw new Error('Error: Missing databaseName');
    }
    let databaseId: any;
    const allDataBases = await getAllDatabases();
    const response = await asyncFilter(allDataBases, async(item: databaseParameters) => {
        await doAsyncStuff();
        return item.name === databaseName;
    });

    if (response.length !== 0) {
        databaseId = await response[0].id;
    }
    return databaseId;
}

/**
 * Delete Standalone database through api
 * @param databaseParameters The database parameters
 */
export async function deleteStandaloneDatabaseApi(databaseParameters: AddNewDatabaseParameters): Promise<void> {
    const databaseId = await getDatabaseIdByName(databaseParameters.databaseName);
    await request(endpoint).delete('/databases')
        .send({ 'ids': [`${databaseId}`] })
        .set('Accept', 'application/json')
        .expect(200);
}
