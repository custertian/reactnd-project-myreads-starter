import React from 'react'
import { Link } from 'react-router-dom'
import Book from './Book'
import * as BooksAPI from '../BooksAPI'

class SearchBook extends React.Component {
    constructor(prop){
        super(prop)
        this.state = {
            query: '',
            results: [],
            myBooks: [],
        }
    }
    componentDidMount(){
        this.getBooks()
    }
    getBooks = () => {
        BooksAPI.getAll().then((myBooks)=>{
            this.setState({myBooks})
        })
    }
    updateQuery = (query) => {
        this.setState({ query })
        if(query === ''){
            this.setState({ results: [] })
        }
        this.search(query)
    }
    search = (query) => {
        if(query){
            BooksAPI.search(query).then((results)=>{
                if(results.length){
                    this.setState({ results: results })
                }else{
                    this.setState({ results: [] })                    
                }
            })
        }
    }
    updateBookShelf = (id, shelf) => {
        let newResults = this.state.results
        let book = newResults.find((b)=>b.id===id)
        book.shelf = shelf
        this.setState((state) => ({
            results: newResults
        }))
        BooksAPI.update(book, shelf)
        this.getBooks()
    }
    render() {
        this.state.results.map(result=>{
            result.shelf='none'
            this.state.myBooks.forEach(myBook => {
                if(result.id===myBook.id){
                    result.shelf = myBook.shelf
                }
            })
            return result
        })
        return (
            <div className='search-books'>
                <div className='search-books-bar'>
                    <Link className='close-search' to='/'>Close</Link>
                    <div className="search-books-input-wrapper">
                        <input type="text" placeholder="Search by title or author"
                            value={this.state.query}
                            onChange={event => { this.updateQuery(event.target.value) }} />
                    </div>
                </div>
                <div className="search-books-results">
                    <ol className="books-grid">
                        {this.state.results.map((book) => (
                            <Book key={book.id} book={book} onUpdateShelf={this.updateBookShelf} />
                        ))}
                    </ol>
                </div>
            </div>
        )
    }
}

export default SearchBook