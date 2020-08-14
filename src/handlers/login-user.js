const dynamodb = require("aws-sdk/clients/dynamodb");
const joi = require("joi");
const jsonwebtoken = require("jsonwebtoken");
const { promisify } = require("util");
const bcrypt = require("bcryptjs");

const bcryptCompare = promisify(bcrypt.compare);
const docClient = new dynamodb.DocumentClient();
const TableName = process.env.USERS_TABLE;
const jwtSecret = process.env.JWT_SECRET;

exports.loginUser = async (event) => {
  try {
    if (!jwtSecret) throw new Error("process.env.JWT_SECRET is missing");

    const { error, value } = joi
      .object({
        email: joi.string().required(),
        pass: joi.string().required(),
        httpMethod: joi.string().valid("POST").required(),
      })
      .validate(
        {
          ...JSON.parse(event.body),
          httpMethod: event.httpMethod,
        },
        { abortEarly: false }
      );

    if (error) throw new Error(error.message);
    console.info("received:", event);

    const { email, pass } = value;
    const { Item } = await docClient
      .get({ TableName, Key: { email } })
      .promise();
    const { name, pass: hashed } = Item;

    if (!(await bcryptCompare(pass, hashed))) throw new Error("Access Denied");

    const response = {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(
        await promisify(jsonwebtoken.sign)({ email, name }, jwtSecret)
      ),
    };

    console.info(
      `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
    );

    return response;
  } catch (err) {
    console.error(err);
    return { statusCode: 400, body: { error: err.message } };
  }
};
