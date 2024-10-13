const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const multer = require("multer");
const upload = multer();
const { createClient } = require("@supabase/supabase-js");
const isAuthenticated = require("../util/token");
require("dotenv").config();
//supabase link
const supabase = createClient(process.env.SUPABASEURL, process.env.SUPABASEKEY);

function getTimePost(){
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}${hour}:${minute
  }:${second}`;

  return formattedDate;
}

app.post("/add", async (req, res) => {
  console.log(isAuthenticated(req).user)
  if (!req.body.title || !req.body.content) {
    res.send("Please fill in the title and content");
  } else {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    console.log(req.body.thumbnailUrl)
    const { data, error } = await supabase
      .from("posts")
      .insert({ 
        title: req.body.title, 
        content: req.body.content, 
        writer: isAuthenticated(req).user.username, 
        date: formattedDate,
        writer_email: isAuthenticated(req).user.email,
        tags: req.body.tags,
        markdownContent: req.body.markdownContent,
        thumbnailUrl: req.body.thumbnailUrl,
      })
      .select("*");
    res.redirect("/list/1");
  }
});

app.post("/edit", async (req, res) => {
  const { data, error } = await supabase
    .from("posts")
    .update({ title: req.body.title, content: req.body.content })
    .eq("id", req.body.id)
    .select("*")
    .order("id", { ascending: false });
  res.redirect("/detail/" + req.body.id);
});

app.delete("/delete", async (req, res) => {
  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", parseInt(req.body.id));
  if (error) {
    res.status(500).send("Internal Server Error");
  } else {
    res.status(200).send({ message: "success" });
  }
});

app.post("/login", async (req, res) => {
  const { data: dbEmail, error } = await supabase
    .from("user")
    .select("*")
    .eq("email", req.body.email);
  const { data: dbPassword, error: passwordError } = await supabase
    .from("user")
    .select("password")
    .eq("email", req.body.email);

  if (dbEmail.length == 0) {
    res.status(401).send({ error: "Unauthorized", message: "Invalid email" });
  } else {
    if (req.body.password == dbPassword[0].password) {
      token = jwt.sign(
        {
          type: "JWT",
          email: req.body.email,
          username: dbEmail[0].username,
          image: dbEmail[0].image,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "1w",
          issuer: "jsb",
        }
      );
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });

      return res.status(200).json({
        code: 200,
        message: "Token is successfully issued",
        jwt: token,
      });
    } else {
      res
        .status(401)
        .send({ error: "Unauthorized", message: "Invalid password" });
    }
  }
});

app.post("/signOut", async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).send({ message: "success" });
});

app.post("/imgUpload", upload.single("file"), async (req, res) => {
  const file = req.file;


  try {
    const { data, error } = await supabase.storage
      .from("joon-node-bucket")
      .upload(`public/${file.originalname}`, file.buffer);

    if (error) {
      console.error("Error uploading image:", error);
      return res.status(500).send("Error uploading image.");
    } else {
      console.log(data.fullPath)
      res.json({ url: `${process.env.SUPABASEURL}/storage/v1/object/public/` + data.fullPath})
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Server error.");
  }
});

module.exports = app;
