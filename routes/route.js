const express = require('express');
const app = express();
const isAuthenticated = require('../util/token');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASEURL, process.env.SUPABASEKEY);

app.get("/", (req, res) => {
    res.redirect("/list/1");
  });

  app.get("/recommendation", async (req, res) => {
    const authStatus = isAuthenticated(req);
    if(authStatus.authenticated){
      const { data: profileImage, error: profileImageError } = await supabase
      .from("user")
      .select("image")
      .eq("id", authStatus.user.id);
      res.render("recommendation.ejs", { isAuthenticated: authStatus.authenticated, profileImage: profileImage[0].image });
    } else {
      res.render("recommendation.ejs", { isAuthenticated: authStatus.authenticated });
    }
  });

app.get("/write", async (req, res) => {
    const authStatus = isAuthenticated(req);
    if (!authStatus.authenticated) {
      res.send("<script>alert('Login is needed.');location.href='/login';</script>");
    } else {
      const { data: profileImage, error: profileImageError } = await supabase
      .from("user")
      .select("image")
      .eq("id", authStatus.user.id);
      res.render("write.ejs", { isAuthenticated: authStatus.authenticated, profileImage: profileImage[0].image });
    }
    
  });

app.get("/login", (req, res) => {
    const authStatus = isAuthenticated(req);
    res.render("login.ejs", { isAuthenticated: authStatus.authenticated });
  });

app.get("/signup", (req, res) => {
    const authStatus = isAuthenticated(req);
    res.render("signup.ejs",  { isAuthenticated: authStatus.authenticated });
});

app.get("/edit/:id", async (req, res) => {
    const authStatus = isAuthenticated(req);
    if(!authStatus.authenticated) {
      res.send("<script>alert('Login is needed.');location.href='/login';</script>");
    }
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", req.params.id);


    res.render("edit.ejs", { data: data[0], isAuthenticated: authStatus.authenticated, profileImage: authStatus.user.image });
  });

app.get("/detail/:id", async (req, res) => {
    const authStatus = isAuthenticated(req);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", req.params.id);
      if (data == null || data.length == 0) {
        res.status(404).send("Not Found");
      }

      const { data: likes, error: likeError } = await supabase
        .from("likes")
        .select("p_id")
        .eq("p_id", req.params.id);

      const { data: comments, error: commentError } = await supabase
        .from("comments")
        .select("*")
        .eq("p_id", req.params.id);

      if(authStatus.authenticated){
        const { data: profileImage, error: profileImageError } = await supabase
        .from("user")
        .select("image")
        .eq("id", authStatus.user.id);

        res.render("detail.ejs", { data: data[0], isAuthenticated: authStatus.authenticated, likes: likes, comments: comments, profileImage: profileImage[0].image });
      } else {
      
      res.render("detail.ejs", { data: data[0], isAuthenticated: authStatus.authenticated, likes: likes, comments: comments });
      }
    } catch (e) {
      res.status(404).send("Not Found");
    }
  });

app.get("/list/:num", async (req, res) => {
  const initStart = 6;
  const authStatus = isAuthenticated(req);

  if (req.params.num == 1) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("id", { ascending: false }) 
      .range(0, 5);

      const ids = data.map((post) => post.id);
      
      let likesResult = [];
      try {
            for (let i = 0; i < ids.length; i++) {
              const { data, error } = await supabase
                .from("likes")
                .select("*")
                .eq("p_id", parseInt(ids[i]));
          
              if (error) {
                console.error(`Error fetching likes for id ${ids[i]}:`, error);
                continue; // 다음 id로 넘어갑니다.
              }
              likesResult.push(data.length);
            }
          } catch (err) {
            console.error("Unexpected error:", err);
            res.status(500).json({ message: "Internal Server Error" });
          }
          let commentsResult = [];

          for( let i = 0; i < ids.length; i++){
            const { data: commentLength, error } = await supabase
            .from("comments")
            .select("*")
            .eq("p_id", parseInt(ids[i]));
            commentsResult.push(commentLength.length);
          }

          console.log(commentsResult);

    
      const { data: total, error: totalError } = await supabase
      .from("posts")
      .select("id");

    const { data: likes, error: likeError } = await supabase
      .from("likes")
      .select("p_id")
      .order("id", { ascending: false }) 
      .range(0, 5);

      if(authStatus.authenticated){
        const { data: profileImage, error: profileImageError } = await supabase
        .from("user")
        .select("image")
        .eq("id", authStatus.user.id);

        res.render("list.ejs", {
          posts: data,
          total: total.length,
          currentPage: req.params.num,
          isAuthenticated: authStatus.authenticated,
          likesResult: likesResult,
          profileImage: profileImage[0].image,
          commentsResult: commentsResult
        })
      } else {
        res.render("list.ejs", {
          posts: data,
          total: total.length,
          currentPage: req.params.num,
          isAuthenticated: authStatus.authenticated,
          likesResult: likesResult,
          commentsResult: commentsResult
      });
      }
  } else {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("id", { ascending: false }) 
      .range(
        initStart * (req.params.num - 1),
        req.params.num * 5 + (req.params.num - 1)
      );

      const ids = data.map((post) => post.id);
      let likesResult = [];
      try {
            for (let i = 0; i < ids.length; i++) {
              const { data, error } = await supabase
                .from("likes")
                .select("*")
                .eq("p_id", parseInt(ids[i]));
          
              if (error) {
                console.error(`Error fetching likes for id ${ids[i]}:`, error);
                continue; // 다음 id로 넘어갑니다.
              }
              likesResult.push(data.length);
            }
          } catch (err) {
            console.error("Unexpected error:", err);
            res.status(500).json({ message: "Internal Server Error" });
          }
    const { data: total, error: totalError } = await supabase
      .from("posts")
      .select("id");

    res.render("list.ejs", {
      posts: data,
      total: total.length,
      currentPage: req.params.num,
      isAuthenticated: authStatus.authenticated,
      likesResult: likesResult,
    });
  }
});

app.get("/myPage", async (req, res) => {
  const authStatus = isAuthenticated(req);
  if (!authStatus.authenticated) {
    res.send("<script>alert('Login is needed.');location.href='/login';</script>");
  } 
  else {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("writer_email", authStatus.user.email);

      const { data: profileImage, error: profileImageError } = await supabase
      .from("user")
      .select("image")
      .eq("id", authStatus.user.id);

    res.render("mypage.ejs", { posts: data, isAuthenticated: authStatus.authenticated, user: authStatus.user, profileImage: profileImage[0].image });
  }
});

module.exports = app;