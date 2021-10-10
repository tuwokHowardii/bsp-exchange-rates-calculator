const express = require('express');
const Rates = require('./models/rates');
const { PORT } = require('./utils/constants');

const app = express();

app.get('/getRates', (req, res) => {
    Rates.getDataFromFile()
        .then((data) => res.status(200).json(data))
        .catch((err) => {
            res.status(404).json({ 
                message: "Rates not available. Please update rates before trying again." 
            });
        });
});

app.get('/getRate/:id', (req, res) => {
    const code = req.params.id.toUpperCase();
    Rates.getDataFromFile()
        .then((rates) => {
            const currency = rates.filter((rate) => rate.Code === code);
            if (currency[0]) {
                res.json(currency[0]);
            } else {
                res.status(404).json({ message: `Cannot find currency with code ${code}` })
            }
        }).catch((err) => {
            res.status(400).json({ message: "Rates not available. Please update rates before trying again." });
        });
});

app.post('/updateRates', (req, res) => {
    Rates.updateRatesData().then((update) => {
        res.status(update.status).json({ message: update.message })
    });
})

Rates.updatePeriodically();

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
});

module.exports = app;