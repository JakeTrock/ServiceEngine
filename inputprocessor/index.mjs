import { v4 as uuidv4 } from 'uuid';
let ticker=1;
let mlInput={};
let serviceInput={};
var standard_input = process.stdin;

// Set input character encoding.
standard_input.setEncoding('utf-8');

// Prompt user to input data in console.
console.log("enter query");

// When user input data and click enter key.
standard_input.on('data', function (data) {

    // User input exit.
    if(data === 'exit\n'){
        // Program exit.
        console.log(mlInput);
        console.log(serviceInput);
        process.exit();
    }else
    {
        let id=uuidv4();
        mlInput[ticker.toString()]={
            "invocation":data.split(",")[0],
            "cmd":id
        };
        serviceInput[id]={
            "clientScript":data.split(",")[1],
            "backendCommand":data.split(",")[2]
        };
        ticker++;
    }
});
