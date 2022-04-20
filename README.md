# amplitude-data-export

## Disclaimer
Please only use this script if it abides by the Amplitude terms of service or license agreement. If you are using this script in any way that violates the Amplitude terms of service or license agreement, you shall be solely responsible.
## Problem Statement
We want to be able to migrate our personal Amplitude data to another service or analytics engine. For advanced export functionality directly to other services, Amplitude requires users to be on a paid plan. On the free tier, Amplitude allows you to use your personal API key to manually export your data. We want to streamline the free Amplitude feature, and enable us to easily conduct a data migration from Amplitude to another service.

## How to use this script
1. Clone the repository to your machine.
2. Install all of the required packages `npm -i`
3. In the terminal, run `node main.js`
4. Follow the instructions

## What's happening?
Using your provided credentials and the date range, the script first fetches the data from Amplitude and saves it in the directory. The data Amplitude provides is a zip file containing a single folder. In that folder is a series of gzip files representing the event data. From what I can tell, each gzip file contains the event data for each hour within the range you requested. Once the event data is recieved, the script parses through the zip file to access the gzip files inside. With the gzip files, we extract the event data and parse it to JSON format. The structure of the event JSON data should be the same as specified in the Amplitude docs: https://developers.amplitude.com/docs/export-api

## What's next?
You need to write the logic for the upload() function to fit your specific needs. Perhaps in the future, we will add logic to allow you to choose from common providers.
