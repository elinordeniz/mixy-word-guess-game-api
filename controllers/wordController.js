var randomWords = require("random-words");
var betterRandom = require("better-random-words");
var thesaurus = require("word-thesaurus");
const difficultyLevel = require("../config/difficulty");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, ServerError } = require("../errors");
const { checkForDuplicate } = require("./helperController");

const getMixyWord = async (req, res, next) => {
  try {
    let wordList = [];
    let originalWordsList = [];
    let { difficulty, amount } = req.query;

    if (difficulty && !(difficulty in difficultyLevel)) {
      return next(
        BadRequestError(
          "Difficulty Level Error! Enter -easy, -medium or -hard. Or remove it will assign medium default"
        )
      );
    }

    if (amount && (isNaN(parseInt(amount)) || amount >= 100)) {
      return next(
        BadRequestError(
          "Amount value Error, please enter a valid number up to 100 for the words displayed"
        )
      );
    }

    if (!difficulty || difficulty === "") {
      difficulty = "medium";
    }
    if (!amount || amount === "") {
      amount = 25;
    }

    for (let i = 0; i < parseInt(amount); i++) {
      console.log(i);
      //get random words in an array
      let extraLetters = await randomWords();
       console.log("extraLetters",extraLetters)
      extraLetters=extraLetters.slice(0,3);
      console.log("extraLetters ",extraLetters)
      //pick one word randomly
      let originalWord = await randomWords({
        exactly:1,
        maxLength: difficultyLevel[difficulty].lengthOfWords,
      });
       console.log('originalWord ',originalWord)
      if(originalWord[0].length!==difficultyLevel[difficulty].lengthOfWords){
        i = i - 1;
        continue;
      }
      //temprorary words list to determine duplicates in one level
      originalWordsList.push(originalWord);
      let mixedWordArray = originalWord
      .concat(extraLetters)
      .join("")
       .split("")
        .sort(() => 0.5 - Math.random());
 console.log("mixedWordArray", mixedWordArray)
     // get synonyms of the original word for hints
      let allSynonyms =  thesaurus.search(originalWord[0])[0];
      if (allSynonyms?.raw?.length === 0) {
        i = i - 1;
        continue;
      }
       console.log("allSynonyms",allSynonyms)
      //check if hint word consist of the  original word itself
      let hints = await allSynonyms?.raw?.filter((hint) => {
        if (!hint.includes(originalWord)) {
          return hint.toLowerCase();
        }
      });

      // //if the word has no available hints we dont push it and skip it
      if (hints?.length === 0) {
        i = i - 1;
        continue;
      }

      // //are hints and words unique
      const uniqueHints = checkForDuplicate(hints);
      const uniqueWords = checkForDuplicate(originalWordsList);

      if (uniqueHints.length === 0) {
        i = i - 1;
        continue;
      }

      // // if there is a duplicate words
      if (uniqueWords.length !== originalWordsList.length) {
        i = i - 1;
        originalWordsList.pop();
        continue;
      }

      // // Max 5 hints
      let hintList = uniqueHints?.slice(1, 6);
      let originalWordLength = originalWord[0].length;
      let mixedWordArrayLength=mixedWordArray.length;

      wordList.push({
        id: i + 1,
        originalWordLength,
        originalWord:originalWord[0],
        mixedWordArrayLength,
        mixedWordArray,
        hintList,
      });
    }

    res.status(StatusCodes.OK).json({ wordList });
  } catch (err) {
    wordList = [];
    originalWordsList = [];
    console.log(err);
    //ServerError(err)
  }
};

module.exports = getMixyWord;
