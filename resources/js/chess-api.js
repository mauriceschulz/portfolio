const API_BASE_URL = import.meta.env.VITE_CHESS_API_BASE_URL || '';
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
let apiLogger = null;

export function setChessApiLogger(logger) {
    apiLogger = typeof logger === 'function' ? logger : null;
}

function headers() {
    return {
        'Content-Type': 'application/json',
        ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
    };
}

function logCommunication(entry) {
    apiLogger?.({
        timestamp: new Date(),
        ...entry,
    });
}

async function parseJsonResponse(response, context) {
    const body = await response.json().catch(() => null);

    logCommunication({
        direction: 'in',
        status: response.status,
        ...context,
        body,
    });

    if (!response.ok || (body && typeof body.status === 'number' && body.error)) {
        throw new Error(body?.message || 'The chess engine did not accept the request.');
    }

    return body;
}

export async function createGame(playerColor = 'WHITE', engineType = 'MINMAX') {
    const body = {
        playerColor,
        fen: null,
        engineType,
    };

    logCommunication({
        direction: 'out',
        method: 'POST',
        path: '/api/games',
        body,
    });

    const response = await fetch(`${API_BASE_URL}/api/games`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(body),
    });

    return parseJsonResponse(response, {
        method: 'POST',
        path: '/api/games',
    });
}

export async function makeMove(gameId, move) {
    const path = `/api/games/${gameId}/moves`;
    const body = { move };

    logCommunication({
        direction: 'out',
        method: 'POST',
        path,
        body,
    });

    const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/moves`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(body),
    });

    return parseJsonResponse(response, {
        method: 'POST',
        path,
    });
}
