<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coming Soon | Maurice Schulz</title>
    @vite(['resources/css/app.css'])
</head>
<body class="min-h-screen flex items-center justify-center bg-neutral-900 text-white font-sans">
    <div class="text-center px-4">
        <h1 class="text-5xl md:text-7xl font-light tracking-widest mb-4 text-neutral-100">
            COMING SOON
        </h1>
        <p class="text-lg md:text-xl text-neutral-500 font-light">
            Mein Portfolio ist in Arbeit.
        </p>
        <p class="mt-8 text-xs uppercase tracking-[0.3em] text-neutral-600">
            Maurice Schulz
        </p>
        <a href="{{ route('chess') }}" class="mt-10 inline-flex items-center justify-center rounded border border-neutral-700 px-5 py-3 text-sm uppercase tracking-[0.18em] text-neutral-300 transition hover:border-neutral-500 hover:text-white">
            Chess page
        </a>
    </div>
</body>
</html>
