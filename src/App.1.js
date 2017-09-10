import React from 'react'
// import * as BooksAPI from './BooksAPI'
import { BrowserRouter, Route } from 'react-router-dom'
import BookList from './components/BookList'
import SearchBooks from './components/SearchBook'
import './App.css'

class BooksApp extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <Route path='/search' render={() => (<SearchBooks />)} />
          <Route exact path='/' render={() => (<BookList />)} />
        </div>
      </BrowserRouter>
    )
  }
}

export default BooksApp
