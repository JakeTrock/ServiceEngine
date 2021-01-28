import {
  v4 as uuidv4
} from 'uuid';
import csv from 'csv-parser';
import fs from 'fs';

let ticker = 1;
let mlInput = {};
let serviceInput = {};

fs.createReadStream('in.csv')
  .pipe(csv())
  .on('data', (row) => {
    let id = uuidv4();
    mlInput[ticker.toString()] = {
      "invocation": row.desc,
      "cmd": id
    };
    serviceInput[id] = {
      "clientScript": row.clientComm,
      "backendCommand": row.servComm
    };
    ticker++;
  })
  .on('end', () => {

    fs.writeFile("nl2bash-data.json", mlInput, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("MLI was saved!");
    });
    fs.writeFile("svcInput.json", serviceInput, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("ServInp was saved!");
    });
  });