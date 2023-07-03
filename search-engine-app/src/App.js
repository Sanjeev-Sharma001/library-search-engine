import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from 'react';
const API_URL = 'http://localhost:8000';

function App() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [keywords, setKeywords] = useState('');
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const response = await fetch(`${API_URL}/books`);
    const data = await response.json();
    setBooks(data);
  };

  const handleAddBook = async () => {
    const newBook = { title, author, keywords: keywords.split(',') };
    await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook)
    });
    setTitle('');
    setAuthor('');
    setKeywords('');
    fetchBooks(); // Refresh the book list after adding a new book
  };

  const handleDeleteBook = async (bookId) => {
    await fetch(`${API_URL}/books/${bookId}`, {
      method: 'DELETE'
    });
    fetchBooks(); // Refresh the book list after deleting a book
  };

  const handleUpdateBook = async () => {
    if (!selectedBook) return;

    const updatedBook = { title, author, keywords: keywords.split(',') };
    await fetch(`${API_URL}/books/${selectedBook.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedBook)
    });
    setTitle('');
    setAuthor('');
    setKeywords('');
    setSelectedBook(null);
    fetchBooks(); // Refresh the book list after updating a book
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setKeywords(book.keywords.join(', '));
  };

  const handleSearch = async () => {
    const response = await fetch(`${API_URL}/books?query=${query}`);
    const data = await response.json();
  
    // Filter the data based on the query
    const filteredBooks = data.filter((book) => {
      const lowercaseQuery = query.toLowerCase();
      return (
        book.title.toLowerCase().includes(lowercaseQuery) ||
        book.author.toLowerCase().includes(lowercaseQuery) ||
        book.keywords.some((keyword) => keyword.toLowerCase().includes(lowercaseQuery))
      );
    });
  
    setBooks(filteredBooks);
  };

  return (
    <div className="App">
      <h1>Library Search Engine</h1>
      <div>
        <h2>Add Book</h2>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Author:
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
        </label>
        <label>
          Keywords (comma-separated):
          <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
        </label>
        <button onClick={handleAddBook}>Add Book</button>
      </div>
      <div>
        <h2>Search Books</h2>
        <label>
          Query:
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        <h2>Search Results</h2>
        {books.map((book) => (
          <div key={book.id}>
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Keywords: {book.keywords.join(', ')}</p>
            <button onClick={() => handleSelectBook(book)}>Update</button>
            <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
          </div>
        ))}
      </div>
      {selectedBook && (
        <div>
          <h2>Update Book</h2>
          <label>
            Title:
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            Author:
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </label>
          <label>
            Keywords (comma-separated):
            <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
          </label>
          <button onClick={handleUpdateBook}>Update Book</button>
        </div>
      )}
    </div>
  );
}

export default App;
