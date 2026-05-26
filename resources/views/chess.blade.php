<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Chess Engine | Maurice Schulz</title>
    @vite(['resources/css/app.css', 'resources/js/chess-page.js'])
</head>
<body>
    <main class="chess-shell" data-chess-app>
        <section class="chess-hero" aria-labelledby="chess-title">
            <div class="chess-hero__content">
                <a class="chess-back" href="{{ url('/') }}" aria-label="Zur Startseite">
                    <span aria-hidden="true">←</span>
                    Portfolio
                </a>
                <p class="chess-kicker">Interactive board</p>
                <h1 id="chess-title">Chess Engine</h1>
                <p class="chess-copy">
                    Spiele eine Partie gegen eine lokale Engine mit legaler Zugpruefung, Zeitkontrolle und kompletter Notation.
                </p>
            </div>
            <div class="chess-stats" aria-label="Game summary">
                <div>
                    <span>Engine</span>
                    <strong data-engine-label>Spring API</strong>
                </div>
                <div>
                    <span>Side</span>
                    <strong data-player-label>White</strong>
                </div>
                <div>
                    <span>Position</span>
                    <strong data-move-count>1</strong>
                </div>
            </div>
        </section>

        <section class="chess-workspace">
            <div class="board-panel">
                <div class="board-header">
                    <div>
                        <span class="eyebrow">Current turn</span>
                        <h2 data-turn-label>White to move</h2>
                    </div>
                    <div class="status-pill" data-status-pill>Ready</div>
                </div>

                <div class="captured-row captured-row--top" data-captured-black aria-label="Captured black pieces"></div>
                <div class="board-wrap">
                    <div class="rank-files rank-files--left" aria-hidden="true">
                        <span>8</span><span>7</span><span>6</span><span>5</span><span>4</span><span>3</span><span>2</span><span>1</span>
                    </div>
                    <div class="chess-board" data-board role="grid" aria-label="Chess board"></div>
                    <div class="file-labels" aria-hidden="true">
                        <span>a</span><span>b</span><span>c</span><span>d</span><span>e</span><span>f</span><span>g</span><span>h</span>
                    </div>
                </div>
                <div class="captured-row" data-captured-white aria-label="Captured white pieces"></div>
            </div>

            <aside class="control-panel" aria-label="Chess controls">
                <div class="panel-section">
                    <div class="section-title">
                        <span class="eyebrow">Setup</span>
                        <h2>Game controls</h2>
                    </div>
                    <div class="segmented" role="group" aria-label="Choose side">
                        <button type="button" class="is-active" data-side="w">White</button>
                        <button type="button" data-side="b">Black</button>
                    </div>
                    <div class="button-row">
                        <button type="button" class="primary-button" data-new-game>New game</button>
                    </div>
                </div>

                <div class="panel-section">
                    <div class="section-title compact">
                        <span class="eyebrow">Notation</span>
                        <h2>Moves</h2>
                    </div>
                    <ol class="move-list" data-move-list aria-live="polite"></ol>
                </div>

                <div class="panel-section">
                    <div class="section-title compact">
                        <span class="eyebrow">Position</span>
                        <h2>FEN</h2>
                    </div>
                    <output class="fen-box" data-fen></output>
                </div>
            </aside>
        </section>
    </main>
</body>
</html>
