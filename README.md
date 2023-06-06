# Description

- Welcome to Mixy Mixy Word Game Express Api
- This Api is for a word guess game in English. It produces random words in a requested amount and varios difficulty levels such as; "easy", "medium", "hard". In the query, "amount" and "difficulty" are optional parameters.
- Default values; amount: 25 and difficuly: medium if you do not pass any parameter in query
- "difficulty" accepts only "easy", "medium", "hard".
- "amount" accepts only integer between 1 and 100.

# Important Packages for words

- "word-thesaurus" for synonyms of a word
- "random-words" for random words

# Techs

- Serverless function for netlify
- Express
- Node.js
- serverless-http

# Routes

- Home /
- Api Doc /swagger
- Api Page /api/v1/word?difficulty=easy&amount=10

# RapidApi Link

- https://rapidapi.com/elinordeniz/api/mixy-word-guess-api

git add README.md
git commit -m "read me file updated"
git push -u origin main 