// Per-language visual themes for the example panels. Motifs are drawn as
// hand-authored SVG rather than stock photography, so there is no third-party
// licensing involved and each theme costs a few KB at most.
//   motif — a small repeating pattern, drawn inline by CultureBackdrop
//   scene — an optional illustrated vignette from public/examples/culture/
// Tints and opacities stay low so body text keeps its contrast.
const THEMES = {
    tamil: {
        id: 'tamil',
        region: 'Tamil Nadu',
        motif: 'kolam',
        scene: '/examples/culture/tamil.svg',
        accent: '#8C2F1E',
        tintFrom: 'rgba(140, 47, 30, 0.10)',
        tintTo: 'rgba(214, 158, 46, 0.08)',
        glyphs: ['அ', 'ஆ', 'த', 'ம'],
    },
    sanskrit: {
        id: 'sanskrit',
        region: 'Manuscript tradition',
        motif: 'lotus',
        scene: '/examples/culture/sanskrit.svg',
        accent: '#9A5B12',
        tintFrom: 'rgba(154, 91, 18, 0.10)',
        tintTo: 'rgba(196, 148, 74, 0.08)',
        glyphs: ['ॐ', 'अ', 'श', 'क'],
    },
    hindi: {
        id: 'hindi',
        region: 'Hindi belt',
        motif: 'paisley',
        accent: '#B3541E',
        tintFrom: 'rgba(179, 84, 30, 0.10)',
        tintTo: 'rgba(224, 122, 95, 0.08)',
        glyphs: ['अ', 'क', 'भ', 'र'],
    },
    kannada: {
        id: 'kannada',
        region: 'Karnataka',
        motif: 'star',
        accent: '#1F6F63',
        tintFrom: 'rgba(31, 111, 99, 0.10)',
        tintTo: 'rgba(198, 168, 124, 0.08)',
        glyphs: ['ಅ', 'ಕ', 'ಮ', 'ನ'],
    },
    telugu: {
        id: 'telugu',
        region: 'Andhra & Telangana',
        motif: 'vine',
        accent: '#2F6B3A',
        tintFrom: 'rgba(47, 107, 58, 0.10)',
        tintTo: 'rgba(214, 173, 91, 0.08)',
        glyphs: ['అ', 'క', 'మ', 'త'],
    },
    bhojpuri: {
        id: 'bhojpuri',
        region: 'Bhojpuri region',
        motif: 'madhubani',
        scene: '/examples/culture/bhojpuri.svg',
        accent: '#2B4A8B',
        tintFrom: 'rgba(43, 74, 139, 0.10)',
        tintTo: 'rgba(200, 74, 62, 0.08)',
        glyphs: ['भ', 'अ', 'ह', 'न'],
    },
    santali: {
        id: 'santali',
        region: 'Sohrai / Ol Chiki',
        motif: 'sohrai',
        scene: '/examples/culture/santali.svg',
        accent: '#A0472A',
        tintFrom: 'rgba(160, 71, 42, 0.11)',
        tintTo: 'rgba(120, 96, 72, 0.07)',
        glyphs: ['ᱚ', 'ᱛ', 'ᱡ', 'ᱟ'],
    },
    english: {
        id: 'english',
        region: 'English',
        motif: 'grid',
        accent: '#31468555',
        tintFrom: 'rgba(49, 70, 133, 0.07)',
        tintTo: 'rgba(49, 70, 133, 0.03)',
        glyphs: ['A', 'a', 'E', 'e'],
    },
};

const DEFAULT_THEME = THEMES.english;

export function getTheme(key) {
    if (!key) return DEFAULT_THEME;
    return THEMES[String(key).toLowerCase()] ?? DEFAULT_THEME;
}

export default THEMES;
