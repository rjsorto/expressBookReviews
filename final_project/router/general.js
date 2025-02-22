const express = require('express');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();
let books = require('./booksdb.js');

public_users.post('/register', (req, res) => {
	//Write your code here
	const username = req.body.username;
	const password = req.body.password;

	if (!username && !password) return res.status(404).json({ message: 'Required parameters missing.' });

	if (isValid(username)) return res.status(404).json({ message: `User ${username} already exists!` });

	users.push({ username: username, password: password });
	return res.status(200).json({ message: `User ${username} successfully registered. Now you can login` });
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
	//Write your code here
	new Promise((resolve) => {
		resolve(books);
	}).then((obj) => {
		res.send(JSON.stringify(obj, null, 4));
	});
	// res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
	//Write your code here
	const isbn = req.params.isbn;
	if (!isbn) return res.status(300).json({ message: 'ISBN missing' });

	new Promise((resolve, reject) => {
		let book = books[isbn];
		if (book) {
			resolve(book);
		} else {
			reject('Book not found.');
		}
	}).then(
		(success) => {
			res.send(success);
		},
		(failure) => {
			return res.status(404).json({ message: failure });
		}
	);

	// let book = books[isbn];
	// if (!book) return res.status(300).json({ message: 'Book not found.' });
	// book = { isbn, ...book };
	// res.send(book);
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
	//Write your code here
	const author = req.params.author;
	if (!author) res.status(300).json({ message: 'Author name is missing' });

	const regexp = new RegExp(author, 'i');
	let filtered = {};

	new Promise((resolve, reject) => {
		for (const isbn in books) {
			if (regexp.test(books[isbn].author)) filtered[isbn] = books[isbn];
		}

		if (Object.keys(filtered).length) {
			resolve(filtered);
		} else {
			reject(`No books found for ${author}.`);
		}
	}).then(
		(success) => {
			res.send(success);
		},
		(failure) => {
			return res.status(404).json({ message: failure });
		}
	);

	// for (const isbn in books) {
	// 	if (regexp.test(books[isbn].author)) filtered[isbn] = books[isbn];
	// }
	// if (!Object.keys(filtered).length) res.status(300).json({ message: `No books found for ${author}.` });

	// res.send(filtered);
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
	//Write your code here
	const title = req.params.title;
	if (!title) res.status(300).json({ message: 'Title is missing' });

	const regexp = new RegExp(title, 'i');
	let filtered = {};

	new Promise((resolve, reject) => {
		for (const isbn in books) {
			if (regexp.test(books[isbn].title)) filtered[isbn] = books[isbn];
		}
		if (Object.keys(filtered).length) {
			resolve(filtered);
		} else {
			reject(`No books found for ${title}.`);
		}
	}).then(
		(success) => {
			res.send(success);
		},
		(failure) => {
			return res.status(404).json({ message: failure });
		}
	);

	// for (const isbn in books) {
	// 	if (regexp.test(books[isbn].title)) filtered[isbn] = books[isbn];
	// }
	// if (!Object.keys(filtered).length) res.status(300).json({ message: `No books found for ${title}.` });

	// res.send(filtered);
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
	//Write your code here
	//Write your code here
	const isbn = req.params.isbn;
	if (!isbn) return res.status(300).json({ message: 'ISBN missing' });

	let book = books[isbn];
	if (!book) return res.status(300).json({ message: 'Book not found.' });
	res.send(book.reviews);
});

module.exports.general = public_users;
