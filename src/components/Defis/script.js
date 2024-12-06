const jeux = ['pierre-feuille-ciseaux', 'morpion'];
let currentInput = null;
let currentCharIndex = 0;

function afficherModalJeu(input, charIndex) {
    const modal = document.getElementById('gameModal');
    const gameContent = document.getElementById('gameContent');
    modal.style.display = 'flex';

    currentInput = input;
    currentCharIndex = charIndex;

    desactiverChamp(input);

    const jeu = jeux[Math.floor(Math.random() * jeux.length)];

    if (jeu === 'pierre-feuille-ciseaux') {
        genererPFC(input, charIndex, gameContent);
    } else if (jeu === 'morpion') {
        genererMorpion(input, charIndex, gameContent);
    }
}

function genererPFC(input, charIndex, gameContent) {
    gameContent.innerHTML = `
        <h2>Pierre-Feuille-Ciseaux</h2>
        <p>Battez l'ordinateur pour valider le caractère !</p>
        <div class="game-buttons">
            <button onclick="jouerPFC('pierre', '${input.id}', ${charIndex})">Pierre</button>
            <button onclick="jouerPFC('feuille', '${input.id}', ${charIndex})">Feuille</button>
            <button onclick="jouerPFC('ciseaux', '${input.id}', ${charIndex})">Ciseaux</button>
        </div>
    `;
}

function jouerPFC(choixJoueur, inputId, charIndex) {
    const choixOrdi = ['pierre', 'feuille', 'ciseaux'][Math.floor(Math.random() * 3)];
    let resultat = '';

    if (choixJoueur === choixOrdi) {
        resultat = 'Égalité ! Réessayez.';
    } else if (
        (choixJoueur === 'pierre' && choixOrdi === 'ciseaux') ||
        (choixJoueur === 'feuille' && choixOrdi === 'pierre') ||
        (choixJoueur === 'ciseaux' && choixOrdi === 'feuille')
    ) {
        resultat = 'Vous avez gagné !';
    } else {
        resultat = 'Vous avez perdu ! Réessayez.';
    }

    if (resultat.includes('Vous avez gagné')) {
        validerCaractere(inputId);
    } else {
        document.getElementById('gameContent').innerHTML = `
            <h2>${resultat}</h2>
            <p>Votre choix : ${choixJoueur}</p>
            <p>Choix de l'ordinateur : ${choixOrdi}</p>
            <div class="game-buttons">
                <button onclick="genererPFC(
                    document.getElementById('${inputId}'), 
                    ${charIndex}, 
                    document.getElementById('gameContent')
                )">Rejouer</button>
                <button onclick="annulerCaractere()">Annuler</button>
            </div>
        `;
    }
}

function genererMorpion(input, charIndex, gameContent) {
    gameContent.innerHTML = `
        <h2>Morpion</h2>
        <p>Battez l'ordinateur pour valider le caractère !</p>
        <div id="morpionGrid">
            ${[...Array(9)].map((_, i) => `
                <div class="morpion-cell" data-index="${i}" onclick="jouerMorpion(${i}, '${input.id}', ${charIndex})"></div>
            `).join('')}
        </div>
    `;
}

function jouerMorpion(cellIndex, inputId, charIndex) {
    const grid = document.getElementById('morpionGrid');
    const cell = grid.querySelector(`[data-index="${cellIndex}"]`);

    if (cell.textContent === '') {
        cell.textContent = 'X';

        if (verifierVictoire(grid, 'X')) {
            validerCaractere(inputId);
            return;
        }

        const cellulesVides = [...grid.children].filter(c => c.textContent === '');
        if (cellulesVides.length > 0) {
            const ordiMove = trouverMeilleurCoup(grid, 'O', 'X');


            if (ordiMove !== null) {
                const ordiCell = grid.querySelector(`[data-index="${ordiMove}"]`);
                ordiCell.textContent = 'O';
            }

            if (verifierVictoire(grid, 'O')) {
                document.getElementById('gameContent').innerHTML = `
                    <h2>Vous avez perdu ! Rejouez ou annulez.</h2>
                    <div class="game-buttons">
                        <button onclick="genererMorpion(
                            document.getElementById('${inputId}'), 
                            ${charIndex}, 
                            document.getElementById('gameContent')
                        )">Rejouer</button>
                        <button onclick="annulerCaractere()">Annuler</button>
                    </div>
                `;
                return;
            }
        }
        if (cellulesVides.length === 0 && !verifierVictoire(grid, 'X') && !verifierVictoire(grid, 'O')) {
            document.getElementById('gameContent').innerHTML = `
                <h2>Égalité ! Rejouez ou annulez.</h2>
                <div class="game-buttons">
                    <button onclick="genererMorpion(
                        document.getElementById('${inputId}'), 
                        ${charIndex}, 
                        document.getElementById('gameContent')
                    )">Rejouer</button>
                    <button onclick="annulerCaractere()">Annuler</button>
                </div>
            `;
        }
    }
}

function verifierVictoire(grid, symbole) {
    const combinaisons = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    return combinaisons.some(combo =>
        combo.every(index => grid.children[index].textContent === symbole)
    );
}

function trouverMeilleurCoup(grid, joueur, adversaire) {
    const cellules = [...grid.children];
    const combinaisons = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combo of combinaisons) {
        const [a, b, c] = combo;
        if (cellules[a].textContent === joueur && cellules[b].textContent === joueur && cellules[c].textContent === '') {
            return c;
        }
        if (cellules[a].textContent === joueur && cellules[c].textContent === joueur && cellules[b].textContent === '') {
            return b;
        }
        if (cellules[b].textContent === joueur && cellules[c].textContent === joueur && cellules[a].textContent === '') {
            return a;
        }
    }

    for (const combo of combinaisons) {
        const [a, b, c] = combo;
        if (cellules[a].textContent === adversaire && cellules[b].textContent === adversaire && cellules[c].textContent === '') {
            return c;
        }
        if (cellules[a].textContent === adversaire && cellules[c].textContent === adversaire && cellules[b].textContent === '') {
            return b;
        }
        if (cellules[b].textContent === adversaire && cellules[c].textContent === adversaire && cellules[a].textContent === '') {
            return a;
        }
    }

    const cellulesVides = cellules.map((cell, index) => cell.textContent === '' ? index : null).filter(index => index !== null);
    return cellulesVides.length > 0 ? cellulesVides[Math.floor(Math.random() * cellulesVides.length)] : null;
}

function afficherDemineur(input, charIndex, gridSize) {
    const modal = document.getElementById('gameModal');
    const gameContent = document.getElementById('gameContent');
    modal.style.display = 'flex';

    currentInput = input;
    currentCharIndex = charIndex;

    desactiverChamp(input);

    genererDemineur(gridSize, gameContent);
}

function genererDemineur(gridSize, gameContent) {
    const totalCells = gridSize * gridSize;
    const bombCount = Math.floor(totalCells / 8);
    const bombs = new Set();

    while (bombs.size < bombCount) {
        bombs.add(Math.floor(Math.random() * totalCells));
    }
    const grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));

    [...bombs].forEach((bombIndex) => {
        const row = Math.floor(bombIndex / gridSize);
        const col = bombIndex % gridSize;
        grid[row][col] = -1;

        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = row + dr;
                const nc = col + dc;
                if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize && grid[nr][nc] !== -1) {
                    grid[nr][nc]++;
                }
            }
        }
    });

    gameContent.innerHTML = `
        <h2>Démineur (${gridSize}x${gridSize})</h2>
        <p>Dévoilez toutes les cases sans toucher de bombe !</p>
        <div id="demineurGrid" style="display: grid; grid-template-columns: repeat(${gridSize}, 1fr); gap: 5px; margin: 20px auto; width: ${gridSize * 40}px;">
            ${[...Array(totalCells)].map((_, i) => {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        return `
                    <div class="demineur-cell" data-row="${row}" data-col="${col}" onclick="jouerDemineur(${row}, ${col}, ${gridSize}, ${JSON.stringify(grid)})" oncontextmenu="marquerCase(event, ${row}, ${col})"></div>
                `;
    }).join('')}
        </div>
        <button onclick="annulerCaractere()">Annuler</button>
    `;
}

function jouerDemineur(row, col, gridSize, grid) {
    const demineurGrid = document.getElementById('demineurGrid');
    const cell = demineurGrid.querySelector(`[data-row="${row}"][data-col="${col}"]`);

    if (cell.style.backgroundColor === 'red') {
        cell.style.backgroundColor = '';
        cell.style.color = '';
        cell.textContent = '';
        return;
    }

    if (cell.style.backgroundColor === 'rgb(212, 237, 218)') return;

    if (grid[row][col] === -1) {
        document.getElementById('gameContent').innerHTML = `
            <h2>Vous avez touché une bombe !</h2>
            <button onclick="genererDemineur(${gridSize}, document.getElementById('gameContent'))">Rejouer</button>
            <button onclick="annulerCaractere()">Annuler</button>
        `;
        return;
    }

    revelerZone(row, col, gridSize, grid);

    const totalCells = gridSize * gridSize;
    const safeCells = totalCells - grid.flat().filter(val => val === -1).length;
    const revealedCells = [...demineurGrid.children].filter(c => c.style.backgroundColor === 'rgb(212, 237, 218)').length;

    if (revealedCells === safeCells) {
        validerCaractere(currentInput.id);
    }
}

function revelerZone(row, col, gridSize, grid) {
    const demineurGrid = document.getElementById('demineurGrid');
    const cell = demineurGrid.querySelector(`[data-row="${row}"][data-col="${col}"]`);

    if (!cell || cell.style.backgroundColor === 'rgb(212, 237, 218)' || cell.style.backgroundColor === 'rgb(255, 0, 0)') return;

    cell.textContent = grid[row][col] === 0 ? '' : grid[row][col];
    cell.style.backgroundColor = '#d4edda';
    cell.style.cursor = 'default';
    cell.onclick = null;

    if (grid[row][col] !== 0) return;

    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            const newRow = row + dr;
            const newCol = col + dc;
            if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                revelerZone(newRow, newCol, gridSize, grid);
            }
        }
    }
}

function marquerCase(event, row, col) {
    event.preventDefault();
    const demineurGrid = document.getElementById('demineurGrid');
    const cell = demineurGrid.querySelector(`[data-row="${row}"][data-col="${col}"]`);

    if (cell.style.backgroundColor === 'rgb(212, 237, 218)') return;

    if (cell.style.backgroundColor === 'red') {
        cell.style.backgroundColor = '';
        cell.style.color = '';
        cell.textContent = '';
    } else {
        cell.style.backgroundColor = 'red';
        cell.style.color = 'white';
        cell.textContent = 'X';
    }
}

function validerCaractere(inputId) {
    const input = document.getElementById(inputId);
    const modal = document.getElementById('gameModal');
    modal.style.display = 'none';

    reactiverChamp(input);

    currentInput = null;
    currentCharIndex = null;
}

function annulerCaractere() {
    const modal = document.getElementById('gameModal');
    modal.style.display = 'none';
    if (currentInput && currentCharIndex !== null) {
        const currentValue = currentInput.value;
        currentInput.value = currentValue.substring(0, currentCharIndex);
        reactiverChamp(currentInput);
    }
    currentInput = null;
    currentCharIndex = null;

}

['nomInput', 'emailInput', 'messageTextarea'].forEach(inputId => {
    const input = document.getElementById(inputId);

    input.addEventListener('input', (e) => {
        const lastChar = e.data;
        if (lastChar) {
            afficherModalJeu(input, input.value.length - 1);
        }
    });
});

function desactiverChamp(input) {
    input.disabled = true;
}

function reactiverChamp(input) {
    input.disabled = false;
}

document.getElementById('gameValidationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Bravo tu as réussi le défi. Formulaire soumis avec succès !');
});

document.getElementById('phoneInput').addEventListener('input', (e) => {
    const lastChar = e.data;
    if (lastChar && !isNaN(lastChar)){
        const gridSize = parseInt(lastChar) + 2;
        afficherDemineur(e.target, e.target.value.length - 1, gridSize);
    }
});

document.querySelectorAll('.no-paste').forEach(input => {
    input.addEventListener('paste', (e) => {
        e.preventDefault();
        alert('Ne triche pas :). Le collage est désactivé pour ce champ.');
    });

    if (input.id === 'phoneInput') {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }
});