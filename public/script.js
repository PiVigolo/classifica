async function caricaClassifica() {
    const response = await fetch('/api/classifica');
    const dati = await response.json();

    return dati;
}

async function aggiungiPunto(squadra) {
    await fetch('/api/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ squadra })
    });

    if (document.getElementById('classifica')) {
        aggiornaPagina();
    }
}
async function aggiungiCinque(squadra) {
    await fetch('/api/addfive', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ squadra })
    });

    if (document.getElementById('classifica')) {
        aggiornaPagina();
    }
}

async function togliPunto(squadra) {
    // 🚀 MODIFICATO: Ora punta a /api/remove (cambialo se il tuo backend usa un nome diverso, es. /api/sub)
    await fetch('/api/remove', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ squadra })
    });

    if (document.getElementById('classifica')) {
        aggiornaPagina();
    }
}
async function impostaPunti(squadra, valore) {
    await fetch('/api/set', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ squadra, valore }) // Spedisce squadra e il numero preciso
    });

    if (document.getElementById('classifica')) {
        aggiornaPagina();
    }
}
async function aggiornaPagina() {
    // Usiamo un try/catch per evitare che un errore blocchi tutto il resto
    try {
        const dati = await caricaClassifica();
        const container = document.getElementById('classifica');

        if (!container) return; 

        container.innerHTML = '';

        // Trasformiamo l'oggetto in array in modo compatibile con le vecchie TV
        const chiavi = Object.keys(dati);
        const ordinate = [];
        
        for (var i = 0; i < chiavi.length; i++) {
            var nomeSquadra = chiavi[i];
            var puntiSquadra = dati[nomeSquadra];
            ordinate.push({ nome: nomeSquadra, punti: puntiSquadra });
        }

        // Ordiniamo l'array dal punteggio più alto al più basso
        ordinate.sort(function(a, b) {
            return b.punti - a.punti;
        });

        // Creiamo le card usando un ciclo for classico (super compatibile)
        for (var j = 0; j < ordinate.length; j++) {
            var squadra = ordinate[j];
            var div = document.createElement('div');
            div.className = 'card classifica-item';

            // Usiamo il concatenamento classico invece dei backtick (`) se la TV fosse vecchissima
            div.innerHTML = '<div>' + (j + 1) + '. ' + squadra.nome + '</div>' +
                            '<div>' + squadra.punti + '</div>';

            container.appendChild(div);
        }
    } catch (errore) {
        // Se c'è ancora un errore, lo scrive a schermo così capiamo cosa non va
        console.error("Errore nel caricamento delle card: ", errore);
    }
}

if (document.getElementById('classifica')) {
    setInterval(aggiornaPagina, 1000);
}
