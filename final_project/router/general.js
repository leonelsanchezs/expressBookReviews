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
    const axiosBooks = await axios.get('https://leonelsanche-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/static/books.json'); 
    
    res.status(200).json(JSON.stringify(axiosBooks.data));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    const axiosBooks = await axios.get('https://leonelsanche-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/static/books.json'); 
    
    const data = JSON.stringify({book: axiosBooks.data[isbn]}, null, 4);
    return res.status(200).json(data);  
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    const axiosBooks = await axios.get('https://leonelsanche-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/static/books.json'); 
    
    let booksByAuthor = [];
    Object.keys(books).forEach(function(key) {
        const val = axiosBooks.data[key];
        if (val.author == author){
            booksByAuthor.push(val);
        }        
    });
    const data = JSON.stringify({books: booksByAuthor}, null, 4);
    return res.status(200).json(data);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];
  const axiosBooks = await axios.get('https://leonelsanche-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/static/books.json'); 
    
  Object.keys(axiosBooks.data).forEach(function(key) {
    const val = axiosBooks.data[key];
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
