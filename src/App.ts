import Express from "express";
import http from "http";
import http2 from "http2";
import cors from "cors";

import graphqlMiddleware from "./graphql.middleware";
// import Response from "./Response";

export default class App {
  services;
  constructor(services) {
    this.services = services;
  }

  start(): Express {
    const { express } = this.services;

    express.disable("x-powered-by");

    express.set("services", this.services);

    // configure top-level express middleware, e.g. bodyParser, cors etc

    express.use(async (request, response, next) => {
      const { session, events } = this.services;

      events.emit("boot", this.services);

      // boot any services, e.g. establish database connection,
      // read request headers to initialize the session etc.

      events.emit("ready", this.services);

      // not in the scope of this example,
      // but there is a similar event emitted from the
      // last express middleware we use to wrap our route response
      // into an API response
      events.emit("request", request);

      next();
    });

    // CORS
    express.options("*", cors({ origin: "*" }));
    express.use(cors({ origin: "*" }));

    // register express routes
    express.use("/graphql", graphqlMiddleware(this.services));
    // register error/response handling middleware

    process.on("unhandledRejection", (err) => {
      const { logger } = this.services;

      logger.error(err);
      process.exit(1);
    });

    return express;
  }

  serve() {
    const { express, config, logger } = this.services;

    logger.info("App is serving");

    const port = config.port || 4000;
    const hostname = config.hostname || "localhost";

    express.set("port", port);
    express.set("hostname", hostname);

    const server = http.createServer(express);

    server.listen({
      port,
      host: hostname,
    });

    server.on("error", (err) => {
      // handle your errors
      logger.error("App serve error", err);
    });

    return this;
  }
}
