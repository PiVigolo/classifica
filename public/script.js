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
    const dati = await caricaClassifica();
    const container = document.getElementById('classifica');

    if (!container) return; 

    container.innerHTML = '';

    const ordinate = Object.entries(dati)
        .sort((a, b) => b[1] - a[1]);

    ordinate.forEach(([nome, punti], index) => {
        const div = document.createElement('div');
        div.className = 'card classifica-item';

        div.innerHTML = `
            <div>
                ${index + 1}. ${nome}
            </div>
            <div>
                ${punti}
            </div>
        `;

        container.appendChild(div);
    });
}

if (document.getElementById('classifica')) {
    setInterval(aggiornaPagina, 1000);
}