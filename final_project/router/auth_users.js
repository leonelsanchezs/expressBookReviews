const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const tempUser = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    return (tempUser.length == 1);    
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password){
    res.status(404).json({error: "user or password are not correct"});
  }

    //auth user
    if (authenticatedUser(username, password)){
        //token
        let accToken = jwt.sign({ data: username }, 'access_customer', { expiresIn: 60 * 60 });

        req.session.authorization = { accToken, username };
        return res.status(200).json({ message: "Login successfull" });
    } else {
        return res.status(404).json({error: "user or password are not correct"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const user = req.user.data;    

    let book = books[isbn];

    if (!book){
        return res.status(404).json({error: "Book not found"});
    }
    let reviews = book.reviews ?? {};
    reviews[user] = review;
    book.reviews = reviews;
    books[isbn] = book;

    res.status(200).json({message: "Review saved correctly"});
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;   
    const user = req.user.data;    

    let book = books[isbn];

    if (!book){
        return res.status(404).json({error: "Book not found"});
    }
    let reviews = book.reviews ?? {};
    delete reviews[user];
    book.reviews = reviews;
    books[isbn] = book;

    res.status(200).json({message: "Review deleted correctly"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
