import React, { Component } from 'react'
import './App.css'

class App extends Component {
  constructor() {
    super()
    this.state = {tweets: []}
    this.getTweetText = this.getTweetText.bind(this)
    this.countRepeatitionsAndUnify = this.countRepeatitionsAndUnify.bind(this)
    this.createMatrix = this.createMatrix.bind(this)
    this.countFollowingWords = this.countFollowingWords.bind(this)
    this.selectNextWord = this.selectNextWord.bind(this)
    this.generateTweet = this.generateTweet.bind(this)
    this.uniqueWords = []
    this.recurrence = {}
    this.rawText = []
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
        //excludes the retweets from another user. api call
        //did not filter them out
        if(!tweet.retweeted_status) {
          tweetText.push(tweet.full_text)
        } 
      })
    }
    return tweetText
  }
  
  countRepeatitionsAndUnify(text) {
    let set = new Set()
    var punct = ['.', ',', '!', ':', ';', '?']
    text.forEach((tweet) => {
      let words = tweet.split(" ")
      words.forEach((word) => {
        if(punct.indexOf(word[word.length-1]) > -1) {
          var w = word.substring(0, word.length-1)
          var punc = word.substring(word.length-1, word.length)
          this.rawText.push(w)
          this.rawText.push(punc)
          set.add(w)
          set.add(punc)
        }
        else {
          this.rawText.push(word)
          set.add(word)
        }     
        this.recurrence[word] = (this.recurrence[word] + 1) || 1
      })
    })
    this.uniqueWords = Array.from(set) 
  }

  createMatrix(size) {
    var matrix = []
    for(var i = 0; i < size; i++) {
      matrix[i] = new Array(size).fill(0)
    }
    return matrix
  }

  countFollowingWords(mainWord) {
    var raw = this.rawText   
    var followingNum = {}
    for(var j = 0; j < raw.length; j++) {
      if(j < raw.length - 1) {
        if(raw[j] === mainWord) {
          followingNum[raw[j+1]] = ((followingNum[raw[j+1]] + 1) || 1)
        }
      }
    }
    return followingNum
  }

  fillTheMatrix(matrix) { 
    var uniqueW = this.uniqueWords
    for(var i = 0; i < uniqueW.length; i++) {
      var mainWord = uniqueW[i]
      var followingHash = this.countFollowingWords(mainWord)
    
      var sumFollowingWords = followingHash.length
      var keys = Object.keys(followingHash)
      keys.forEach((followingWord) => {
        var followingWordMatInd = uniqueW.indexOf(followingWord)
        var recurrenceFreq = followingHash[followingWord]
        matrix[i][followingWordMatInd] = recurrenceFreq / keys.length
      })
    }
    return matrix
  }

  selectNextWord(matrix, baseWord) {
    var firstWords = []
    var currentSum = 0
    var periodInd = this.uniqueWords.indexOf(baseWord) 
    var max = matrix[periodInd].reduce(function(a, b) {return a + b})
    var rand = Math.random() * max
    for(var i = 0; i < matrix.length; i++) {
      if(rand <= (matrix[periodInd][i] + currentSum)){
        return this.uniqueWords[i]
      } 
      currentSum = currentSum + matrix[periodInd][i]
    }
  }

  generateTweet(matrix, size){
    var res = []
    res.push(this.selectNextWord(matrix, '.'))
    for(var i = 0; i < size; i++) {
      res.push(this.selectNextWord(matrix, res[res.length-1]))
    }
    return res.join(" ")
  }

  render() {
    var text = this.getTweetText()
    var generatedTweet = ""
    this.countRepeatitionsAndUnify(text)
    var matrix = this.createMatrix(this.uniqueWords.length)
    var filledMat = this.fillTheMatrix(matrix)
    if(filledMat.length > 0) {
      generatedTweet = this.generateTweet(matrix, 100)
    }

    return (
      <div className="App"> 
        <h2>{generatedTweet}</h2>
      </div>
    );
  }
}

export default App;