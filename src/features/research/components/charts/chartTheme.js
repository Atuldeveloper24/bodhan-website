export const CHART = {
    series: {
        primary: '#C2410C',
        secondary: '#0F766E',
        tertiary: '#5C4033',
        muted: '#A89880',
        highlight: '#C2410C',
    },
    text: {
        primary: '#2C241C',
        secondary: '#5C534A',
        inverse: '#FBF6EE',
    },
    grid: '#E4D8C8',
    axis: '#C9BBA8',
    tooltip: '#2C241C',
    focus: '#C2410C',
    panel: '#FBF6EE',
    marker: {
        primary: 'circle',
        secondary: 'square',
        tertiary: 'diamond',
    },
};

export const SERIES_ROLES = {
    primary: { color: CHART.series.primary, marker: 'circle' },
    secondary: { color: CHART.series.secondary, marker: 'square' },
    tertiary: { color: CHART.series.tertiary, marker: 'diamond' },
    muted: { color: CHART.series.muted, marker: 'circle' },
};

export const resolveSeries = (series = []) =>
    series.map((item, index) => {
        const roles = ['primary', 'secondary', 'tertiary'];
        const role = item.role ?? roles[index] ?? 'muted';
        return {
            ...item,
            role,
            color: item.color ?? SERIES_ROLES[role].color,
            marker: item.marker ?? SERIES_ROLES[role].marker,
        };
    });

export const axisTick = {
    fill: CHART.text.secondary,
    fontSize: 12,
    fontFamily: 'Manrope, sans-serif',
};

export const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
