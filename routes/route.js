const express = require('express');
const app = express();
const isAuthenticated = require('../util/token');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASEURL, process.env.SUPABASEKEY);

app.get("/", (req, res) => {
    res.redirect("/list/1");
  });

app.get("/write", (req, res) => {
    const authStatus = isAuthenticated(req);
    if (!authStatus.authenticated) {
      res.send("<script>alert('Login is needed.');location.href='/login';</script>");
    } else {
      res.render("write.ejs", { isAuthenticated: authStatus.authenticated });
    }
    
  });

app.get("/login", (req, res) => {
    const authStatus = isAuthenticated(req);
    console.log('여길 오셨군요')
    res.render("login.ejs", { isAuthenticated: authStatus.authenticated });
  });

app.get("/signup", (req, res) => {
    const authStatus = isAuthenticated(req);
    res.render("signup.ejs",  { isAuthenticated: authStatus.authenticated });
});

app.get("/edit/:id", async (req, res) => {
    const authStatus = isAuthenticated(req);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", req.params.id);
    res.render("edit.ejs", { data: data[0], isAuthenticated: authStatus.authenticated });
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

      
      res.render("detail.ejs", { data: data[0], isAuthenticated: authStatus.authenticated });
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
    const { data: total, error: totalError } = await supabase
      .from("posts")
      .select("id");
    res.render("list.ejs", {
      posts: data,
      total: total.length,
      currentPage: req.params.num,
      isAuthenticated: authStatus.authenticated,
    });
  } else {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("id", { ascending: false }) 
      .range(
        initStart * (req.params.num - 1),
        req.params.num * 5 + (req.params.num - 1)
      );
    const { data: total, error: totalError } = await supabase
      .from("posts")
      .select("id");
    res.render("list.ejs", {
      posts: data,
      total: total.length,
      currentPage: req.params.num,
      isAuthenticated: authStatus.authenticated,
    });
  }
});

app.get("/myPage", async (req, res) => {
  const authStatus = isAuthenticated(req);
  if (!authStatus.authenticated) {
    res.send("<script>alert('Login is needed.');location.href='/login';</script>");
  } else {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("writer_email", authStatus.user.email);
    res.render("myPage.ejs", { posts: data, isAuthenticated: authStatus.authenticated, user: authStatus.user, });
  }
});

module.exports = app;