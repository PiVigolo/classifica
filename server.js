const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const DATA_FILE = 'dati.json';
const TXT_FILE = 'classifica.txt';

app.use(express.json());
app.use(express.static('public'));

// Legge dati
function leggiDati() {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

// Salva dati JSON + TXT
function salvaDati(dati) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(dati, null, 2));

    let testo = '';

    for (const squadra in dati) {
        testo += `${squadra}: ${dati[squadra]} bevande\n`;
    }

    fs.writeFileSync(TXT_FILE, testo);
}

// Restituisce classifica
app.get('/api/classifica', (req, res) => {
    const dati = leggiDati();
    res.json(dati);
});

// Aggiunge +1
app.post('/api/add', (req, res) => {
    const { squadra } = req.body;

    const dati = leggiDati();

    if (dati[squadra] !== undefined) {
        dati[squadra]++;
        salvaDati(dati);
    }

    res.json(dati);
});

app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});