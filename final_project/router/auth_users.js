const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();
let books = require('./booksdb.js');

let users = [];

const isValid = (username) => users.some((user) => user.username === username);

const authenticatedUser = (username, password) => {
	//returns boolean
	//write code to check if username and password match the one we have in records.
	return users.some((user) => user.username === username && user.password === password);
};

//only registered users can login
regd_users.post('/login', (req, res) => {
	//Write your code here
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) return res.status(404).json({ message: 'Error logging in' });

	if (!authenticatedUser(username, password)) return res.status(208).json({ message: 'Invalid Login. Check username and password' });
	// Generate JWT access token
	let accessToken = jwt.sign(
		{
			data: password,
		},
		'access',
		{ expiresIn: '1h' }
	);

	req.session.authorization = {
		accessToken,
		username,
	};

	return res.status(200).json({ message: 'User successfully logged in' });
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
	//Write your code here
	const isbn = req.params.isbn;
	const username = req.session.authorization.username;
	const review = req.body.review;

	if (!isbn) return res.status(300).json({ message: 'ISBN missing.' });

	if (!books[isbn]) return res.status(300).json({ message: 'Book not found.' });

	books[isbn].reviews[username] = review ?? 1;
	return res.status(200).json({ message: `Review added to book "${books[isbn].title}".` });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
	const isbn = req.params.isbn;
	const username = req.session.authorization.username;

	if (!isbn) return res.status(300).json({ message: 'ISBN missing.' });

	if (!books[isbn]) return res.status(300).json({ message: 'Book not found.' });

	delete books[isbn].reviews[username];
	return res.status(200).json({ message: `Review removed from book "${books[isbn].title}".` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
