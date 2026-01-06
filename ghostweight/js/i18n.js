/**
 * Ghost Weight - Simple i18n System
 * Supports: ja, en
 */

const I18n = {
    currentLang: 'ja',
    translations: {},
    supportedLangs: ['ja', 'en'],
    defaultLang: 'ja',

    /**
     * Initialize i18n system
     */
    async init() {
        // Detect language from URL param, localStorage, or browser
        this.currentLang = this.detectLanguage();

        // Load translations
        await this.loadTranslations(this.currentLang);

        // Apply translations to DOM
        this.applyTranslations();

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;

        // Update language switcher if exists
        this.updateLanguageSwitcher();
    },

    /**
     * Detect user's preferred language
     */
    detectLanguage() {
        // 1. Check URL parameter (?lang=en)
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && this.supportedLangs.includes(urlLang)) {
            localStorage.setItem('ghost-weight-lang', urlLang);
            return urlLang;
        }

        // 2. Check localStorage
        const storedLang = localStorage.getItem('ghost-weight-lang');
        if (storedLang && this.supportedLangs.includes(storedLang)) {
            return storedLang;
        }

        // 3. Check browser language
        const browserLang = navigator.language.split('-')[0];
        if (this.supportedLangs.includes(browserLang)) {
            return browserLang;
        }

        // 4. Default to Japanese
        return this.defaultLang;
    },

    /**
     * Load translation file
     */
    async loadTranslations(lang) {
        try {
            // Determine base path (handle subdirectories)
            const basePath = this.getBasePath();
            const response = await fetch(`${basePath}i18n/${lang}.json`);
            if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
            this.translations = await response.json();
        } catch (error) {
            console.error('i18n: Failed to load translations', error);
            // Fallback to default language if different
            if (lang !== this.defaultLang) {
                await this.loadTranslations(this.defaultLang);
            }
        }
    },

    /**
     * Get base path for assets (handles subdirectories)
     */
    getBasePath() {
        const path = window.location.pathname;
        // Count directory depth and return appropriate path
        const depth = (path.match(/\//g) || []).length - 1;
        return depth > 0 ? '../'.repeat(depth) : './';
    },

    /**
     * Get nested translation value by key (e.g., "nav.features")
     */
    t(key) {
        const keys = key.split('.');
        let value = this.translations;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                console.warn(`i18n: Missing translation for "${key}"`);
                return key; // Return key as fallback
            }
        }

        return value;
    },

    /**
     * Apply translations to all elements with data-i18n attribute
     */
    applyTranslations() {
        // Text content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation !== key) {
                el.textContent = translation;
            }
        });

        // HTML content (for elements with line breaks)
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            const translation = this.t(key);
            if (translation !== key) {
                el.innerHTML = translation;
            }
        });

        // Placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            if (translation !== key) {
                el.placeholder = translation;
            }
        });

        // Title attribute
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const translation = this.t(key);
            if (translation !== key) {
                el.title = translation;
            }
        });

        // Alt attribute
        document.querySelectorAll('[data-i18n-alt]').forEach(el => {
            const key = el.getAttribute('data-i18n-alt');
            const translation = this.t(key);
            if (translation !== key) {
                el.alt = translation;
            }
        });

        // Document title
        const titleKey = document.querySelector('title')?.getAttribute('data-i18n');
        if (titleKey) {
            document.title = this.t(titleKey);
        }

        // Meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        const descKey = metaDesc?.getAttribute('data-i18n');
        if (descKey) {
            metaDesc.content = this.t(descKey);
        }
    },

    /**
     * Switch to a different language
     */
    async switchLanguage(lang) {
        if (!this.supportedLangs.includes(lang)) {
            console.error(`i18n: Unsupported language "${lang}"`);
            return;
        }

        this.currentLang = lang;
        localStorage.setItem('ghost-weight-lang', lang);

        await this.loadTranslations(lang);
        this.applyTranslations();

        document.documentElement.lang = lang;
        this.updateLanguageSwitcher();
    },

    /**
     * Update language switcher UI
     */
    updateLanguageSwitcher() {
        document.querySelectorAll('[data-lang-switch]').forEach(el => {
            const lang = el.getAttribute('data-lang-switch');
            el.classList.toggle('active', lang === this.currentLang);

            // Update aria-current for accessibility
            if (lang === this.currentLang) {
                el.setAttribute('aria-current', 'true');
            } else {
                el.removeAttribute('aria-current');
            }
        });
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => I18n.init());
