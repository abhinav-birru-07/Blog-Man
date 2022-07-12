const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const jwt = require('jsonwebtoken');

const Blog = require('./models/Blog');
const app = express();

// middleware

app.use(express.json());
app.use(cookieParser());

// view engine

// database connection
const dbURI = 'mongodb+srv://User2:Password2@clusterabhi.5r53vae.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen( process.env.PORT || 3000))
  .catch((err) => console.log(err));


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

// routes
app.get('*', checkUser); 
// app.get('/', (req, res) => res.render('index'));
app.get('/', (req, res) => {
  // var authheader=req.headers.authorization;
  // console.log(authheader);
  // console.log('hello');

  const blogs = [
      { title: "Blog - 1", snippet: "Lorem ipsum", _id: "62cbfd3c09de80d102fd91aa"},
      { title: "Blog - 1", snippet: "Lorem ipsum", _id: "62cbfda809de80d102fd91ab"},
      { title: "Blog - 1", snippet: "Lorem ipsum", _id: "62cbfdb409de80d102fd91ac"},
      { title: "Blog - 1", snippet: "Lorem ipsum", _id: "62cbfdbc09de80d102fd91ad"},
  ]
  res.render('index', {blogs});
});

// app.post('/all-blogs', (req, res) => {
//   console.log(res.locals.user);
//   // console.log(req.body, "aaaa");
//   const blog = new Blog(req.body);
//   // blog.blogid = res.locals.user._id;
//   blog.save()
//       .then((result) => res.redirect('/all-blogs'))
//       .catch((err) => console.log(err));
// });


app.get('/create', requireAuth, (req, res) => res.render('create'));
app.use(authRoutes);