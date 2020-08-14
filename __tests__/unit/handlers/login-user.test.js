const lambda = require('../../../src/handlers/login-user.js'); 
const dynamodb = require('aws-sdk/clients/dynamodb'); 
const jsonwebtoken = require("jsonwebtoken");
const { promisify } = require("util");
const bcrypt = require("bcryptjs");

const bcryptGenSalt = promisify(bcrypt.genSalt);
const bcryptHash = promisify(bcrypt.hash);
const jwtSecret = process.env.JWT_SECRET;

describe('Test loginUser', function () { 
    let putSpy;  
    beforeAll(() => { putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'get'); });
    afterAll(() => { putSpy.mockRestore(); }); 
 
    it('should register user', async () => {                  
        const email = 'bob@contoso.com';
        const pass =  '12345678';
        const name = 'bob';
        
        const hashed = await bcryptHash('12345678', await bcryptGenSalt(10));
        putSpy.mockReturnValue({promise: () => Promise.resolve({Item: {email, pass: hashed, name}})});

        const event = { httpMethod: 'POST', body: JSON.stringify({ email, pass }) };
        const { body } = await lambda.loginUser(event);
        const jwt = JSON.parse(body);

        const obj = await promisify(jsonwebtoken.verify)(jwt, jwtSecret);        
        expect(obj.email).toBe(email);
        expect(obj.name).toBe(name);
    });
});
