import express from "express";

import { addBooks, borrowBook, getBooks, returnBook } from "../controllers/booksController.js";

const router = express.Router();
// Add a new book
router.post("/addbooks", addBooks);

// Get all books
router.get("/getbooks",getBooks)

// Borrow a book by ISBN
router.post("/borrow/:isbn", borrowBook);

// Return a book by ISBN
router.post("/return/:isbn", returnBook);

export default router;
