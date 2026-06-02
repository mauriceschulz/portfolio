<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Chess Engine | Maurice Schulz</title>
    @vite(['resources/css/app.css', 'resources/js/app.js', 'resources/js/chess-page.js'])
</head>
<body>
    <main class="chess-shell" data-chess-app>
        <nav class="portfolio-topbar chess-topbar" aria-label="Chess navigation">
            <a class="brand-mark" href="{{ url('/') }}" aria-label="Portfolio Maurice Schulz">
                <img src="{{ asset('assets/profile/github-avatar.png') }}" alt="Maurice Schulz">
            </a>
            <div class="topbar-actions">
                <a class="icon-link" href="https://github.com/mauriceschulz" target="_blank" rel="noreferrer" aria-label="GitHub profile">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.29 9.29 0 0 1 12 6.99c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.49A10.16 10.16 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"/>
                    </svg>
                </a>
                <a class="icon-link icon-link--mail" href="mailto:info@mauriceschulz.dev" aria-label="E-Mail">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M4.75 6.5h14.5c.69 0 1.25.56 1.25 1.25v8.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-8.5c0-.69.56-1.25 1.25-1.25Z"/>
                        <path d="m4.5 7.5 7.5 5.75 7.5-5.75"/>
                    </svg>
                </a>
                <div class="language-picker" aria-label="Language">
                    <button type="button" data-language-option="de" aria-label="Deutsch"><span class="flag flag--de"></span>DE</button>
                    <button type="button" data-language-option="en" aria-label="English"><span class="flag flag--en"></span>EN</button>
                </div>
            </div>
        </nav>

        <section class="chess-hero" aria-labelledby="chess-title">
            <div class="chess-hero__content">
                <a class="chess-back" href="{{ url('/') }}" aria-label="Zur Startseite">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M15 6l-6 6 6 6"/>
                    </svg>
                    <span data-de="Portfolio" data-en="Portfolio">Portfolio</span>
                </a>
                <p class="chess-kicker" data-de="Spring Boot Chess API" data-en="Spring Boot chess API">Spring Boot Chess API</p>
                <h1 id="chess-title">Chess Engine API</h1>
                <p class="chess-copy" data-de="Spiele gegen meine Java-Engine: Die Spring-Boot-API erstellt Partien, validiert legale UCI-Züge, berechnet Gegenzüge und liefert den aktuellen Spielstand als FEN." data-en="Play against my Java engine: the Spring Boot API creates games, validates legal UCI moves, calculates replies and returns the current game state as FEN.">
                    Spiele gegen meine Java-Engine: Die Spring-Boot-API erstellt Partien, validiert legale UCI-Züge, berechnet Gegenzüge und liefert den aktuellen Spielstand als FEN.
                </p>
            </div>
            <div class="chess-stats" aria-label="Game summary">
                <div>
                    <span data-de="Engine" data-en="Engine">Engine</span>
                    <strong data-engine-label>Minimax</strong>
                </div>
                <div>
                    <span data-de="Seite" data-en="Side">Seite</span>
                    <strong data-player-label>Weiß</strong>
                </div>
                <div>
                    <span data-de="Position" data-en="Position">Position</span>
                    <strong data-move-count>1</strong>
                </div>
            </div>
        </section>

        <section class="chess-workspace">
            <div class="board-panel">
                <div class="board-header">
                    <div>
                        <span class="eyebrow" data-de="Am Zug" data-en="Current turn">Am Zug</span>
                        <h2 data-turn-label>Weiß am Zug</h2>
                    </div>
                    <div class="status-pill" data-status-pill>Bereit</div>
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
                        <span class="eyebrow" data-de="Setup" data-en="Setup">Setup</span>
                        <h2 data-de="Spielsteuerung" data-en="Game controls">Spielsteuerung</h2>
                    </div>
                    <div class="segmented" role="group" aria-label="Choose side">
                        <button type="button" class="is-active" data-side="w" data-de="Weiß" data-en="White">Weiß</button>
                        <button type="button" data-side="b" data-de="Schwarz" data-en="Black">Schwarz</button>
                    </div>
                    <div class="field">
                        <span data-de="Engine" data-en="Engine">Engine</span>
                        <select data-engine-type aria-label="Choose chess engine">
                            <option value="MINMAX">Minimax</option>
                            <option value="ONE_PLY">One ply</option>
                            <option value="RANDOM">Random</option>
                        </select>
                    </div>
                    <div class="button-row">
                        <button type="button" class="primary-button" data-new-game data-de="Neue Partie" data-en="New game">Neue Partie</button>
                    </div>
                </div>

                <div class="panel-section">
                    <div class="section-title compact">
                        <span class="eyebrow" data-de="Notation" data-en="Notation">Notation</span>
                        <h2 data-de="Züge" data-en="Moves">Züge</h2>
                    </div>
                    <ol class="move-list" data-move-list aria-live="polite"></ol>
                </div>

                <div class="panel-section">
                    <div class="section-title compact">
                        <span class="eyebrow" data-de="Engine Terminal" data-en="Engine terminal">Engine Terminal</span>
                        <h2 data-de="Kommunikation" data-en="Communication">Kommunikation</h2>
                    </div>
                    <div class="engine-console" data-engine-console aria-live="polite"></div>
                </div>

                <div class="panel-section">
                    <div class="section-title compact">
                        <span class="eyebrow" data-de="Position" data-en="Position">Position</span>
                        <h2>FEN</h2>
                    </div>
                    <output class="fen-box" data-fen></output>
                </div>
            </aside>
        </section>
    </main>
</body>
</html>
