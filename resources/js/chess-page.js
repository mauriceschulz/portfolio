import { Chess } from 'chess.js';
import { createGame, makeMove } from './chess-api';

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
const pieceSymbols = {
    K: '♔',
    Q: '♕',
    R: '♖',
    B: '♗',
    N: '♘',
    P: '♙',
    k: '♚',
    q: '♛',
    r: '♜',
    b: '♝',
    n: '♞',
    p: '♟',
};
const pieceNames = {
    K: 'White king',
    Q: 'White queen',
    R: 'White rook',
    B: 'White bishop',
    N: 'White knight',
    P: 'White pawn',
    k: 'Black king',
    q: 'Black queen',
    r: 'Black rook',
    b: 'Black bishop',
    n: 'Black knight',
    p: 'Black pawn',
};
const startMaterial = {
    p: 8,
    n: 2,
    b: 2,
    r: 2,
    q: 1,
};
const labelByColor = {
    WHITE: 'White',
    BLACK: 'Black',
};

const state = {
    game: null,
    playerColor: 'WHITE',
    selectedSquare: null,
    legalTargets: [],
    isSubmittingMove: false,
    lastPlayerMove: null,
    lastEngineMove: null,
    errorMessage: null,
};

const elements = {};

document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('[data-chess-app]');

    if (!root) {
        return;
    }

    Object.assign(elements, {
        board: root.querySelector('[data-board]'),
        statusPill: root.querySelector('[data-status-pill]'),
        turnLabel: root.querySelector('[data-turn-label]'),
        engineLabel: root.querySelector('[data-engine-label]'),
        playerLabel: root.querySelector('[data-player-label]'),
        moveCount: root.querySelector('[data-move-count]'),
        moveList: root.querySelector('[data-move-list]'),
        fen: root.querySelector('[data-fen]'),
        capturedWhite: root.querySelector('[data-captured-white]'),
        capturedBlack: root.querySelector('[data-captured-black]'),
        newGame: root.querySelector('[data-new-game]'),
        sideButtons: [...root.querySelectorAll('[data-side]')],
    });

    elements.newGame.addEventListener('click', () => startGame());
    elements.sideButtons.forEach((button) => {
        button.addEventListener('click', () => {
            state.playerColor = button.dataset.side === 'b' ? 'BLACK' : 'WHITE';
            elements.sideButtons.forEach((sideButton) => sideButton.classList.toggle('is-active', sideButton === button));
            startGame();
        });
    });

    render();
    startGame();
});

async function startGame() {
    state.isSubmittingMove = true;
    state.selectedSquare = null;
    state.legalTargets = [];
    state.errorMessage = null;
    render();

    try {
        state.game = await createGame(state.playerColor);
        state.lastPlayerMove = null;
        state.lastEngineMove = initialEngineMove(state.game);
    } catch (error) {
        state.game = null;
        state.errorMessage = `${error.message} Start the Spring Boot engine on port 8080, then create a new game.`;
    } finally {
        state.isSubmittingMove = false;
        render();
    }
}

async function submitMove(from, to) {
    if (!state.game || state.isSubmittingMove || !canPlayerMove()) {
        return;
    }

    const move = buildUciMove(from, to);
    state.isSubmittingMove = true;
    state.errorMessage = null;
    state.selectedSquare = null;
    state.legalTargets = [];
    render();

    try {
        const result = await makeMove(state.game.gameId, move);
        state.game = result;
        state.lastPlayerMove = result.playerMove;
        state.lastEngineMove = result.engineMove;
    } catch (error) {
        state.errorMessage = error.message;
    } finally {
        state.isSubmittingMove = false;
        render();
    }
}

function render() {
    renderBoard();
    renderMeta();
    renderMoves();
    renderCaptured();
}

function renderBoard() {
    const placement = state.game?.fen || '8/8/8/8/8/8/8/8';
    const board = parsePlacement(placement);
    const playerIsBlack = state.playerColor === 'BLACK';
    const squareOrder = [];

    ranks.forEach((rank) => {
        files.forEach((file) => squareOrder.push(`${file}${rank}`));
    });

    if (playerIsBlack) {
        squareOrder.reverse();
    }

    elements.board.innerHTML = squareOrder.map((square) => {
        const piece = board.get(square);
        const fileIndex = files.indexOf(square[0]);
        const rankIndex = Number(square[1]);
        const isLight = (fileIndex + rankIndex) % 2 === 1;
        const isSelected = state.selectedSquare === square;
        const isTarget = state.legalTargets.includes(square);
        const isLastMove = [state.lastPlayerMove, state.lastEngineMove].some((move) => move?.slice(0, 2) === square || move?.slice(2, 4) === square);
        const disabled = !canSelectSquare(square, piece) && !isTarget;
        const label = piece ? `${square}, ${pieceNames[piece]}` : `${square}, empty`;

        return `
            <button
                type="button"
                class="square ${isLight ? 'is-light' : 'is-dark'} ${isSelected ? 'is-selected' : ''} ${isTarget ? 'is-target' : ''} ${isLastMove ? 'is-last-move' : ''}"
                data-square="${square}"
                role="gridcell"
                aria-label="${label}"
                ${disabled ? 'tabindex="-1"' : ''}
            >
                <span>${piece ? pieceSymbols[piece] : ''}</span>
            </button>
        `;
    }).join('');

    elements.board.querySelectorAll('[data-square]').forEach((squareElement) => {
        squareElement.addEventListener('click', () => handleSquareClick(squareElement.dataset.square));
    });
}

function renderMeta() {
    const game = state.game;
    const status = game?.status || 'CONNECTING';
    const sideToMove = game?.sideToMove ? labelByColor[game.sideToMove] : 'White';
    const moveNumber = Math.floor((game?.moveHistory?.length || 0) / 2) + 1;

    elements.statusPill.textContent = state.isSubmittingMove ? 'Thinking' : statusText(status);
    elements.statusPill.classList.toggle('is-error', Boolean(state.errorMessage));
    elements.turnLabel.textContent = state.errorMessage || (game ? `${sideToMove} to move` : 'Connect the engine');
    elements.playerLabel.textContent = labelByColor[state.playerColor];
    elements.moveCount.textContent = String(moveNumber);
    elements.fen.textContent = game?.fen || 'No active game';
    elements.newGame.disabled = state.isSubmittingMove;
    elements.engineLabel.textContent = 'Spring API';
}

function renderMoves() {
    const history = state.game?.moveHistory || [];
    const rows = [];

    for (let index = 0; index < history.length; index += 2) {
        rows.push(`
            <li>
                <span>${index / 2 + 1}</span>
                <strong>${history[index] || ''}</strong>
                <strong>${history[index + 1] || ''}</strong>
            </li>
        `);
    }

    elements.moveList.innerHTML = rows.join('') || '<li class="empty-moves">No moves yet</li>';
}

function renderCaptured() {
    const board = parsePlacement(state.game?.fen || '8/8/8/8/8/8/8/8');
    const counts = { white: { ...startMaterial }, black: { ...startMaterial } };

    board.forEach((piece) => {
        const color = piece === piece.toUpperCase() ? 'white' : 'black';
        const type = piece.toLowerCase();

        if (counts[color][type] !== undefined) {
            counts[color][type] -= 1;
        }
    });

    elements.capturedWhite.innerHTML = capturedMarkup(counts.white, true);
    elements.capturedBlack.innerHTML = capturedMarkup(counts.black, false);
}

function handleSquareClick(square) {
    const piece = parsePlacement(state.game?.fen || '').get(square);

    if (state.selectedSquare && state.legalTargets.includes(square)) {
        submitMove(state.selectedSquare, square);
        return;
    }

    if (!canSelectSquare(square, piece)) {
        state.selectedSquare = null;
        state.legalTargets = [];
        render();
        return;
    }

    state.selectedSquare = square;
    state.legalTargets = getLegalTargets(square);
    render();
}

function getLegalTargets(square) {
    if (!state.game) {
        return [];
    }

    try {
        const chess = new Chess(`${state.game.fen} ${state.game.sideToMove === 'WHITE' ? 'w' : 'b'} - - 0 1`);
        return chess.moves({ square, verbose: true }).map((move) => move.to);
    } catch {
        return [];
    }
}

function buildUciMove(from, to) {
    const piece = parsePlacement(state.game?.fen || '').get(from);
    const promotes = piece?.toLowerCase() === 'p' && (to[1] === '1' || to[1] === '8');

    return `${from}${to}${promotes ? 'q' : ''}`;
}

function canPlayerMove() {
    return state.game?.status === 'ACTIVE' && state.game.sideToMove === state.playerColor;
}

function canSelectSquare(square, piece) {
    if (!piece || !canPlayerMove() || state.isSubmittingMove) {
        return false;
    }

    const isWhitePiece = piece === piece.toUpperCase();
    return state.playerColor === (isWhitePiece ? 'WHITE' : 'BLACK');
}

function parsePlacement(placement) {
    const board = new Map();

    placement.split('/').forEach((row, rowIndex) => {
        let fileIndex = 0;
        [...row].forEach((character) => {
            if (/\d/.test(character)) {
                fileIndex += Number(character);
                return;
            }

            board.set(`${files[fileIndex]}${8 - rowIndex}`, character);
            fileIndex += 1;
        });
    });

    return board;
}

function capturedMarkup(counts, whitePieces) {
    const pieces = whitePieces ? ['Q', 'R', 'B', 'N', 'P'] : ['q', 'r', 'b', 'n', 'p'];
    const markup = pieces.flatMap((piece) => {
        const amount = counts[piece.toLowerCase()] || 0;
        return Array.from({ length: Math.max(0, amount) }, () => `<span>${pieceSymbols[piece]}</span>`);
    }).join('');

    return markup || '<span class="captured-empty">-</span>';
}

function initialEngineMove(game) {
    if (state.playerColor !== 'BLACK' || !game?.moveHistory?.length) {
        return null;
    }

    return game.moveHistory[game.moveHistory.length - 1];
}

function statusText(status) {
    if (state.errorMessage) {
        return 'Engine offline';
    }

    return {
        ACTIVE: 'Active',
        CHECKMATE: 'Checkmate',
        DRAW: 'Draw',
        STALEMATE: 'Stalemate',
        RESIGNED: 'Resigned',
        CONNECTING: 'Connecting',
    }[status] || status;
}
