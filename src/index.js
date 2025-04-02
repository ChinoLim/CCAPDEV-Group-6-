const express = require("express");
const database = require("./database");
const protocol = require("./protocol");

const app = express();

const port = 3000;

protocol.initAppInstance(app);
protocol.initGetMethods(app, database);
protocol.initPostMethods(app, database);

app.listen(port, () => console.log(`Server listening at port ${port}`));