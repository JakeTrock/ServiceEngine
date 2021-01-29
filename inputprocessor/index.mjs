import {
  v4 as uuidv4
} from 'uuid';
import csv from 'csv-parser';
import fs from 'fs';

let ticker = 1;
let queries = [];
let queryConnects = [];
let serviceInput = {};

fs.createReadStream('in.csv')
  .pipe(csv())
  .on('data', (row) => {
    let id = uuidv4();
    queries.push(row.desc);
    queryConnects.push(id);
    serviceInput[id] = {
      clientScript: row.clientComm,
      backendCommand: row.servComm
    };
    ticker++;
  })
  .on('end', () => {
    let mli = "export const queries: String[] =[\"" + queries.toString().replaceAll(",", "\",\"") + "\"];\nexport const queryConnects: String[] =[\"" + queryConnects.toString().replaceAll(",", "\",\"") + "\"];";
    fs.writeFile("searchMatch.ts", mli, 'utf8', function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("MLI was saved!");
    });

    let svi = JSON.stringify(serviceInput, null, 2);
    console.log(svi)
    svi = svi.replaceAll('"*<', "");
    svi = svi.replaceAll('>*"', "");
    console.log(svi)
    svi = "export const commandBase: Object =" + svi + ";";
    fs.writeFile("commandBase.ts", svi, 'utf8', function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("ServInp was saved!");
    });
  });