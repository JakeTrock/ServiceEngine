import { v4 as uuidv4 } from 'uuid';
import csv from 'csv-parser';
import fs from 'fs';

let ticker=1;
let mlInput={};
let serviceInput={};

fs.createReadStream('in.csv')
  .pipe(csv())
  .on('data', (row) => {
    let id=uuidv4();
        mlInput[ticker.toString()]={
            "invocation":row.desc,
            "cmd":id
        };
        serviceInput[id]={
            "clientScript":row.clientComm,
            "backendCommand":row.servComm
        };
        ticker++;
  })
  .on('end', () => {
    console.log("(MLI)===================================");
    console.log(mlInput);
    console.log("(ServInp)===================================");
    console.log(serviceInput);
    process.exit();
  });
