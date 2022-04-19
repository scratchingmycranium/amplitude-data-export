const prompt = require('prompt-sync')();
const fs = require('fs')
const pako = require('pako');
const { execSync } = require("child_process");
const unzipper = require('unzipper');
const etl = require('etl');

// user prompts
let apiKey = prompt('Enter Amplitude API Key: ');
let secretKey = prompt('Enter Amplitude Secret Key: ');
let startDate = prompt('Enter start date (YYYYMMDDTHH - eg 20220401T01) where time (THH) is optional: ');
let endDate = prompt('Enter end date (YYYYMMDDTHH - eg 20220401T23) where time (THH) is optional: ');

// gzipedData is a Uint8Array containing the gziped data
// upload(jsonEventData) is incomplete and you need to implement it based on where you want your data to be uploaded
async function readZipArchive(gzipedData, fileName) {
    let totalEvents = 0;
    if(gzipedData){
        try {
            const ungzipedData = pako.ungzip(gzipedData);
            var stringified = new TextDecoder().decode(ungzipedData)

            // the raw data contains multiple json objects that are not comma delimited. 
            // They are separated by a new line character and therefore we split the string 
            // by the new line character.
            let result = stringified.split(/\r?\n/);
        
            result.forEach(element => {
                if(element != ''){
                    const jsonEventData = JSON.parse(element)
                    totalEvents++;
                    
                    // implement your own logic to upload the data
                    upload(jsonEventData)   
                }
            });
            console.log(fileName)
            console.log(`Total events: ${totalEvents}`)
        } catch (e) {
            console.log(fileName)
            console.log(`Something went wrong. ${e}`);
        }
    }
}

// Get the Amplitude data from their API. data.zip contains a single folder with an apparently random name (set by Amplitude). 
// The folder contains multiple files that are gziped.
execSync(`curl -u ${apiKey}:${secretKey} 'https://amplitude.com/api/2/export?start=${startDate}&end=${endDate}' > ./data.zip`, (err, stdout, stderr) => {
    if (err) {
     console.error(err);
     return;
    }
})

// Once the data is downloaded, we parse through the higher level zip folder to read the gzipped files one by one.
fs.createReadStream('./data.zip').on('error', err => {console.log(err)})
    .pipe(unzipper.Parse())
    .pipe(etl.map(async entry => {
            if (entry.path) {
                const content = await entry.buffer();
                // for each gziped file, we call the readZipArchive function to analyze the event data.
                readZipArchive(content, entry.path)
            } else {
                entry.autodrain();
            }
        })
    ).on('error', err => {console.log(err)});

// implement your own logic to upload the data
function upload(data) {
    return
}