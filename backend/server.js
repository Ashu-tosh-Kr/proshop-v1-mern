import express from "express";
import routes from "./api/v1/index.js";
import config from "./config/index.js";
import { errorHandler, notFound } from "./config/customErrorHandler.js";
import vars from "./config/vars.js";

const startServer = async () => {
  const app = express();
  await config(app);
  app.use(vars.api.prefix, routes());

  //front end as static files
  const __dirname = path.resolve();
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/build")));
    app.get("*", (req, res) =>
      res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
    );
  } else {
    app.get("/", (req, res) => {
      res.send("API is running....");
    });
  }

  //Custom error middleware
  app.use(notFound);
  app.use(errorHandler);

  //start server
  app.listen(vars.port, () =>
    console.log(`Listening on port ${vars.port}`.yellow.bold)
  );
};
startServer();
