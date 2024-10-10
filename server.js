const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(__dirname + "/public"));

const indexRouter = require('./routes/route');
const functionalityRouter = require('./routes/functionality');

app.use('/', indexRouter);
app.use('/', functionalityRouter);


app.listen(8080, () => {
  console.log(`Server running at http://localhost:8080`);
});
