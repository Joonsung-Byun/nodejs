// const cookieParser = require("cookie-parser");
// const express = require("express");
// const app = express();
// app.set("view engine", "ejs");
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// app.use(express.static(__dirname + "/public"));

// const indexRouter = require('./routes/route');
// const functionalityRouter = require('./routes/functionality');

// app.use('/', indexRouter);
// app.use('/', functionalityRouter);


// app.listen(8080, () => {
//   console.log(`Server running at http://localhost:8080`);
// });
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

// ✅ EJS 설정 - 절대경로 지정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ 정적 파일 경로
app.use(express.static(path.join(__dirname, "public")));

// ✅ 라우터 연결
const indexRouter = require("./routes/route");
const functionalityRouter = require("./routes/functionality");

app.use("/", indexRouter);
app.use("/", functionalityRouter);

// ❌ Vercel에서는 app.listen() 호출하지 않음
// ✅ 대신 Express 앱을 내보내기(export)만 함
module.exports = app;
