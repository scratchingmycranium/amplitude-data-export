const prompt = require('prompt-sync')();
const fs = require('fs')
const pako = require('pako');
const { execSync } = require("child_process");
const unzipper = require('unzipper');
const etl = require('etl');

let apiKey = prompt('Enter Amplitude API Key: ');
let secretKey = prompt('Enter Amplitude Secret Key: ');
let startDate = prompt('Enter start date (YYYYMMDDTHH - eg 20220401T01) where time (THH) is optional: ');
let endDate = prompt('Enter end date (YYYYMMDDTHH - eg 20220401T23) where time (THH) is optional: ');

// gzipedData contains the 
async function readZipArchive(gzipedData, fileName) {
    let totalEvents = 0;
    if(gzipedData){
        try {
            const ungzipedData = pako.ungzip(gzipedData);
            var stringified = new TextDecoder().decode(ungzipedData)

            let result = stringified.split(/\r?\n/);
        
            result.forEach(element => {
                if(element != ''){
                    const jsonEventData = JSON.parse(element)
                    upload(jsonEventData)
                    totalEvents++;
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

execSync(`curl -u ${apiKey}:${secretKey} 'https://amplitude.com/api/2/export?start=${startDate}&end=${endDate}' > ./data.zip`, (err, stdout, stderr) => {
    if (err) {
     console.error(err);
     return;
    }
})

fs.createReadStream('./data.zip').on('error', err => {console.log(err)})
    .pipe(unzipper.Parse())
    .pipe(etl.map(async entry => {
            if (entry.path) {
                const content = await entry.buffer();
                readZipArchive(content, entry.path)
            } else {
                entry.autodrain();
            }
        })
    ).on('error', err => {console.log(err)});

function upload(data) {
    return
}