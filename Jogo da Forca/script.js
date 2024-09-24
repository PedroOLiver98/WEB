let tamanhoMatriz = 20;
let qtdePalavras = 12;
let listaPalavras = [];
let matrizLetras = Array(tamanhoMatriz).fill().map(() => Array(tamanhoMatriz).fill(' '));
let lista = [];

function listaHTML(sentido) {
    switch (sentido) {
        case 1: return 'horizontal';
        case tamanhoMatriz: return 'vertical';
        case tamanhoMatriz - 1: return 'diagonal Esquerda';
        case tamanhoMatriz + 1: return 'diagonal Direita';
        default: throw new Error('sentido inválido');
    }
}

async function inserirPalavra() {
    const url = "https://api.dicionario-aberto.net/random";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        let json = await response.json();
        let palavra = (json.word.length < tamanhoMatriz) && json.word;
        if (!palavra) return null; // Se não há uma palavra válida, retorne null
        
        let inverso = Math.random() >= 0.5;
        let sentidos = [1, tamanhoMatriz, tamanhoMatriz - 1, tamanhoMatriz + 1];
        let sentido = sentidos[Math.floor(Math.random() * sentidos.length)];
        let inicio = posicaoInicial(palavra, sentido);
        let meuSentido = listaHTML(sentido);
        lista.push({ palavra, meuSentido, inicio });

        if (inverso) {
            palavra = palavra.split("").reverse().join("");
        }

        return { palavra, inverso, sentido, inicio };
    } catch (error) {
        console.error(error.message);
    }
}

function posicaoInicial(palavra, sentido) {
    const tamanhoPalavra = palavra.length;
    let inicio;
    do {
        inicio = Math.floor(Math.random() * (tamanhoMatriz * tamanhoMatriz));
    } while (!verificarEspaco(palavra, inicio, sentido));
    return inicio;
}

function verificarEspaco(palavra, inicio, sentido) {
    const tamanhoPalavra = palavra.length;
    let x = Math.floor(inicio / tamanhoMatriz);
    let y = inicio % tamanhoMatriz;
    for (let i = 0; i < tamanhoPalavra; i++) {
        if (sentido === 1) {  // horizontal
            if (y + i >= tamanhoMatriz || matrizLetras[x][y + i] !== ' ' && matrizLetras[x][y + i] !== palavra[i]) return false;
        } else if (sentido === tamanhoMatriz) { // vertical
            if (x + i >= tamanhoMatriz || matrizLetras[x + i][y] !== ' ' && matrizLetras[x + i][y] !== palavra[i]) return false;
        } else if (sentido === tamanhoMatriz - 1) { // diagonal Esquerda
            if (x + i >= tamanhoMatriz || y - i < 0 || matrizLetras[x + i][y - i] !== ' ' && matrizLetras[x + i][y - i] !== palavra[i]) return false;
        } else if (sentido === tamanhoMatriz + 1) { // diagonal Direita
            if (x + i >= tamanhoMatriz || y + i >= tamanhoMatriz || matrizLetras[x + i][y + i] !== ' ' && matrizLetras[x + i][y + i] !== palavra[i]) return false;
        }
    }
    return true;
}

async function bancoPalavras() {
    let i = 0;
    while (i < qtdePalavras) {
        let palavraData = await inserirPalavra();
        if (palavraData) {
            listaPalavras.push(palavraData);
            document.body.querySelector('ol').innerHTML += `<li>${palavraData.palavra}</li>`;
            i++;
        }
    }
    return listaPalavras;
}

async function tratarColisoes() {
    await bancoPalavras();
    for (let i = 0; i < listaPalavras.length; i++) {
        let { palavra, inverso, sentido, inicio } = listaPalavras[i];
        let x = Math.floor(inicio / tamanhoMatriz);
        let y = inicio % tamanhoMatriz;

        for (let j = 0; j < palavra.length; j++) {
            if (sentido === 1) { // horizontal
                matrizLetras[x][y + j] = palavra[j];
            } else if (sentido === tamanhoMatriz) { // vertical
                matrizLetras[x + j][y] = palavra[j];
            } else if (sentido === tamanhoMatriz - 1) { // diagonal Esquerda
                matrizLetras[x + j][y - j] = palavra[j];
            } else if (sentido === tamanhoMatriz + 1) { // diagonal Direita
                matrizLetras[x + j][y + j] = palavra[j];
            }
        }
    }
}

async function Main() {
    await tratarColisoes();
    try {
        const tblElement = document.createElement('table');
        for (let i = 0; i < tamanhoMatriz; i++) {
            const trElement = document.createElement('tr');
            for (let j = 0; j < tamanhoMatriz; j++) {
                const tdElement = document.createElement('td');
                tdElement.textContent = matrizLetras[i][j];
                trElement.appendChild(tdElement);
            }
            tblElement.appendChild(trElement);
        }
        document.body.appendChild(tblElement);
    } catch (error) {
        console.error(error.message);
    }
}

Main();
