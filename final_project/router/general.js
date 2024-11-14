const express = require('express');
const axios = require("axios").default;
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

let getAllBooks = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(JSON.stringify({books: books}, null, 4))
    },500)});


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password){
        if (!doesExist(username)){
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User registered successfully"});
        } else {
            return res.status(400).json({error: "User already exists"});
        }

    } else {
        return res.status(400).json({error: "Username and password required"});
    }
  
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    getAllBooks.then((response)=> res.status(200).json(response));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const data = JSON.stringify({book: books[isbn]}, null, 4);
    return res.status(200).json(data);  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let booksByAuthor = [];
    Object.keys(books).forEach(function(key) {
        const val = books[key];
        if (val.author == author){
            booksByAuthor.push(val);
        }        
    });
    const data = JSON.stringify({books: booksByAuthor}, null, 4);
    return res.status(200).json(data);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];
  Object.keys(books).forEach(function(key) {
    const val = books[key];
    if (val.title == title){
        booksByTitle.push(val);
    }        
});
const data = JSON.stringify({books: booksByTitle}, null, 4);
return res.status(200).json(data);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (!book){
        res.status(404).json(JSON.stringify({error: 'Book not found'}));
    }
    const reviews = book.reviews ?? {};
    const data = JSON.stringify({reviews: reviews});
    res.status(200).json(data);
  
});

module.exports.general = public_users;
