const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs');

const updateDataBase = (didWin, incorrectGuesses, correctGuesses) => {
  const stringOfCorrectGuesses = Array.from(correctGuesses).join('');
  const data = [];
  const game = {
    didWin,
    numOfGuesses: incorrectGuesses.size + correctGuesses.size,
    correctLettersGuessed: stringOfCorrectGuesses
  };
  data.push(game);

  sendToDatabaseAndPrintData(data);
}

const sendToDatabaseAndPrintData = async(data) => {
  const csv = new ObjectsToCsv(data);

  await csv.toDisk('./database.csv', { append: true });

  //console.log(await csv.toString());

  const rawData = readCsvFile();
  const jsonData = convertCsvToJson(rawData, ',');
  console.log(calcRequiredData(jsonData));
}

const readCsvFile = () => {
  const data = fs.readFileSync('./database.csv', 'utf8');
  return data;
};

const convertCsvToJson = (data, delimiter) => {
  const headers = data.slice(0, data.indexOf('\n')).split(delimiter);
  const rowsWithoutHeader = data.slice(data.indexOf('\n') + 1).split('\n');
  if (rowsWithoutHeader[rowsWithoutHeader.length - 1] === '') {
    rowsWithoutHeader.pop();
  }

  const json = rowsWithoutHeader.map(row => {
    const values = row.split(delimiter);
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index];
      return obj;
    }, {});
  });

  return json;
};

const calcRequiredData = (jsonData) => {
  const results = {
    gamesWon: 0,
    gamesLost: 0,
    averageNumOfGuesses: 0,
    topThreeLetters: []
  };
  let totalNumOfGuesses = 0;
  let correctLettersGuessed = '';

  for (let i = 0; i < jsonData.length; i ++){
    if(jsonData[i].didWin === '1'){
      results.gamesWon += 1;
    } else {
      results.gamesLost += 1;
    }

    totalNumOfGuesses += Number(jsonData[i].numOfGuesses);
    correctLettersGuessed += jsonData[i].correctLettersGuessed;
  }

  results.averageNumOfGuesses = totalNumOfGuesses / jsonData.length;
  results.topThreeLetters = getTopThreeLetters(correctLettersGuessed);

  return results;
};

const getTopThreeLetters = (correctLettersGuessed) => {
  const mapOfChars = {};
  for (let i = 0; i < correctLettersGuessed.length; i++){
    const currChar = correctLettersGuessed[i];
    if(mapOfChars[currChar]){
      mapOfChars[currChar] += 1;
    } else {
      mapOfChars[currChar] = 1;
    }
  }

  var sortable = [];
  for (var char in mapOfChars) {
    sortable.push([char, mapOfChars[char]]);
  }

  sortable.sort((a, b) => b[1] - a[1]);

  const topThree = [];

  for (let i = 0; i < 3 && i < sortable.length; i++) {
    topThree.push(sortable[i][0]);
  }

  return topThree;
}

module.exports={
  updateDataBase,
}
