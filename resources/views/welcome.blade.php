<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Maurice Schulz</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <main class="portfolio-shell">
        <nav class="portfolio-topbar" aria-label="Portfolio navigation">
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

        <section class="portfolio-hero" aria-labelledby="portfolio-title">
            <p class="portfolio-kicker" data-de="Fullstack- und Backend-Entwicklung" data-en="Fullstack and backend development">Fullstack- und Backend-Entwicklung</p>
            <h1 id="portfolio-title">Maurice Schulz</h1>
            <p class="portfolio-signature">Fullstack / Backend / APIs</p>
            <p data-de="Ich entwickle Webanwendungen, APIs und Backend-Systeme mit Laravel, Java und Spring Boot. Dabei fokussiere ich mich auf saubere Backend-Logik, strukturierte Schnittstellen und nutzbare Frontends." data-en="I build web applications, APIs and backend systems with Laravel, Java and Spring Boot. My focus is clean backend logic, structured interfaces and usable frontends.">
                Ich entwickle Webanwendungen, APIs und Backend-Systeme mit Laravel, Java und Spring Boot. Dabei fokussiere ich mich auf saubere Backend-Logik, strukturierte Schnittstellen und nutzbare Frontends.
            </p>
            <div class="portfolio-actions">
                <a class="primary-button" href="{{ route('chess') }}" data-de="Chess Engine testen" data-en="Try the Chess Engine">Chess Engine testen</a>
                <a class="ghost-button" href="#projects" data-de="Projekte ansehen" data-en="View projects">Projekte ansehen</a>
            </div>
        </section>

        <section id="projects" class="project-section" aria-labelledby="projects-title">
            <div class="section-heading">
                <span data-de="Auswahl" data-en="Selected work">Auswahl</span>
                <h2 id="projects-title" data-de="Projekte" data-en="Projects">Projekte</h2>
            </div>

            <div class="project-grid">
                <a class="project-card project-card--harbor" href="https://github.com/mauriceschulz/domain-harbor" target="_blank" rel="noreferrer" aria-label="Domain Harbor auf GitHub öffnen">
                    <img class="project-logo" src="{{ asset('assets/project-icons/domainharbor.png') }}" alt="" aria-hidden="true">
                    <div>
                        <h3>Domain Harbor</h3>
                        <p data-de="Fullstack-Laravel-Anwendung für mehrsprachige Domain-Landingpages mit Kaufanfragen, Admin-Bereich und Inhaltseditor." data-en="Fullstack Laravel application for multilingual domain landing pages with buyer requests, an admin area and a content editor.">Fullstack-Laravel-Anwendung für mehrsprachige Domain-Landingpages mit Kaufanfragen, Admin-Bereich und Inhaltseditor.</p>
                        <div class="tech-stack" aria-label="Tech stack">
                            <span class="tech-badge tech-badge--php">
                                <span class="tech-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 8h16v8H4z"/><path d="M7 10v4M7 10h3c1.3 0 1.3 2 0 2H7M13 10v4M13 10h2.8c1.3 0 1.3 2 0 2H13M18 10v4"/></svg></span>
                                PHP
                            </span>
                            <span class="tech-badge tech-badge--laravel">
                                <span class="tech-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 7l7-4 7 4v10l-7 4-7-4V7z"/><path d="M5 7l7 4 7-4M12 11v10"/></svg></span>
                                Laravel
                            </span>
                        </div>
                    </div>
                </a>

                <a class="project-card project-card--chess" href="https://github.com/mauriceschulz/chess-engine-api" target="_blank" rel="noreferrer" aria-label="Chess Engine API auf GitHub öffnen">
                    <img class="project-logo" src="{{ asset('assets/project-icons/chess-engine.png') }}" alt="" aria-hidden="true">
                    <div>
                        <h3>Chess Engine API</h3>
                        <p data-de="Java/Spring-Boot-API für Schachpartien mit Zugvalidierung, Engine-Antworten und FEN-Spielständen." data-en="Java/Spring Boot API for chess games with move validation, engine responses and FEN game states.">Java/Spring-Boot-API für Schachpartien mit Zugvalidierung, Engine-Antworten und FEN-Spielständen.</p>
                        <div class="tech-stack" aria-label="Tech stack">
                            <span class="tech-badge tech-badge--java">
                                <span class="tech-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 18h8M9 21h6M12 3c2 2-2 3 0 5s4 2 2 5M8 13c-2-2 2-3 0-5"/></svg></span>
                                Java
                            </span>
                            <span class="tech-badge tech-badge--spring">
                                <span class="tech-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 14c7 1 11-3 14-9 1 7-2 14-9 15-4 .5-6-2-5-6z"/><path d="M6 17c3-4 7-6 12-7"/></svg></span>
                                Spring Boot
                            </span>
                        </div>
                    </div>
                </a>

                <a class="project-card project-card--quiz" href="https://github.com/mauriceschulz/mikro-controller-quiz" target="_blank" rel="noreferrer" aria-label="Mikrocontroller Quiz auf GitHub öffnen">
                    <img class="project-logo" src="{{ asset('assets/project-icons/mikrocontroller-quiz.png') }}" alt="" aria-hidden="true">
                    <div>
                        <h3 data-de="Mikrocontroller Quiz" data-en="Microcontroller Quiz">Mikrocontroller Quiz</h3>
                        <p data-de="Multiplayer-Quiz mit ESP32-Geräten und Java-Backend zur Steuerung von Fragen, Antworten und Punkteständen." data-en="Multiplayer quiz with ESP32 devices and a Java backend for controlling questions, answers and scores.">Multiplayer-Quiz mit ESP32-Geräten und Java-Backend zur Steuerung von Fragen, Antworten und Punkteständen.</p>
                        <div class="tech-stack" aria-label="Tech stack">
                            <span class="tech-badge tech-badge--c">
                                <span class="tech-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M15 10a4 4 0 1 0 0 4"/></svg></span>
                                C
                            </span>
                            <span class="tech-badge tech-badge--java">
                                <span class="tech-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 18h8M9 21h6M12 3c2 2-2 3 0 5s4 2 2 5M8 13c-2-2 2-3 0-5"/></svg></span>
                                Java
                            </span>
                        </div>
                    </div>
                </a>

                <a class="project-card project-card--invoice" href="https://github.com/mauriceschulz/xrechnung-api" target="_blank" rel="noreferrer" aria-label="XRechnung API auf GitHub öffnen">
                    <img class="project-logo" src="{{ asset('assets/project-icons/xrechnung-api.png') }}" alt="" aria-hidden="true">
                    <div>
                        <h3>XRechnung API</h3>
                        <p data-de="Backend-API zum Erstellen strukturierter XRechnungen für deutsche E-Invoicing-Prozesse." data-en="Backend API for creating structured XRechnung documents for German e-invoicing processes.">Backend-API zum Erstellen strukturierter XRechnungen für deutsche E-Invoicing-Prozesse.</p>
                        <div class="tech-stack" aria-label="Tech stack">
                            <span class="tech-badge tech-badge--php">
                                <span class="tech-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 8h16v8H4z"/><path d="M7 10v4M7 10h3c1.3 0 1.3 2 0 2H7M13 10v4M13 10h2.8c1.3 0 1.3 2 0 2H13M18 10v4"/></svg></span>
                                PHP
                            </span>
                            <span class="tech-badge tech-badge--laravel">
                                <span class="tech-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 7l7-4 7 4v10l-7 4-7-4V7z"/><path d="M5 7l7 4 7-4M12 11v10"/></svg></span>
                                Laravel
                            </span>
                        </div>
                    </div>
                </a>
            </div>
        </section>
    </main>
</body>
</html>
