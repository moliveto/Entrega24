import { CLIENT_URL } from "./config.js";

export const swaggerOpts = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Express API with Swagger",
            version: "0.1.0",
            description:
                "This is a simple CRUD API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Marcelo",
                url: `${CLIENT_URL}`,
                email: "marcelo.oliveto@gmail.com",
            },
        },
        servers: [
            {
                url: `${CLIENT_URL}`,
            },
        ],
    },
    apis: ["./src/routes/*.js"],
};