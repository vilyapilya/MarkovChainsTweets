import React, { Component } from 'react'
import './App.css'

class App extends Component {
  constructor() {
    super()
    this.state = {tweets: []}
    this.getTweetText = this.getTweetText.bind(this)
    this.countRepeatitionsAndUnify = this.countRepeatitionsAndUnify.bind(this)
    this.createMatrix = this.createMatrix.bind(this)
    this.uniqueWords = []
    this.recurrence = {}
  }
  
  componentDidMount() {
    fetch('/index')
      .then(res => res.json())
      .then(tweets => this.setState({tweets}))
  }

  getTweetText() {
    var tweetText = []
    if(this.state.tweets[0]) {    
      this.state.tweets.forEach((tweet) => {
        tweetText.push(tweet.full_text)
      })
    }
    return tweetText
  }
  
  countRepeatitionsAndUnify(text) {
    let set = new Set()
    text.forEach((tweet) => {
      let words = tweet.split(" ")
      words.forEach((word) => {
        set.add(word)
        this.recurrence[word] = (this.recurrence[word] + 1) || 1
      })
    })
    this.uniqueWords = Array.from(set) 
  }

  createMatrix(size) {
    var matrix = []
    for(var i = 0; i < size; i++) {
      matrix[i] = new Array(size)
    }
    return matrix
  }

  fillTheMatrix(matrix) {
    var size = this.uniqueWords.length
    for(var i = 0; i < size; i++) {
      for(var j = 0; j < sizel j++) {
        
      }
    }
  }

  render() {
    let text = this.getTweetText()
    this.countRepeatitionsAndUnify(text)
    let matrix = this.createMatrix(this.uniqueWords.length)
    this.fillTheMatrix(matrix)
    return (
      <div className="App"> 
        <h2>pp</h2>
      </div>
    );
  }
}

export default App;