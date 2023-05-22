var randomWords = require("random-words");
var betterRandom = require("better-random-words");
var synonym = require("word-thesaurus");
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
      let randomWordsArray = await randomWords({
        exactly: difficultyLevel[difficulty].NumOfWords,
        minLength: difficultyLevel[difficulty].minLengthOfWords,
      });
      //pick one word randomly
      let originalWord = await randomWordsArray[
        Math.floor(Math.random() * randomWordsArray.length)
      ];
      console.log(originalWord);
      //temprorary words list to determine duplicates in one level
      originalWordsList.push(originalWord);
      let mixedWordArray = randomWordsArray
        .join("")
        .split("")
        .sort(() => 0.5 - Math.random());

      //get synonyms of the original word for hints
      let allSynonyms = await synonym.search(originalWord)[0];

      //check if hint word consist of the  original word itself
      let hints = await allSynonyms?.raw?.filter((hint) => {
        if (!hint.includes(originalWord)) {
          return hint;
        }
      });

      //if the word has no available hints we dont push it and skip it
      if (hints?.length === 0) {
        i = i - 1;
        continue;
      }

      //are hints and words unique
      const uniqueHints = checkForDuplicate(hints);
      const uniqueWords = checkForDuplicate(originalWordsList);

      // if there is a duplicate words
      if (uniqueWords.length !== originalWordsList.length) {
        i = i - 1;
        originalWordsList.pop();
        continue;
      }

      // Max 5 hints
      let hintMeaning = uniqueHints?.slice(1, 6);
      let originalWordLength = originalWord.length;

      wordList.push({
        id: i + 1,
        originalWordLength,
        originalWord,
        mixedWordArray,
        hintMeaning,
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
