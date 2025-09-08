import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  ISBN: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    uppercase: true,
    match: /^(?:\d{10}|\d{13})$/
  },
  available: {
    type: Boolean,
    default: true,
  },
});

const Book = mongoose.model("Book", bookSchema);
export default Book;
