/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html",
    './views/**/*.ejs'
  ],
  
  theme: {
    extend: {},
  },
  plugins: [],
}

// app.get("/detail/:id", async (req, res) => {
//   res.render('detail.ejs', {id: req.params.id});
// })