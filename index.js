const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { PORT, bspRates } = require('./utils/constants');

const app = express();

const getRatesTable = async () => {
    const { data } = await axios(bspRates);
    const $ = cheerio.load(data);
    const table = $('table', data)[0];

    const rows = [];
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
    const msg = fn(rows);

    return msg;
}

app.get('/', async (req, res) => {
    const jsonData = await getRatesTable();
    res.send(jsonData);
});

const fn = ([keys, ...values]) => values.map(vs => Object.fromEntries(vs.map((v, i) => [keys[i], v])));

const handleTable = () => {
    const table = getRatesTable().then((table) => {
        return table;
    });

}

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})

module.exports = app;