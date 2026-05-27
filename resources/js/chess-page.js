import { Chess } from 'chess.js';
import '../css/chess.css';
import { createGame, makeMove } from './chess-api';

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
const pieceArt = {
    k: `
        <path d="M45 12v11M39.5 17.5h11"/>
        <path d="M33 34c0-7 5.5-12 12-12s12 5 12 12c0 4.5-2.3 8.2-6 10.4l3.8 15.6H35.2L39 44.4C35.3 42.2 33 38.5 33 34Z"/>
        <path d="M30 68h30l4 9H26l4-9Z"/>
    `,
    q: `
        <circle cx="24" cy="28" r="4"/>
        <circle cx="34.5" cy="20" r="4"/>
        <circle cx="45" cy="17" r="4"/>
        <circle cx="55.5" cy="20" r="4"/>
        <circle cx="66" cy="28" r="4"/>
        <path d="M27 34l6 27h24l6-27-11 13-7-19-7 19-11-13Z"/>
        <path d="M30 68h30l4 9H26l4-9Z"/>
    `,
    r: `
        <path d="M27 18h10v7h16v-7h10v20H27V18Z"/>
        <path d="M33 38h24v23H33V38Z"/>
        <path d="M29 61h32l4 16H25l4-16Z"/>
    `,
    b: `
        <circle cx="45" cy="20" r="6"/>
        <path d="M33 47c0-11 12-24 12-24s12 13 12 24c0 8-5.5 14-12 14s-12-6-12-14Z"/>
        <path d="M50 33L39 49"/>
        <path d="M30 68h30l4 9H26l4-9Z"/>
    `,
    n: `
        <path d="M29 61c1.8-14.5 7-25.2 16.5-33.2L40 18c14 2.5 22.5 11.5 24 27l-8 16H29Z"/>
        <path d="M42 31c5 1 9 3.7 12 8"/>
        <path d="M36 43h.2"/>
        <path d="M29 61h32l4 16H25l4-16Z"/>
    `,
    p: `
        <circle cx="45" cy="25" r="9"/>
        <path d="M36 48c0-7 4-13 9-13s9 6 9 13v13H36V48Z"/>
        <path d="M30 68h30l4 9H26l4-9Z"/>
    `,
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
const promotionPieces = [
    { value: 'q', label: 'Queen' },
    { value: 'r', label: 'Rook' },
    { value: 'b', label: 'Bishop' },
    { value: 'n', label: 'Knight' },
];

const state = {
    game: null,
    playerColor: 'WHITE',
    selectedSquare: null,
    legalTargets: [],
    pendingPromotion: null,
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
        root,
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
    state.pendingPromotion = null;
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

async function submitMove(from, to, promotion = null) {
    if (!state.game || state.isSubmittingMove || !canPlayerMove()) {
        return;
    }

    const move = buildUciMove(from, to, promotion);
    state.isSubmittingMove = true;
    state.errorMessage = null;
    state.selectedSquare = null;
    state.legalTargets = [];
    state.pendingPromotion = null;
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
    renderPromotionChoice();
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
                ${piece ? renderPiece(piece) : ''}
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
        const selectedPiece = parsePlacement(state.game?.fen || '').get(state.selectedSquare);

        if (isPromotionMove(selectedPiece, square)) {
            state.pendingPromotion = {
                from: state.selectedSquare,
                to: square,
                color: selectedPiece === selectedPiece.toUpperCase() ? 'WHITE' : 'BLACK',
            };
            render();
            return;
        }

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

function buildUciMove(from, to, promotion = null) {
    return `${from}${to}${promotion ?? ''}`.toLowerCase();
}

function isPromotionMove(piece, to) {
    if (piece?.toLowerCase() !== 'p') {
        return false;
    }

    const isWhitePiece = piece === piece.toUpperCase();
    return (isWhitePiece && to[1] === '8') || (!isWhitePiece && to[1] === '1');
}

function canPlayerMove() {
    return state.game?.status === 'ACTIVE' && state.game.sideToMove === state.playerColor;
}

function canSelectSquare(square, piece) {
    if (!piece || !canPlayerMove() || state.isSubmittingMove || state.pendingPromotion) {
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
        return Array.from({ length: Math.max(0, amount) }, () => renderPiece(piece, true));
    }).join('');

    return markup || '<span class="captured-empty">-</span>';
}

function renderPiece(piece, captured = false) {
    const isWhitePiece = piece === piece.toUpperCase();
    const type = piece.toLowerCase();

    return `
        <span class="piece ${captured ? 'piece--captured' : ''} piece--${isWhitePiece ? 'white' : 'black'}" aria-hidden="true">
            <svg viewBox="0 0 90 90" focusable="false">
                ${pieceArt[type]}
            </svg>
        </span>
    `;
}

function renderPromotionChoice() {
    elements.root.querySelector('[data-promotion-choice]')?.remove();

    if (!state.pendingPromotion) {
        return;
    }

    const isWhitePromotion = state.pendingPromotion.color === 'WHITE';
    const overlay = document.createElement('div');
    overlay.className = 'promotion-choice';
    overlay.dataset.promotionChoice = '';
    overlay.innerHTML = `
        <div class="promotion-choice__panel" role="dialog" aria-modal="true" aria-label="Choose promotion piece">
            <span>Promote pawn</span>
            <div class="promotion-choice__pieces">
                ${promotionPieces.map((piece) => `
                    <button type="button" data-promotion="${piece.value}" aria-label="Promote to ${piece.label}">
                        ${renderPiece(isWhitePromotion ? piece.value.toUpperCase() : piece.value)}
                        <strong>${piece.label}</strong>
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    overlay.querySelectorAll('[data-promotion]').forEach((button) => {
        button.addEventListener('click', () => {
            const { from, to } = state.pendingPromotion;
            submitMove(from, to, button.dataset.promotion);
        });
    });

    elements.root.append(overlay);
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
