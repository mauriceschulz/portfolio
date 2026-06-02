import './bootstrap';

const LANGUAGE_KEY = 'portfolio-language';

function preferredLanguage() {
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY);

    if (['de', 'en'].includes(savedLanguage)) {
        return savedLanguage;
    }

    return document.documentElement.lang === 'en' ? 'en' : 'de';
}

function applyLanguage(language) {
    document.documentElement.lang = language;
    localStorage.setItem(LANGUAGE_KEY, language);

    document.querySelectorAll('[data-de][data-en]').forEach((element) => {
        element.textContent = element.dataset[language];
    });

    document.querySelectorAll('[data-tooltip-de][data-tooltip-en]').forEach((element) => {
        element.dataset.tooltip = element.dataset[`tooltip${language === 'en' ? 'En' : 'De'}`];
    });

    document.querySelectorAll('[data-language-option]').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.languageOption === language);
    });

    window.dispatchEvent(new CustomEvent('portfolio:language-change', { detail: { language } }));
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-language-option]').forEach((button) => {
        button.addEventListener('click', () => applyLanguage(button.dataset.languageOption));
    });

    applyLanguage(preferredLanguage());
});
