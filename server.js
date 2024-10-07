const { supabaseDB } = require("./util/supabaseClient");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const secretKey = require('./util/jwt')
const SECRET_KEY = secretKey;
console.log(SECRET_KEY);
const bcrypt = require('bcrypt');
const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// public 폴더를 정적 파일 제공 폴더로 설정
app.use(express.static(__dirname + "/public"));

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/list/:num", async (req, res) => {
  const initStart = 6;
  if(req.params.num == 1) {
    const { data, error } = await supabaseDB.from("posts").select("*").range(0, 5)
    const { data: total, error: totalError } = await supabaseDB.from("posts").select("id");
    res.render("list.ejs", { posts: data, total: total.length, currentPage: req.params.num });
  } else {
    const { data, error } = await supabaseDB.from("posts").select("*").range(initStart * (req.params.num - 1), (req.params.num * 5) + (req.params.num - 1))
    const { data: total, error: totalError } = await supabaseDB.from("posts").select("id");
    res.render("list.ejs", { posts: data, total: total.length, currentPage: req.params.num });
  }
});

app.get("/write", (req, res) => {
  res.render("write.ejs");
});

app.post("/add", async (req, res) => {
  if (!req.body.title || !req.body.content) {
    res.send("Please fill in the title and content");
  } else {
    const { data, error } = await supabaseDB
      .from("posts")
      .insert({ title: req.body.title, content: req.body.content })
      .select("*");
    res.redirect("/list");
  }
});

app.get("/detail/:id", async (req, res) => {
  try{
    const { data, error } = await supabaseDB.from("posts").select("*").eq("id", req.params.id);
    if(data == null || data.length == 0) {
      res.status(404).send("Not Found");
    }
    res.render("detail.ejs", { data: data[0] });
  } catch(e) {
    res.status(404).send("Not Found");
  }
});

app.get("/edit/:id", async (req, res) => {
  const {data, error} = await supabaseDB.from("posts").select("*").eq("id", req.params.id);
  res.render("edit.ejs", { data: data[0]});
});

app.post("/edit", async (req, res) => {
  const { data, error } = await supabaseDB
    .from("posts")
    .update({ title: req.body.title, content: req.body.content })
    .eq("id", req.body.id)
    .select("*")
    .order("id", { ascending: false });
  res.redirect("/list");
});

app.delete("/delete", async (req, res) => {
  const {data, error} = await supabaseDB.from("posts").delete().eq("id", parseInt(req.body.id));
  if(error) {
    res.status(500).send("Internal Server Error");
  } else {
    res.status(200).send({message: "success"});
  }
})

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", async (req, res) => {

 const { data: dbEmail, error } = await supabaseDB.from("user").select("*").eq("email", req.body.email)
 const { data: dbPassword, error: passwordError } = await supabaseDB.from("user").select("password").eq("email", req.body.email)

 if(dbEmail.length == 0) {
   //해당 이메일이 없는 경우
   //해당 이메일을 찾을 수 없습니다.
   res.status(401).send({error: "Unauthorized", message: "Invalid email"});
 } else {
   // 이메일을 찾은 경우
  // 아직 bcrypt를 사용하지 않음
  if(req.body.password == dbPassword[0].password) {
    //패스워드까지 일치하는경우
    token = jwt.sign({
        type: 'JWT',
        email: req.body.email,
        username: dbEmail[0].username,
        image: dbEmail[0].image
      }, SECRET_KEY, {
        expiresIn: '1w', 
        issuer: 'jsb',
      });
      // console.log(token);
    
      //response
      res.cookie('jwt',token, {
        httpOnly: true, 
        secure: false, 
        sameSite: 'strict' 
      })

      return res.status(200).json({
        code: 200,
        message: 'Token is successfully issued',
        jwt: token
      });

  } else {
    //이메일은 찾았지만 패스워드가 일치하지 않는 경우
    // 해당 이메일의 패스워드를 찾을 수 없습니다.
     res.status(401).send({error: "Unauthorized", message: "Invalid password"});
  }
 }


});

app.listen(8080, () => {
  console.log(`Server running at http://localhost:8080`);
});

