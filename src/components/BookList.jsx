import React from 'react'
import { Link } from 'react-router-dom'
import Book from './Book'
import * as BooksAPI from '../BooksAPI'

class BookList extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            currentlyReading: [],
            wantToRead: [],
            read: [],
            none: [],
        }
    }
    componentDidMount(){
        this.getBookList()
    }
    getBookList = () => {
        BooksAPI.getAll().then((books) => {
            this.setState({ currentlyReading: books.filter((book)=>book.shelf==='currentlyReading')})
            this.setState({ wantToRead: books.filter((book)=>book.shelf==='wantToRead')})
            this.setState({ read: books.filter((book)=>book.shelf==='read')})            
        })
    }
    updateBookShelf = (id, shelf) => {
        let books = this.state.currentlyReading.concat(this.state.wantToRead).concat(this.state.read)
        BooksAPI.update(books.find((b)=>b.id===id), shelf).then((updatedShelf) => {
            this.getBookList()
        })
    }
    render() {
        return (
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">正在阅读</h2>
                    <div className='bookshelf-books'>
                        <ol className='books-grid'>
                            {this.state.currentlyReading.map((book)=>(
                                <Book key={book.id} book={book} onUpdateShelf={this.updateBookShelf} />
                            ))}
                        </ol>
                    </div>
                  </div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">想要阅读</h2>
                    <div className='bookshelf-books'>
                        <ol className='books-grid'>
                            {this.state.wantToRead.map((book)=>(
                                <Book key={book.id} book={book} onUpdateShelf={this.updateBookShelf} />
                            ))}
                        </ol>
                    </div>
                  </div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">已阅读</h2>
                    <div className='bookshelf-books'>
                        <ol className='books-grid'>
                            {this.state.read.map((book)=>(
                                <Book key={book.id} book={book} onUpdateShelf={this.updateBookShelf} />
                            ))}
                        </ol>
                    </div>
                  </div>
                </div>
              </div>
              <div className="open-search">
                <Link to='/search'>Add a book</Link>
              </div>
            </div>
        )
    }
}

export default BookList