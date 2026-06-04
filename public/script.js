// 1. CARICA CLASSIFICA (Compatibile con vecchie TV - Usa XMLHttpRequest anziché Fetch)
function caricaClassifica() {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/classifica', true);
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    var dati = JSON.parse(xhr.responseText);
                    resolve(dati);
                } catch (e) {
                    reject("Errore dati JSON");
                }
            } else {
                reject("Errore server: " + xhr.status);
            }
        };
        xhr.onerror = function() {
            reject("Errore di rete");
        };
        xhr.send();
    });
}

// FUNZIONE GENERICA PER INVIARE I DATI AL SERVER (Sostituisce i Fetch POST)
function inviaDatiPost(url, payload) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            if (document.getElementById('classifica')) {
                aggiornaPagina();
            }
        }
    };
    xhr.send(JSON.stringify(payload));
}

// 2. AZIONI PULSANTI (Niente async/await, niente variabili contratte)
function aggiungiPunto(squadra) {
    inviaDatiPost('/api/add', { squadra: squadra });
}

function aggiungiCinque(squadra) {
    inviaDatiPost('/api/addfive', { squadra: squadra });
}

function togliPunto(squadra) {
    inviaDatiPost('/api/remove', { squadra: squadra });
}

function impostaPunti(squadra, valore) {
    inviaDatiPost('/api/set', { squadra: squadra, valore: valore });
}

// 3. AGGIORNA LA PAGINA (Sintassi ES5 ultra-compatibile)
function aggiornaPagina() {
    caricaClassifica().then(function(dati) {
        var container = document.getElementById('classifica');
        if (!container) return;

        container.innerHTML = '';

        var chiavi = Object.keys(dati);
        var ordinate = [];

        for (var i = 0; i < chiavi.length; i++) {
            var nomeSquadra = chiavi[i];
            var puntiSquadra = dati[nomeSquadra];
            ordinate.push({ nome: nomeSquadra, punti: puntiSquadra });
        }

        // Ordinamento decrescente
        ordinate.sort(function(a, b) {
            return b.punti - a.punti;
        });

        // Creazione elementi HTML (Card)
        for (var j = 0; j < ordinate.length; j++) {
            var squadra = ordinate[j];
            var div = document.createElement('div');
            div.className = 'card classifica-item';

            div.innerHTML = '<div>' + (j + 1) + '. ' + squadra.nome + '</div>' +
                            '<div>' + squadra.punti + '</div>';

            container.appendChild(div);
        }
    }).catch(function(errore) {
        // Se la TV fallisce la richiesta, ti scrive il motivo direttamente dentro il contenitore
        var container = document.getElementById('classifica');
        if (container && container.innerHTML === '') {
            container.innerHTML = '<div style="color: red; text-align: center; font-size: 20px; padding: 20px;">' + errore + '</div>';
        }
        console.error("Errore: ", errore);
    });
}

// 4. AVVIO DEL TIMER DI AGGIORNAMENTO
if (document.getElementById('classifica')) {
    // Esegue subito un primo avvio al caricamento
    aggiornaPagina();
    // Poi ripete ogni secondo
    setInterval(aggiornaPagina, 1000);
}
// Forza lo schermo intero al primo tocco sul tablet
function attivaSchermoIntero() {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Per vecchi browser Chrome/Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {    /* Per vecchi Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {     /* Per IE/Edge */
        elem.msRequestFullscreen();
    }
    
    // Rimuove l'evento dopo il primo tocco per evitare di rieseguirlo inutilmente
    document.removeEventListener('click', attivaSchermoIntero);
    document.removeEventListener('touchstart', attivaSchermoIntero);
}

// Ascolta sia il click del mouse che il tocco del dito (Touch)
document.addEventListener('click', attivaSchermoIntero);
document.addEventListener('touchstart', attivaSchermoIntero);
