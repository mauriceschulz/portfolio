import { Chess } from 'chess.js';
import '../css/chess.css';
import { createGame, makeMove } from './chess-api';

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
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
const labelByEngineType = {
    MINMAX: 'Minmax',
    ONE_PLY: 'One ply',
    RANDOM: 'Random',
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
    engineType: 'RANDOM',
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
        engineType: root.querySelector('[data-engine-type]'),
        sideButtons: [...root.querySelectorAll('[data-side]')],
    });

    elements.newGame.addEventListener('click', () => startGame());
    elements.engineType.addEventListener('change', () => {
        state.engineType = normalizeEngineType(elements.engineType.value);
        startGame();
    });
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
        state.game = await createGame(state.playerColor, state.engineType);
        state.engineType = normalizeEngineType(state.game?.engineType);
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
                draggable="${canSelectSquare(square, piece) ? 'true' : 'false'}"
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
        squareElement.addEventListener('dragstart', (event) => handleDragStart(event, squareElement.dataset.square));
        squareElement.addEventListener('dragover', (event) => handleDragOver(event, squareElement.dataset.square));
        squareElement.addEventListener('drop', (event) => handleDrop(event, squareElement.dataset.square));
        squareElement.addEventListener('dragend', () => handleDragEnd());
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
    elements.engineType.disabled = state.isSubmittingMove;
    elements.engineType.value = state.engineType;
    elements.engineLabel.textContent = engineTypeLabel(game?.engineType || state.engineType);
}

function normalizeEngineType(engineType) {
    return labelByEngineType[engineType] ? engineType : 'RANDOM';
}

function engineTypeLabel(engineType) {
    return labelByEngineType[normalizeEngineType(engineType)];
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
        submitSelectedMove(square);
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

function handleDragStart(event, square) {
    const piece = parsePlacement(state.game?.fen || '').get(square);

    if (!canSelectSquare(square, piece)) {
        event.preventDefault();
        return;
    }

    state.selectedSquare = square;
    state.legalTargets = getLegalTargets(square);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', square);
    render();
}

function handleDragOver(event, square) {
    if (!state.selectedSquare || !state.legalTargets.includes(square)) {
        return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

function handleDrop(event, square) {
    if (!state.selectedSquare || !state.legalTargets.includes(square)) {
        return;
    }

    event.preventDefault();
    submitSelectedMove(square);
}

function handleDragEnd() {
    if (state.isSubmittingMove || state.pendingPromotion) {
        return;
    }

    state.selectedSquare = null;
    state.legalTargets = [];
    render();
}

function submitSelectedMove(to) {
    const selectedPiece = parsePlacement(state.game?.fen || '').get(state.selectedSquare);

    if (isPromotionMove(selectedPiece, to)) {
        state.pendingPromotion = {
            from: state.selectedSquare,
            to,
            color: selectedPiece === selectedPiece.toUpperCase() ? 'WHITE' : 'BLACK',
        };
        render();
        return;
    }

    submitMove(state.selectedSquare, to);
}

function getLegalTargets(square) {
    if (!state.game) {
        return [];
    }

    try {
        const placement = boardPlacement(state.game.fen);
        const sideToMove = state.game.sideToMove === 'WHITE' ? 'w' : 'b';
        const castlingRights = inferCastlingRights(placement, state.game.moveHistory || []);
        const enPassantTarget = inferEnPassantTarget(placement, state.game.moveHistory || [], state.game.sideToMove);
        const chess = new Chess(`${placement} ${sideToMove} ${castlingRights || '-'} ${enPassantTarget} 0 1`);
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

    boardPlacement(placement).split('/').forEach((row, rowIndex) => {
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

function boardPlacement(fen) {
    return (fen || '8/8/8/8/8/8/8/8').split(' ')[0];
}

function inferCastlingRights(placement, history) {
    const board = parsePlacement(placement);
    const rights = [];

    if (canCastleFromHistory(history, 'WHITE', 'king') && board.get('e1') === 'K' && board.get('h1') === 'R') {
        rights.push('K');
    }

    if (canCastleFromHistory(history, 'WHITE', 'queen') && board.get('e1') === 'K' && board.get('a1') === 'R') {
        rights.push('Q');
    }

    if (canCastleFromHistory(history, 'BLACK', 'king') && board.get('e8') === 'k' && board.get('h8') === 'r') {
        rights.push('k');
    }

    if (canCastleFromHistory(history, 'BLACK', 'queen') && board.get('e8') === 'k' && board.get('a8') === 'r') {
        rights.push('q');
    }

    return rights.join('');
}

function canCastleFromHistory(history, color, side) {
    const kingStart = color === 'WHITE' ? 'e1' : 'e8';
    const rookStart = {
        WHITE: { king: 'h1', queen: 'a1' },
        BLACK: { king: 'h8', queen: 'a8' },
    }[color][side];

    return !history.some((move) => {
        const from = String(move).slice(0, 2).toLowerCase();
        return from === kingStart || from === rookStart;
    });
}

function inferEnPassantTarget(placement, history, sideToMove) {
    const lastMove = String(history.at(-1) || '').toLowerCase();

    if (!/^[a-h][1-8][a-h][1-8]/.test(lastMove)) {
        return '-';
    }

    const from = lastMove.slice(0, 2);
    const to = lastMove.slice(2, 4);
    const fromRank = Number(from[1]);
    const toRank = Number(to[1]);

    if (from[0] !== to[0] || Math.abs(fromRank - toRank) !== 2) {
        return '-';
    }

    const board = parsePlacement(placement);
    const movedPiece = board.get(to);

    if (movedPiece?.toLowerCase() !== 'p' || colorForPiece(movedPiece) === sideToMove) {
        return '-';
    }

    const ownPawn = sideToMove === 'WHITE' ? 'P' : 'p';
    const movedFileIndex = files.indexOf(to[0]);
    const canCapture = [-1, 1].some((offset) => board.get(`${files[movedFileIndex + offset]}${to[1]}`) === ownPawn);

    if (!canCapture) {
        return '-';
    }

    return `${to[0]}${(fromRank + toRank) / 2}`;
}

function colorForPiece(piece) {
    return piece === piece.toUpperCase() ? 'WHITE' : 'BLACK';
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
    const file = `${isWhitePiece ? 'w' : 'b'}${piece.toLowerCase()}.svg`;

    return `
        <span class="piece ${captured ? 'piece--captured' : ''} piece--${isWhitePiece ? 'white' : 'black'}" aria-hidden="true">
            <img src="/assets/chess/merida/${file}" alt="" loading="eager" draggable="false">
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
