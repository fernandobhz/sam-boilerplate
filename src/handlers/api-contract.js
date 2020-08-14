const swaggerJson = {
  swagger: "2.0",
  info: {
    title: "Swagger",
    version: "1.0.0",
  },
  paths: {
    "/login": {
      post: {
        tags: ["Login"],
        description: "Login user",
        produces: ["application/json"],
        responses: {
          "200": {
            description: "register",
          },
        },
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            description: "The user login request body",
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                  example: "bob@email.com",
                },
                password: {
                  type: "string",
                  example: "12345678",
                },
              },
            },
          },
        ],
      },
    },
    "/register": {
      post: {
        tags: ["Users"],
        description: "Register an user",
        produces: ["application/json"],
        responses: {
          "200": {
            description: "register",
          },
        },
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            description: "The user registration request body",
            schema: {
              type: "object",
              required: ["name", "email", "password"],
              properties: {
                name: {
                  type: "string",
                  example: "Bob",
                },
                email: {
                  type: "string",
                  example: "bob@email.com",
                },
                password: {
                  type: "string",
                  example: "12345678",
                },
              },
            },
          },
        ],
      },
    },
  },
  definitions: {},
  responses: {},
  parameters: {},
  tags: [],
};

exports.apiContract = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: { "Access-Control-Allow-Origin": "*" } };
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify(swaggerJson, null, 2),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};
