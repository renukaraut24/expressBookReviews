const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// ************** 1️⃣ Check if username exists **************
const isValid = (username) => {
    let userExists = users.filter((user) => user.username === username);
    return userExists.length > 0;
};

// ************** 2️⃣ Check if username and password match **************
const authenticatedUser = (username, password) => {
    let validUser = users.filter((user) => {
        return user.username === username && user.password === password;
    });
    return validUser.length > 0;
};

// ************** 3️⃣ Login Route **************
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (authenticatedUser(username, password)) {
        // Generate JWT token
        let accessToken = jwt.sign({ data: username }, "access", { expiresIn: "1h" });

        // Save in session
        req.session.authorization = { accessToken, username };

        // Send success response with token
        return res.status(200).json({
            message: `User ${username} successfully logged in`,
            token: accessToken
        });
    } else {
        return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
});

// ************** 4️⃣ Add/Update a Review **************
// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    // Use review from request query or body
    const review = req.query.review || req.body.review;
    const username = req.session.authorization?.username;

    // 1️⃣ Check if user is logged in
    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }

    // 2️⃣ Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // 3️⃣ Validate review content
    if (!review) {
        return res.status(400).json({ message: "Review content cannot be empty" });
    }

    // 4️⃣ Add or update the review
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;

    // 1️⃣ Check if user is logged in
    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }

    // 2️⃣ Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // 3️⃣ Check if the user has a review for this book
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "No review found for this user" });
    }

    // 4️⃣ Delete the user's review
    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Review deleted successfully",
        reviews: books[isbn].reviews
    });
});

// ************** 5️⃣ Export Modules **************
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
