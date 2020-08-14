const dynamodb = require('aws-sdk/clients/dynamodb');
const joi = require("joi");
const jsonwebtoken = require("jsonwebtoken");
const { promisify } = require("util");
const bcrypt = require("bcryptjs");

const bcryptGenSalt = promisify(bcrypt.genSalt);
const bcryptHash = promisify(bcrypt.hash);
const docClient = new dynamodb.DocumentClient();
const TableName = process.env.USERS_TABLE;
const jwtSecret = process.env.JWT_SECRET;

exports.registerUser = async (event) => {
  try {
    if (!jwtSecret) throw new Error("process.env.JWT_SECRET is missing");
    
    const { error, value } = joi.object({
        email: joi.string().required(),
        pass: joi.string().required(),
        name: joi.string().required(),
        httpMethod: joi.string().valid("POST").required()
    }).validate({
        ...JSON.parse(event.body),
        httpMethod: event.httpMethod
    }, {abortEarly: false});
      
    if (error) throw new Error(error.message);
    console.info('received:', event); 

    const { email, name } = value;
    const pass = await bcryptHash(value.pass, await bcryptGenSalt(10));

    const existingUser = await docClient.get({TableName, Key: { email }}).promise();
    if (existingUser.Item) throw new Error("Email already exist");

    await docClient.put({TableName, Item: {email, pass, name}}).promise();
    
    const response = {
      statusCode: 201,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(await promisify(jsonwebtoken.sign)({email, name}, jwtSecret))
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    
    return response;
  } catch(err) {
    console.log(err);
    return { statusCode: 400, body: { error: err.message } };
  }
}
