const lambda = require('../../../src/handlers/register-user.js'); 
const dynamodb = require('aws-sdk/clients/dynamodb'); 
const jsonwebtoken = require("jsonwebtoken");
const { promisify } = require("util");

const jwtSecret = process.env.JWT_SECRET;

describe('Test registerUser', function () { 
    let putSpyGet;
    let putSpyPut;
    beforeAll(() => { 
        putSpyGet = jest.spyOn(dynamodb.DocumentClient.prototype, 'get'); 
        putSpyPut = jest.spyOn(dynamodb.DocumentClient.prototype, 'put'); 
    });
    afterAll(() => { 
        putSpyGet.mockRestore(); 
        putSpyPut.mockRestore(); 
    });
 
    it('should register user', async () => {
        const email = 'bob@contoso.com';
        const pass = '12345678';
        const name = 'bob';
        
        putSpyGet.mockReturnValue({promise: () => Promise.resolve({})});
        putSpyPut.mockReturnValue({promise: () => Promise.resolve()});

        const event = { httpMethod: 'POST', body: JSON.stringify({ email, pass, name}) };
        const resp = await lambda.registerUser(event);

        const { statusCode, body } = resp;
        const jwt = JSON.parse(body);
        
        const obj = await promisify(jsonwebtoken.verify)(jwt, jwtSecret);        
        expect(obj.email).toBe(email);
        expect(obj.name).toBe(name);
    }); 
}); 
