from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from typing import List

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize an empty list to store books
books = []

def get_book_by_id(book_id: str) -> dict:
    for book in books:
        if book["id"] == book_id:
            return book
    return None

@app.get("/books/{book_id}")
def get_book(book_id: str) -> dict:
    book = get_book_by_id(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@app.post("/books")
def add_book(book: dict) -> dict:
    book["id"] = str(len(books) + 1)
    books.append(book)
    return book

@app.put("/books/{book_id}")
def update_book(book_id: str, book: dict) -> dict:
    existing_book = get_book_by_id(book_id)
    if not existing_book:
        raise HTTPException(status_code=404, detail="Book not found")
    existing_book.update(book)
    return existing_book
@app.delete("/books/{book_id}")
def delete_book(book_id: str) -> dict:
    book = get_book_by_id(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    books.remove(book)
    return {"message": "Book deleted successfully"}



@app.get("/books")
def get_all_books() -> List[dict]:
    return books

@app.get("/books")
def search_books(query: str) -> List[dict]:
    query = query.lower()
    matched_books = []
    for book in books:
        if (
            query in book["title"].lower()
            or query in book["author"].lower()
            or query in [keyword.lower() for keyword in book["keywords"]]
        ):
            matched_books.append(book)
    return matched_books