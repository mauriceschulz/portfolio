const API_BASE_URL = import.meta.env.VITE_CHESS_API_BASE_URL || '';
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

function headers() {
    return {
        'Content-Type': 'application/json',
        ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
    };
}

async function parseJsonResponse(response) {
    const body = await response.json().catch(() => null);

    if (!response.ok || (body && typeof body.status === 'number' && body.error)) {
        throw new Error(body?.message || 'The chess engine did not accept the request.');
    }

    return body;
}

export async function createGame(playerColor = 'WHITE', engineType = 'RANDOM') {
    const response = await fetch(`${API_BASE_URL}/api/games`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
            playerColor,
            fen: null,
            engineType,
        }),
    });

    return parseJsonResponse(response);
}

export async function makeMove(gameId, move) {
    const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/moves`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ move }),
    });

    return parseJsonResponse(response);
}
