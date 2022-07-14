const User = require("../models/User");
const jwt = require('jsonwebtoken');
const Blog = require('../models/Blog');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'abhinav secret is QWERTYUASDFGqwerty123456!@#$%^&', {
    expiresIn: maxAge
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
    // res.render('/');
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}

module.exports.all_blogs_get = (req, res) => {
  Blog.find()
    .then((result) => {
      res.render('allBlogs', {blogs: result})
    })
    .catch((err) => console.log(err));
}

module.exports.my_blogs_get = (req, res) => {
  // console.log(res.locals.user);
  Blog.find({blogid: res.locals.user._id})
    .then((result) => {
      res.render('myblogs', {blogs: result})
    })
    .catch((err) => console.log(err));
}

module.exports.my_blogs_myblogid_get = (req, res) => {
  // console.log(res.locals.user);
  const id = req.params.id;
  Blog.findById(id)
    .then(result => res.render('openblog', {blog: result}))
    .catch(err => res.render('404'));
}

module.exports.all_blogs_id_get = (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(result => res.render('viewblog', {blog: result}))
    .catch(err => res.render('404'));
}

module.exports.all_blogs_del_id_get = (req, res) => {
  const id = req.params.id;
  
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.redirect('/all-blogs');
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports.all_blogs_post = (req, res) => {
  // console.log("indide posting");
  // console.log(res.locals.user);
  // console.log(req.body, "aaaa");
  const blog = new Blog(req.body);
  blog.blogid = req.params.userid;
  blog.save()
      .then((result) => res.redirect('/my-blogs'))
      .catch((err) => console.log(err));
}

module.exports.about_get = (req, res) => {
  res.render('about');
}