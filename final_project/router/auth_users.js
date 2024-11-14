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
        let accToken = jwt.sign({ data: password }, 'access_customer', { expiresIn: 60 * 60 });

        req.session.authorization = { accToken, username };
        return res.status(200).json({ message: "Login successfull" });
    } else {
        return res.status(404).json({error: "user or password are not correct"});
    }


    //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
