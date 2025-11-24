// Swagger documentation for GameHub API
// Complete OpenAPI 3.0 specification

module.exports = {
  openapi: "3.0.0",
  info: {
    title: "GameHub API",
    version: "1.0.0",
    description: "API documentation for the GameHub backend application."
  },
  servers: [
    {
      url: "http://localhost:5000/api",
      description: "Local server"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          username: { type: "string" },
          role: { type: "string", enum: ["admin", "player"] }
        }
      },
      Player: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          rank: { type: "string" },
          score: { type: "number" }
        }
      },
      Session: {
        type: "object",
        properties: {
          id: { type: "string" },
          game: { type: "string" },
          players: {
            type: "array",
            items: { type: "string" }
          },
          status: { type: "string", enum: ["pending", "active", "finished"] }
        }
      }
    }
  },

  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  password: { type: "string" },
                  role: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "User registered successfully" },
          400: { description: "Validation error" }
        }
      }
    },

    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Login successful" },
          401: { description: "Invalid credentials" }
        }
      }
    },

    "/players": {
      get: {
        tags: ["Players"],
        summary: "List all players",
        responses: {
          200: {
            description: "List of players",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Player" } }
              }
            }
          }
        }
      },
      post: {
        security: [{ bearerAuth: [] }],
        tags: ["Players"],
        summary: "Create a new player",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Player" }
            }
          }
        },
        responses: {
          201: { description: "Player created" },
          401: { description: "Unauthorized" }
        }
      }
    },

    "/players/{id}": {
      get: {
        tags: ["Players"],
        summary: "Get a player by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Player details" },
          404: { description: "Player not found" }
        }
      },
      put: {
        security: [{ bearerAuth: [] }],
        tags: ["Players"],
        summary: "Update a player",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Player" }
            }
          }
        },
        responses: {
          200: { description: "Player updated" },
          401: { description: "Unauthorized" }
        }
      },
      delete: {
        security: [{ bearerAuth: [] }],
        tags: ["Players"],
        summary: "Delete a player",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Player deleted" },
          401: { description: "Unauthorized" }
        }
      }
    },

    "/sessions": {
      get: {
        tags: ["Sessions"],
        summary: "List all sessions",
        responses: {
          200: {
            description: "List of sessions",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Session" } } } }
          }
        }
      },
      post: {
        security: [{ bearerAuth: [] }],
        tags: ["Sessions"],
        summary: "Create a session",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Session" } } }
        },
        responses: {
          201: { description: "Session created" },
          401: { description: "Unauthorized" }
        }
      }
    },

    "/sessions/{id}": {
      get: {
        tags: ["Sessions"],
        summary: "Get a session by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Session details" },
          404: { description: "Not found" }
        }
      },
      put: {
        security: [{ bearerAuth: [] }],
        tags: ["Sessions"],
        summary: "Update a session",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Session" } } }
        },
        responses: {
          200: { description: "Session updated" }
        }
      },
      delete: {
        security: [{ bearerAuth: [] }],
        tags: ["Sessions"],
        summary: "Delete a session",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Session deleted" }
        }
      }
    }
  }
};