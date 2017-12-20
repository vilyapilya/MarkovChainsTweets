import React, { Component } from 'react'
import './App.css'
import LRUCache from './LRUCache'

class App extends Component {
  constructor() {
    super()
    this.state = {tweets: [], error: "", username: ""}
    this.uniqueWords = []
    this.rawText = []
    this.cache = new LRUCache()
    this.matrixFromCache = null;

    this.getArrayOfTweets = this.getArrayOfTweets.bind(this)
    this.getArrayOfAllAndUniqueWords = this.getArrayOfAllAndUniqueWords.bind(this)
    this.createMatrix = this.createMatrix.bind(this)
    this.countFollowingWords = this.countFollowingWords.bind(this)
    this.selectNextWord = this.selectNextWord.bind(this)
    this.generateTweet = this.generateTweet.bind(this)
    this.fet = this.fet.bind(this)
    this.inputField = this.inputField.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.processTweets = this.processTweets.bind(this)
    this.selectFirstWord = this.selectFirstWord.bind(this)
    this.processPunctuation = this.processPunctuation.bind(this)
  }

  fet(username){
    fetch(`/v1/users/${username}`)
      .then(res => res.json())
      .then(tweets => {
        if(tweets.error) {
          this.setState({error: tweets.error})
          this.setState({tweets: []})
          this.setState({username: username});
        } else {
          this.setState({tweets})
          this.setState({error: ""})
          this.setState({username: username});
        }
      })
  }

  //filters out retweeted statuses
  getArrayOfTweets() {
    var tweetText = []
    if(this.state.tweets.length > 0) {
      this.state.tweets.forEach((tweet) => {
        //excludes the retweets from another user. api call
        //did not filter them out
        if(!tweet.retweeted_status) {
          tweetText.push(tweet.full_text)
        }
      })
    }
    console.log(this.state.tweets)
    console.log(tweetText)
    return tweetText
  }

  processPunctuation(word, set, lastChar) {
    var w = word.substring(0, word.length-1)
    if(w.length > 0) {
      this.rawText.push(w)
      set.add(w)
    }
    if(lastChar === '.'){
      this.rawText.push(lastChar)
      set.add(lastChar)
    }
  }

  //creates an array of unique words and array of all words.
  //treats a "." as a word and strips out other punctuation
  getArrayOfAllAndUniqueWords(arrayOfTweets) {
    let set = new Set()
    var punct = ['.',',', '!', ':', ';', '?']
    arrayOfTweets.forEach((tweet) => {
      let words = tweet.split(" ")
      words.forEach((word) => {
        if(word.length > 0) {
          //assumes that punctuation is at the end of a word and not
          //separated by a space.
          var lastChar = word[word.length-1]
          //checks is a word contains punctuation
          if(punct.indexOf(lastChar) > -1) {
            //this methods adds a word and its period if it exists
            //to the containers
            this.processPunctuation(word, set, lastChar)
          }
          else {
            this.rawText.push(word)
            set.add(word)
          }
        }
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

  //calculates how often a word follows another word.
  fillTheMatrix(matrix) {
    var uniqueW = this.uniqueWords
    for(var i = 0; i < uniqueW.length; i++) {
      var mainWord = uniqueW[i]
      var followingHash = this.countFollowingWords(mainWord)

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
<<<<<<< HEAD
    var periodInd = this.uniqueWords.indexOf(baseWord)
=======
    var periodInd = this.uniqueWords.indexOf(baseWord)

>>>>>>> 0359e53a5bd3f8ba048b36a855a78973f5bfb8c9
    var max = matrix[periodInd].reduce(function(a, b) {return a + b})
    var rand = Math.random() * max
    for(var i = 0; i < matrix.length; i++) {
      if(rand <= (matrix[periodInd][i] + currentSum)){
        return this.uniqueWords[i]
      }
      currentSum = currentSum + matrix[periodInd][i]
    }
  }

  selectFirstWord() {
    var firstWord = ""
    var arr = this.uniqueWords
    var count = 0
    while(firstWord.length <= 0 && count < arr.length) {
      var randW = arr[Math.floor(Math.random() * arr.length)]
      if(randW[0] == randW[0].toUpperCase()) {
        firstWord = randW
      }
      count++
    }
    return firstWord
  }

  //size is a number od words in the tweet
  generateTweet(matrix, size){
    var res = []
    //to make begining of a sentence look more realisitc:
    var firstWord = this.selectFirstWord()
    res.push(firstWord)
    for(var i = 0; i < size; i++) {
      res.push(this.selectNextWord(matrix, res[res.length-1]))
    }
    return res.join(" ")
  }

  handleSubmit(event) {
    event.preventDefault();
    var username = document.getElementById("input").value;
    var cachedKey = this.cache.getKey(username)
    if(cachedKey === null) {
      this.fet(username)
      this.matrixFromCache = null
    } else {
      this.setState({error: ""})
      this.matrixFromCache = cachedKey.matrix
    }
  }

  inputField() {
    return(
      <form id="inputForm">
        <label>
          Enter a screen_name (e.g. "Greenpeace")
          <br/>
            <input id="input" type="text" value={this.state.value} style={inputFieldStyle} />
        </label>
        <button onClick={this.handleSubmit} id="generate" style={generateButtonStyle}>generate</button>
      </form>
    );
  }

  processTweets() {
    var arrayOfTweets = this.getArrayOfTweets()
    if(arrayOfTweets.length <=0 ){
      this.setState({error: "did not write anything"})
      return []
    }
    this.getArrayOfAllAndUniqueWords(arrayOfTweets)
    var matrix = this.createMatrix(this.uniqueWords.length)
    var filledMat = this.fillTheMatrix(matrix)
    //once the matrix is generated for a new user, it gets cached
    this.cache.setKey(this.state.username, filledMat)
    return filledMat;
  }

  render() {
    var error = ""
    var genT = ""
    var mat;
    var generatedTweet = ""
    if(this.state.error) {
      error = (<h2>{this.state.error}</h2>)
    }
<<<<<<< HEAD

=======
>>>>>>> 0359e53a5bd3f8ba048b36a855a78973f5bfb8c9
    //it generates the tweet in case if the last user was retrieved from cache
    //but a user before was not found and this.state.tweets.length == 0
    if(this.matrixFromCache !== null) {
      generatedTweet = this.generateTweet(this.matrixFromCache, 50)
    }

    //if not from cache, then the state should contain tweets
    if(this.state.tweets.length > 0 && this.state.error.length <= 0) {
      mat = this.processTweets()
<<<<<<< HEAD
      generatedTweet = this.generateTweet(mat, 50)
=======
      if(mat.length > 0) {
        generatedTweet = this.generateTweet(mat, 50)
      }
>>>>>>> 0359e53a5bd3f8ba048b36a855a78973f5bfb8c9
    }

    if(error.length > 0) {
      generatedTweet = ""
    }

    return (
      <div className="App">
        <h2>{this.inputField()}</h2>
        <h2 style={tweetStyle}>{generatedTweet}</h2>
        {error}
      </div>
    );
  }
}

const inputFieldStyle = {
  height: '30px',
  width: '200px',
  margin: '15px',
  fontSize: '15px'
}

const generateButtonStyle = {
  height: '30px',
  width: '100px',
  margin: '15px',
  fontSize: '17px',
  borderRadius: '8px',
  backgroundColor: 'lightgray'
}

const tweetStyle = {
  fontSize: '25px',
  padding: '35px'
}

export default App;
