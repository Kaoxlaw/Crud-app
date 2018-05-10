import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import auth from "./routes/auth";
import portfolio from "./routes/portfolio";

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/auth', auth);

app.use('/portfolio', portfolio);


//Connexion à Mongoose
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost/portfoliophoto")
  .then(() => console.log("Mongodb Connected..."))
  .catch(err => console.log(err));

let port = 8000;
app.listen(port, () => {
  console.log(`Server start on de port ${port}`);
});
