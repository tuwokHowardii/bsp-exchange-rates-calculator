const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const { bspRatesURL, jsonDBFile } = require('../utils/constants')
const { arrayToJson, msToNextTime } = require('../utils/utils')

/**
 * Scrapes the BSP Web Page to get exchange rate data
 * @returns {Promise} rates
 */
async function getRatesFromBSP() {
    const rows = [];

    try {
        const { data } = await axios(bspRatesURL);
        const $ = cheerio.load(data);
        const table = $('table', data)[0];

        $('thead tr', table).each(function () {
            const head = [];
            $(this).find('th').each(function () {
                const th = $(this).text();
                head.push(th);
            })
            if (head.length > 3) rows.push(head);
        });

        $('tbody tr', table).each(function () {
            const row = [];
            $(this).find('td').each(function () {
                const td = $(this).text();
                row.push(td);
            })
            rows.push(row);
        });
    } catch (err) {
        throw err;
    }

    const rates = arrayToJson(rows);

    return rates;
}

/**
 * Retrieves data from jsonDBFile
 * @returns {Promise} rates
 */
async function getDataFromFile() {
    var rates = []
    try {
        const content = fs.readFileSync(jsonDBFile, {
            encoding: 'utf8'
        });
        rates = JSON.parse(content);

    } catch (err) {
        throw err;
    }

    return rates;
}
/**
 * @description Writes json content to jsonDBFile
 * @param {Array.<JSON>} content data to be written
 */
function writeDataToFile(content) {
    fs.writeFileSync(jsonDBFile, JSON.stringify(content), 'utf8', (err) => {
        if (err) {
            console.log(err);
        }
    })
}

/**
 * @description Updates rates data
 * @return {JSON}
 */
async function updateRatesData() {
    const update = {
        status : 200,
        message : ""
    }

    try {
        await getRatesFromBSP(bspRatesURL).then((rates) => {
            writeDataToFile(rates);
            update.message = "Successfuly updated rates."
        }).catch((err) =>{
            update.status = 404;
            update.message = "BSP resources not found!"
        });
    } catch (err) {
        update.status = 400;
        update.message = "Failed to update rates!"
    }

    return update;
}

/**
 * @description Update rates data every 9AM
 */
function updatePeriodically() {
    const nextUpdate = msToNextTime();

    setTimeout(function () {
        try {
            getRatesFromBSP().then(rates => writeDataToFile(rates));

            const now = new Date();
            const date = now.toLocaleDateString();
            const time = now.toLocaleTimeString();
            console.log(`Successfuly Updated ${jsonDBFile} at: `, { date, time });
        } catch (err) {
            console.log(err);
        }

        updatePeriodically();
    }, nextUpdate);
}



module.exports = {
    getRatesFromBSP,
    getDataFromFile,
    updatePeriodically,
    updateRatesData,
}