const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // 1️⃣ Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // 2️⃣ Check if user already exists
    if (isValid(username)) {
        return res.status(400).json({ message: "User already exists. Please login." });
    }

    // 3️⃣ Save the new user
    users.push({ username: username, password: password });

    return res.status(200).json({ message: "User successfully registered. You can now login." });
});


// Get the book list available in the shop
// Get the book list available in the shop
public_users.get('/', function (req, res) {
    // Convert the books object to a pretty JSON string
    return res.status(200).send(JSON.stringify(books, null, 4));
});


// Get book details based on ISBN
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;  // Retrieve ISBN from URL parameters

    if (books[isbn]) {
        // Send book details as pretty JSON
        return res.status(200).send(JSON.stringify(books[isbn], null, 4));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

  
// Get book details based on author
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();  // Get author from URL

    let filteredBooks = {};

    // Get all ISBNs (keys) from the books object
    Object.keys(books).forEach((isbn) => {
        if (books[isbn].author.toLowerCase() === author) {
            filteredBooks[isbn] = books[isbn];
        }
    });

    if (Object.keys(filteredBooks).length > 0) {
        return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    } else {
        return res.status(404).json({ message: "No books found for this author" });
    }
});


// Get all books based on title
// Get book details based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();  // Get title from URL
    let filteredBooks = {};

    // Iterate through all books
    Object.keys(books).forEach((isbn) => {
        if (books[isbn].title.toLowerCase() === title) {
            filteredBooks[isbn] = books[isbn];
        }
    });

    if (Object.keys(filteredBooks).length > 0) {
        return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});


//  Get book review
// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;  // Get ISBN from URL

    if (books[isbn]) {
        // Return only the reviews of the book
        return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

const axios = require('axios'); // Add this at the top with other imports

// Task 10: Get list of books using async/await + Promise
public_users.get('/async-books', async (req, res) => {
    try {
        // Simulate async fetching with Promise
        const getBooks = () => {
            return new Promise((resolve, reject) => {
                if (books) {
                    resolve(books);
                } else {
                    reject("No books found");
                }
            });
        };

        const allBooks = await getBooks();  // Wait for Promise to resolve
        return res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        return res.status(500).json({ message: error });
    }
});

// Task 11: Get book details based on ISBN using async/await + Promise
public_users.get('/async-isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        // Simulate async fetching with Promise
        const getBookByISBN = (isbn) => {
            return new Promise((resolve, reject) => {
                if (books[isbn]) {
                    resolve(books[isbn]);
                } else {
                    reject("Book not found");
                }
            });
        };

        const book = await getBookByISBN(isbn);
        return res.status(200).send(JSON.stringify(book, null, 4));
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});


// Task 12: Get book details based on Author using async/await + Promise
public_users.get('/async-author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();

    try {
        // Simulate async fetching with Promise
        const getBooksByAuthor = (author) => {
            return new Promise((resolve, reject) => {
                let filteredBooks = {};
                Object.keys(books).forEach((isbn) => {
                    if (books[isbn].author.toLowerCase() === author) {
                        filteredBooks[isbn] = books[isbn];
                    }
                });

                if (Object.keys(filteredBooks).length > 0) {
                    resolve(filteredBooks);
                } else {
                    reject("No books found for this author");
                }
            });
        };

        const booksByAuthor = await getBooksByAuthor(author);
        return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// Task 13: Get book details based on Title using async/await + Promise
public_users.get('/async-title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();

    try {
        // Simulate async fetching with Promise
        const getBooksByTitle = (title) => {
            return new Promise((resolve, reject) => {
                let filteredBooks = {};
                Object.keys(books).forEach((isbn) => {
                    if (books[isbn].title.toLowerCase() === title) {
                        filteredBooks[isbn] = books[isbn];
                    }
                });

                if (Object.keys(filteredBooks).length > 0) {
                    resolve(filteredBooks);
                } else {
                    reject("No books found with this title");
                }
            });
        };

        const booksByTitle = await getBooksByTitle(title);
        return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

module.exports.general = public_users;
