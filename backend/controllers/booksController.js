import mongoose from "mongoose";
import Book from "../models/bookModel.js";

// Create a new book
export const addBooks = async (req, res) => {
  try {
    const { title, author, ISBN, available } = req.body;

    if (!title || !author || !ISBN) {
      return res.status(400).json({
        success: false,
        error: "Title, author, and ISBN are required",
      });
    }
    const isbnPattern = /^(?:\d{10}|\d{13})$/;
    if (!isbnPattern.test(ISBN)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid ISBN format" });
    }
    const normalizedISBN = ISBN.trim().toUpperCase();
    const existingBook = await Book.findOne({ ISBN: normalizedISBN });
    if (existingBook) {
      return res
        .status(400)
        .json({ success: false, error: "Book with this ISBN already exists" });
    }

    const book = new Book({
      title,
      author,
      ISBN:normalizedISBN,
      available,
    });
    await book.save();

    res.status(201).json({
      success: true,
      msg: "Book added successfully",
      book,
    });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({
      success: false,
      error: "Server error, please try again later",
    });
  }
};

// Get all books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({
      success: false,
      error: "Server error, please try again later",
    });
  }
};

// Borrow a book (sets available to false)
export const borrowBook = async (req, res) => {
  try {
    const { isbn } = req.params;

    if (!isbn) {
      return res.status(400).json({ success: false, error: "ISBN is required" });
    }

    const normalizedISBN = isbn.trim().toUpperCase();
    const book = await Book.findOne({ ISBN: normalizedISBN });

    if (!book) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }

    if (!book.available) {
      return res.status(400).json({ success: false, error: "Book is already borrowed" });
    }

    book.available = false;
    await book.save();

    res.status(200).json({
      success: true,
      msg: "Book borrowed successfully",
      book,
    });
  } catch (error) {
    console.error("Error borrowing book:", error);
    res.status(500).json({ success: false, error: "Server error, please try again later" });
  }
};


// Return a book (sets available to true)
export const returnBook = async (req, res) => {
  try {
    const { isbn } = req.params;

    if (!isbn) {
      return res.status(400).json({ success: false, error: "ISBN is required" });
    }

    const normalizedISBN = isbn.trim().toUpperCase();
    const book = await Book.findOne({ ISBN: normalizedISBN });

    if (!book) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }

    if (book.available) {
      return res.status(400).json({ success: false, error: "Book is not borrowed" });
    }

    book.available = true;
    await book.save();

    res.status(200).json({
      success: true,
      msg: "Book returned successfully",
      book,
    });
  } catch (error) {
    console.error("Error returning book:", error);
    res.status(500).json({ success: false, error: "Server error, please try again later" });
  }
};
