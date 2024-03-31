import logo from './logo.svg';
import './App.css';

/*function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/

// App.js
import React, {useEffect, useState} from 'react';
import axios from 'axios';

const App = () => {
    const [books, setBooks]           = useState([]);
    const [newBook, setNewbook]       = useState('');
    const baseUrl                     = 'http://localhost:5000';
    const [showMsg, setShowMsg]       = useState(false);
    const [successMsg, setSuccessMsg] = useState('');


    const getBooks = () => {
        axios.get(baseUrl + '/books')
            .then((response) => {
                console.log(response.data);
                setBooks(response.data.data);
                setShowMsg(true);
                setSuccessMsg(response.data.message);
                hideMsg();
            })
            .catch((error) => {
                console.error('Error fetching books:', error);
            });
    };

    useEffect(() => {
        // Fetch books from backend API
        getBooks();
    }, []);

    const handleAddBook = () => {
        axios.post(baseUrl + '/books', {title: newBook})
            .then((response) => {
                // Clear the input field
                setNewbook('');
                // Fetch books again to update the list
                getBooks();
            })
            .catch((error) => {
                console.error('Error adding book:', error);
            });
    };

    // Hide message after 3 seconds
    const hideMsg = () => {
        setTimeout(() => {
            setShowMsg(false);
            setSuccessMsg('');
        }, 3000);
    };

    return (
        <div className='container'>

            <div className='row justify-content-center'>
                <div className='col-md-8'>
                    <div className="input-group mt-5">
                        <input
                            type="text"
                            className='form-control shadow-none'
                            value={newBook}
                            onChange={(e) => setNewbook(e.target.value)}
                        />
                        <button className="input-group-text btn btn-primary " onClick={handleAddBook}> + Add Book
                        </button>
                    </div>
                    <h3 className='mt-4'>Book List : </h3>
                    {showMsg ?
                        <div className="alert alert-success" role="alert">
                            {successMsg}
                        </div>
                        :
                        ''
                    }
                    <ul className="list-group">
                        {books.map((book) => (
                            <li className="list-group-item h5 text-primary" key={book.id}>{book.title}</li>
                        ))}
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default App;
