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

      const {data: history, error: historyError} = await supabase
      .from("recommendation")
      .select("*")
      .eq("u_id", authStatus.user.id);

      console.log(authStatus.user.id);
      res.render("recommendation.ejs", { isAuthenticated: authStatus.authenticated, profileImage: profileImage[0].image, history: history });
    } else {
      res.render("recommendation.ejs", { isAuthenticated: authStatus.authenticated });
    }
  });

  app.get("/recommendation/detail/:id", async (req, res) => {
    const authStatus = isAuthenticated(req);
    if(authStatus.authenticated){
      const { data: profileImage, error: profileImageError } = await supabase
      .from("user")
      .select("image")
      .eq("id", authStatus.user.id);

      const { data, error } = await supabase
      .from("recommendation")
      .select("*")
      .eq("id", req.params.id);

      //history
      const {data: history, error: historyError} = await supabase
      .from("recommendation")
      .select("*")
      .eq("u_id", authStatus.user.id);

      res.render("recommendationDetail.ejs", { isAuthenticated: authStatus.authenticated, profileImage: profileImage[0].image, data: data[0], history: history });
    } else {
      res.render("recommendationDetail.ejs", { isAuthenticated: authStatus.authenticated });
    }
  })

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
    const page = parseInt(req.params.num, 10) || 1;

    // Fetch posts then batch fetch likes/comments
    const rangeStart = page === 1 ? 0 : initStart * (page - 1);
    const rangeEnd = page === 1 ? 5 : page * 5 + (page - 1);
    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .order('id', { ascending: false })
      .range(rangeStart, rangeEnd);

    const posts = postsData || [];
    const ids = posts.map((p) => p.id);

    let likesResult = [];
    let commentsResult = [];

    if (ids.length > 0) {
      // Batch fetch likes and comments instead of N+1 queries
      const { data: likesAll } = await supabase
        .from('likes')
        .select('p_id')
        .in('p_id', ids);

      const likesMap = {};
      (likesAll || []).forEach((r) => {
        likesMap[r.p_id] = (likesMap[r.p_id] || 0) + 1;
      });

      likesResult = ids.map((id) => likesMap[id] || 0);

      const { data: commentsAll } = await supabase
        .from('comments')
        .select('p_id')
        .in('p_id', ids);

      const commentsMap = {};
      (commentsAll || []).forEach((r) => {
        commentsMap[r.p_id] = (commentsMap[r.p_id] || 0) + 1;
      });

      commentsResult = ids.map((id) => commentsMap[id] || 0);
    }

    const { data: total } = await supabase.from('posts').select('id');

    if (authStatus.authenticated) {
      const { data: profileImage } = await supabase
        .from('user')
        .select('image')
        .eq('id', authStatus.user.id);

      return res.render('list.ejs', {
        posts,
        total: total ? total.length : 0,
        currentPage: req.params.num,
        isAuthenticated: authStatus.authenticated,
        likesResult,
        profileImage: profileImage && profileImage[0] ? profileImage[0].image : null,
        commentsResult,
      });
    }

    return res.render('list.ejs', {
      posts,
      total: total ? total.length : 0,
      currentPage: req.params.num,
      isAuthenticated: authStatus.authenticated,
      likesResult,
      commentsResult,
    });
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