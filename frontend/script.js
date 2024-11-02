document.getElementById('bookForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;

    fetch('http://127.0.0.1:5000/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, author })
    })
    .then(response => response.json())
    .then(data => {
        addBookToList(data);
        document.getElementById('bookForm').reset();
        location.reload();
    });
});

document.getElementById('delbookForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const selectedBook = document.getElementById("bookSelect")
    const bookId = selectedBook.options[selectedBook.selectedIndex].textContent;

    if (bookId && confirm("Are you sure you want to delete this book?")) {
        fetch(`http://127.0.0.1:5000/books/${bookId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert("Book deleted successfully!");
                // Optionally, remove the book from the dropdown
                bookSelect.remove(bookSelect.selectedIndex);
                location.reload();
            } else {
                console.error('Failed to delete the book:', response.statusText);
                alert("Failed to delete the book.");
            }
        })
        .catch(err => {
            console.error('Error:', err);
            alert("An error occurred while deleting the book.");
        });
    } else {
        alert("Please select a book to delete.");
    }
});



document.addEventListener("DOMContentLoaded", () => {
    fetch('http://127.0.0.1:5000/books')
        .then(response => response.json())
        .then(books => {
            const bookSelect = document.getElementById('bookSelect');
            books.forEach(book => {
                const option = document.createElement('option');
                option.value = book.id; // The book's ID
                option.textContent = book.title; // The book's title
                bookSelect.appendChild(option);
            });
        })
        .catch(err => console.error('Error fetching books:', err));
});


function loadBooks() {
    fetch('http://127.0.0.1:5000/books')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(books => {
            // Check if books is an array
            if (Array.isArray(books)) {
                books.forEach(addBookToList);
            } else {
                console.error('Expected an array of books, but got:', books);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

function addBookToList(book) {
    const li = document.createElement('li');
    li.textContent = `${book.title} by ${book.author}`;
    document.getElementById('bookList').appendChild(li);
}



window.onload = loadBooks;
