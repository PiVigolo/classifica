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

    aggiornaPagina();
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

setInterval(aggiornaPagina, 1000);