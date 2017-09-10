# 项目要求
## MyReads: A Book Lending App

1. 把代码组件化,观察代码发现这个是重复的

```
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      <li>
                        <div className="book">
                          <div className="book-top">
                            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: 'url("http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api")' }}></div>
                            <div className="book-shelf-changer">
                              <select>
                                <option value="none" disabled>Move to...</option>
                                <option value="currentlyReading">Currently Reading</option>
                                <option value="wantToRead">Want to Read</option>
                                <option value="read">Read</option>
                                <option value="none">None</option>
                              </select>
                            </div>
                          </div>
                          <div className="book-title">To Kill a Mockingbird</div>
                          <div className="book-authors">Harper Lee</div>
                        </div>
                      </li>
                      <li>
                        <div className="book">
                          <div className="book-top">
                            <div className="book-cover" style={{ width: 128, height: 188, backgroundImage: 'url("http://books.google.com/books/content?id=yDtCuFHXbAYC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72RRiTR6U5OUg3IY_LpHTL2NztVWAuZYNFE8dUuC0VlYabeyegLzpAnDPeWxE6RHi0C2ehrR9Gv20LH2dtjpbcUcs8YnH5VCCAH0Y2ICaKOTvrZTCObQbsfp4UbDqQyGISCZfGN&source=gbs_api")' }}></div>
                            <div className="book-shelf-changer">
                              <select>
                                <option value="none" disabled>Move to...</option>
                                <option value="currentlyReading">Currently Reading</option>
                                <option value="wantToRead">Want to Read</option>
                                <option value="read">Read</option>
                                <option value="none">None</option>
                              </select>
                            </div>
                          </div>
                          <div className="book-title">Ender's Game</div>
                          <div className="book-authors">Orson Scott Card</div>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>Ï
```
分成两个单个的组件 - Book.jsx 展示一个本书的书名、作者、封面图、当前类别

```
# Files: /src/components/Book.jsx

import React from 'react'
import PropTypes from 'prop-types'

class Book extends React.Component {
    render() {
        const { onUpdateShelf } = this.props

        return (
            <div className="book">
                <div className="book-top">
                    <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${this.props.book.imageLinks.smallThumbnail})` }}></div>
                    <div className="book-shelf-changer">
                        <select value={this.props.book.shelf} onChange={(e)=>onUpdateShelf(this.props.book.id,e.target.value)}>
                            <option value="none" disabled>Move to...</option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                </div>
                <div className="book-title">{this.props.book.title}</div>
                <div className="book-authors">{this.props.book.authors}</div>
            </div>
        )
    }
}

Book.propTypes = {
    onUpdateShelf: PropTypes.func.isRequired,
}

export default Book
```

把书籍用列表项展示出来 - BookList.jsx

```
# Files: /src/components/BookList.jsx

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
```
发现上面的代码 bookshelf 部分是重复的，正在阅读，已阅读和想要阅读部分

然后书写 查询的组件代码 searchbook.jsx

```
# File: /src/components/SearchBook.jsx

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
```
发现上面代码中更新onUpdateShelf是和BookList中是重复的，应该把它们提取出来



# MyReads Project

This is the starter template for the final assessment project for Udacity's React Fundamentals course. The goal of this template is to save you time by providing a static example of the CSS and HTML markup that may be used, but without any of the React code that is needed to complete the project. If you choose to start with this template, your job will be to add interactivity to the app by refactoring the static code in this template.

Of course, you are free to start this project from scratch if you wish! Just be sure to use [Create React App](https://github.com/facebookincubator/create-react-app) to bootstrap the project.

## TL;DR

To get started developing right away:

* install all project dependencies with `npm install`
* start the development server with `npm start`

## What You're Getting
```bash
├── CONTRIBUTING.md
├── README.md - This file.
├── SEARCH_TERMS.md # The whitelisted short collection of available search terms for you to use with your app.
├── package.json # npm package manager file. It's unlikely that you'll need to modify this.
├── public
│   ├── favicon.ico # React Icon, You may change if you wish.
│   └── index.html # DO NOT MODIFY
└── src
    ├── App.css # Styles for your app. Feel free to customize this as you desire.
    ├── App.js # This is the root of your app. Contains static HTML right now.
    ├── App.test.js # Used for testing. Provided with Create React App. Testing is encouraged, but not required.
    ├── BooksAPI.js # A JavaScript API for the provided Udacity backend. Instructions for the methods are below.
    ├── icons # Helpful images for your app. Use at your discretion.
    │   ├── add.svg
    │   ├── arrow-back.svg
    │   └── arrow-drop-down.svg
    ├── index.css # Global styles. You probably won't need to change anything here.
    └── index.js # You should not need to modify this file. It is used for DOM rendering only.
```

Remember that good React design practice is to create new JS files for each component and use import/require statements to include them where they are needed.

## Backend Server

To simplify your development process, we've provided a backend server for you to develop against. The provided file [`BooksAPI.js`](src/BooksAPI.js) contains the methods you will need to perform necessary operations on the backend:

* [`getAll`](#getall)
* [`update`](#update)
* [`search`](#search)

### `getAll`

Method Signature:

```js
getAll()
```

* Returns a Promise which resolves to a JSON object containing a collection of book objects.
* This collection represents the books currently in the bookshelves in your app.

### `update`

Method Signature:

```js
update(book, shelf)
```

* book: `<Object>` containing at minimum an `id` attribute
* shelf: `<String>` contains one of ["wantToRead", "currentlyReading", "read"]  
* Returns a Promise which resolves to a JSON object containing the response data of the POST request

### `search`

Method Signature:

```js
search(query, maxResults)
```

* query: `<String>`
* maxResults: `<Integer>` Due to the nature of the backend server, search results are capped at 20, even if this is set higher.
* Returns a Promise which resolves to a JSON object containing a collection of book objects.
* These books do not know which shelf they are on. They are raw results only. You'll need to make sure that books have the correct state while on the search page.

## Important
The backend API uses a fixed set of cached search results and is limited to a particular set of search terms, which can be found in [SEARCH_TERMS.md](SEARCH_TERMS.md). That list of terms are the _only_ terms that will work with the backend, so don't be surprised if your searches for Basket Weaving or Bubble Wrap don't come back with any results.

## Create React App

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find more information on how to perform common tasks [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Contributing

This repository is the starter code for _all_ Udacity students. Therefore, we most likely will not accept pull requests.

For details, check out [CONTRIBUTING.md](CONTRIBUTING.md).
