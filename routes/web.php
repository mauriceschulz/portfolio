<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

$chessEngineRequest = function (string $method, string $path, array $payload = []) {
    $baseUrl = rtrim(config('services.chess_engine.url', env('CHESS_ENGINE_URL', 'http://localhost:8080')), '/');

    try {
        $response = Http::acceptJson()
            ->asJson()
            ->timeout(8)
            ->{$method}($baseUrl.$path, $payload);
    } catch (Throwable $exception) {
        return response()->json([
            'status' => 503,
            'error' => 'Service Unavailable',
            'message' => 'Chess engine is not reachable at '.$baseUrl.'.',
        ], 503);
    }

    return response($response->body(), $response->status())
        ->header('Content-Type', $response->header('Content-Type', 'application/json'));
};

Route::get('/', function () {
    return view('welcome');
});

Route::get('/chess', function () {
    return view('chess');
})->name('chess');

Route::get('/api/health', fn () => $chessEngineRequest('get', '/api/health'));

Route::post('/api/games', fn (Request $request) => $chessEngineRequest('post', '/api/games', $request->all()));

Route::post('/api/games/{gameId}/moves', fn (Request $request, string $gameId) => $chessEngineRequest('post', "/api/games/{$gameId}/moves", $request->all()));
