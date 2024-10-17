const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const upload = multer();
const { createClient } = require("@supabase/supabase-js");
const isAuthenticated = require("../util/token");
require("dotenv").config();
//supabase link
const supabase = createClient(process.env.SUPABASEURL, process.env.SUPABASEKEY);

function getDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

app.post("/add", async (req, res) => {
  if (!req.body.title || !req.body.content) {
    res.send("Please fill in the title and content");
  } else {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
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
        createdAt: getDate(),
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
    .eq("id", parseInt(req.body.postId));
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
          id: dbEmail[0].id,
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

app.delete("/signOut", async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).send({ message: "success" });
});

app.post("/imgUpload", upload.single("file"), async (req, res) => {
  const file = req.file;
  try {
    const uniqueFileName = `${uuidv4()}-${file.originalname}`;
    const { data, error } = await supabase.storage
      .from("joon-node-bucket")
      .upload(`public/${uniqueFileName}`, file.buffer);

    if (error) {
      console.error("Error uploading image:", error);
      return res.status(500).send("Error uploading image.");
    } else {
      res.json({
        url:
          `${process.env.SUPABASEURL}/storage/v1/object/public/` +
          data.fullPath,
      });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Server error.");
  }
});

app.post("/profileImgUpload", upload.single("file"), async (req, res) => {
  const file = req.file;
  try {
    const uniqueFileName = `${uuidv4()}-${file.originalname}`;
    const { data: initialData, error } = await supabase.storage
      .from("joon-node-bucket")
      .upload(`public/${uniqueFileName}`, file.buffer);
    if (error) {
      console.error("Error uploading image:", error);

      return res.status(500).send("Error uploading image.");
    } else {
      const { data, error } = await supabase
        .from("user")
        .update({
          image:
            `${process.env.SUPABASEURL}/storage/v1/object/public/` +
            initialData.fullPath,
        })
        .eq("email", isAuthenticated(req).user.email);

        const {data: commentImage, error: commentImageError} = await supabase
        .from("comments")
        .update({
          writer_image:
            `${process.env.SUPABASEURL}/storage/v1/object/public/` +
            initialData.fullPath,
        })
        .eq("writer_email", isAuthenticated(req).user.email);

      res.json({url: `${process.env.SUPABASEURL}/storage/v1/object/public/` + initialData.fullPath});

    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Server errorㅋㅋ.");
  }
});

app.delete("/profileImgDelete", async (req, res) => {
  const { data, error } = await supabase
    .from("user")
    .update({ image: null })
    .eq("email", isAuthenticated(req).user.email);

  if (error) {
    res.status(500).send("Internal Server Error");
  } else {

    const { data: commentImage, error: commentImageError } = await supabase
      .from("comments")
      .update({ writer_image: null })
      .eq("writer_email", isAuthenticated(req).user.email);

    res.status(200).send({ message: "success" });
  }
});

app.post("/like", async (req, res) => {
  if (!isAuthenticated(req).authenticated) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  } else {
    const useremail = isAuthenticated(req).user.email;
    const postId = req.body.postId;


    const { data: duplicateCheck, error: duplicateError } = await supabase
      .from("likes")
      .select("*")
      .eq("u_email", useremail)
      .eq("p_id", parseInt(postId));

    if (duplicateCheck.length > 0) {
      res.status(505).json({ message: "Already liked" });
      return;
    } else {
      //중복 아닐때 좋아요 추가
      const { data, error } = await supabase
        .from("likes")
        .insert([
          {
            u_email: useremail,
            p_id: parseInt(postId),
          },
        ])
        .select("*");

      // 추가된 좋아요 개수 가져오기
      const { data: likes, error: likeError } = await supabase
        .from("likes")
        .select("*")
        .eq("p_id", parseInt(postId));

      if (error) {
        res.status(501).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json({ likes: likes.length });
      }
    }
  }
});

app.post("/comment", async (req, res) => {
  const p_id = req.body.postId;
  const content = req.body.content;

  if(!isAuthenticated(req).authenticated){
    res.status(401).json({message: "Unauthorized"});
    return;
  }
  const writer = isAuthenticated(req).user.username;
  const email = isAuthenticated(req).user.email;
  const u_id = isAuthenticated(req).user.id;
  const writer_image = isAuthenticated(req).user.image;

  const { data: profileImage, error: profileImageError } = await supabase
    .from("user")
    .select("image")
    .eq("email", email);

  const { data, error } = await supabase.from("comments").insert([
    {
      p_id: p_id,
      created_at: getDate(),
      content: content,
      writer: writer,
      writer_email: email,
      writer_id: u_id,
      writer_image: profileImage[0].image,
    },
  ]);



  if (error) {
    res.status(500).json({ message: "Internal Server Error" });
  } else {
    res.json({ writer: writer, profileImage: profileImage[0].image });
  }

  // res.json({ message: "success", writer: writer });

  if (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = app;
