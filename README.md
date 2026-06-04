# Maurice Schulz Portfolio

Personal portfolio built with Laravel and Vite. It presents selected software projects, links to the related repositories, and includes an interactive chess demo that connects the Laravel frontend to my separate Spring Boot chess engine API.

**Live site:** [mauriceschulz.dev](https://mauriceschulz.dev)

## Highlights

- Responsive portfolio homepage for fullstack, backend and API projects
- German and English UI text with a persistent language switcher
- Project cards for Domain Harbor, Chess Engine API, Mikrocontroller Quiz and XRechnung API
- Interactive chess page with board UI, move history, captured pieces and API communication log
- Laravel proxy routes for the external chess engine service
- Vite/Tailwind frontend build with custom CSS for the portfolio and chess views
- Dockerized deployment setup with PHP-FPM, Nginx and PostgreSQL
- GitHub Actions deployment to the server

## Tech Stack

- PHP 8.3
- Laravel 12
- Blade
- Tailwind CSS 4
- Vite 7
- chess.js
- PostgreSQL 16
- Docker / Docker Compose

## Run Locally

Requirements:

- PHP 8.2+
- Composer
- Node.js and npm

Install dependencies:

```bash
composer install
npm install
```

Create the environment file and app key:

```bash
cp .env.example .env
php artisan key:generate
```

For a simple local setup without PostgreSQL, use SQLite:

```bash
touch database/database.sqlite
```

Then update `.env`:

```text
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/portfolio/database/database.sqlite
CACHE_STORE=array
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
```

Run migrations if you want the default Laravel tables available:

```bash
php artisan migrate
```

Start the Laravel server and Vite:

```bash
php artisan serve
npm run dev
```

Open:

```text
http://localhost:8000
```

## Chess Engine Integration

The chess page is available at:

```text
http://localhost:8000/chess
```

It sends game and move requests through the Laravel app:

```text
GET  /api/health
POST /api/games
POST /api/games/{gameId}/moves
```

Those routes proxy to the Spring Boot chess engine API. Configure the backend URL with:

```text
CHESS_ENGINE_URL=http://localhost:8080
```

The matching engine repository is available here:

[mauriceschulz/chess-engine-api](https://github.com/mauriceschulz/chess-engine-api)

## Docker

Build and start the production-style stack:

```bash
docker compose up -d --build
```

The compose setup runs:

- `app`: PHP-FPM Laravel container
- `nginx`: public web server
- `db`: PostgreSQL database

The Nginx configuration expects SSL files for `mauriceschulz.dev` mounted at:

```text
/etc/portfolio/ssl
```

This setup is primarily intended for the deployed server. For day-to-day local development, the `php artisan serve` and `npm run dev` workflow is simpler.

## Verification

Run the Laravel test suite:

```bash
php artisan test
```

Build the frontend assets:

```bash
npm run build
```

Useful smoke checks:

```bash
curl -I http://localhost:8000/
curl -I http://localhost:8000/chess
curl http://localhost:8000/api/health
```

Expected results:

- `/` returns the portfolio homepage
- `/chess` returns the chess demo page
- `/api/health` returns the proxied chess engine health response when the engine is running

## Deployment

The GitHub Actions workflow is located at `.github/workflows/deploy.yml` and deploys every push to `main` to `/opt/portfolio`.

Required repository secrets:

```text
SSH_PRIVATE_KEY
CLONE_GITHUB_PRIVATE_KEY
SERVER_IP
DB_PASSWORD
APP_KEY
```

During deployment the workflow writes the production `.env`, points `CHESS_ENGINE_URL` to the chess engine container, and rebuilds the Docker Compose stack.

## Project Status

This repository is the main portfolio shell for my current project demos. The chess experience depends on the separate chess engine API, while the homepage itself stays intentionally lightweight and static.
