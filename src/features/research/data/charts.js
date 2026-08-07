/**
 * Chart configs for blog posts.
 *
 * Each chart is a JSON object referenced from posts.js via `charts: [...]`.
 * BlogContent renders them through <BlogChart chart={...} />.
 *
 * Supported types:
 *   - groupedBar  → multi-series comparison (Vistaar CER, speaker consistency)
 *   - rankedBar   → single ranked leaderboard (overall performance)
 *   - donut       → training data breakdown
 */

export const vistaarCerChart = {
    type: 'groupedBar',
    id: 'vistaar-cer',
    title: 'Benchmark Results on Vistaar Set (Lower is Better)',
    yLabel: 'CER (%)',
    xLabel: 'Language',
    lowerIsBetter: true,
    valueSuffix: '%',
    series: [
        { key: 'bodhan', label: 'Bodhan Scribe', color: '#314685' },
        { key: 'competitorA', label: 'Competitor A', color: '#A0C4FF' },
        { key: 'competitorB', label: 'Google STT', color: '#E8D88A' },
    ],
    data: [
        { category: 'Bengali', bodhan: 4.8, competitorA: 6.2, competitorB: 9.4 },
        { category: 'Gujarati', bodhan: 5.1, competitorA: 7.0, competitorB: 10.2 },
        { category: 'Hindi', bodhan: 3.9, competitorA: 5.5, competitorB: 8.1 },
        { category: 'Kannada', bodhan: 5.4, competitorA: 7.3, competitorB: 11.0 },
        { category: 'Malayalam', bodhan: 5.8, competitorA: 7.8, competitorB: 11.5 },
        { category: 'Marathi', bodhan: 4.5, competitorA: 6.1, competitorB: 9.0 },
        { category: 'Odia', bodhan: 5.6, competitorA: 7.5, competitorB: 10.8 },
        { category: 'Punjabi', bodhan: 4.2, competitorA: 5.9, competitorB: 8.7 },
        { category: 'Tamil', bodhan: 5.3, competitorA: 7.1, competitorB: 10.5 },
        { category: 'Telugu', bodhan: 5.0, competitorA: 6.8, competitorB: 9.8 },
    ],
};

export const speakerConsistencyChart = {
    type: 'groupedBar',
    id: 'speaker-consistency',
    title: 'Speaker Consistency: Cross-Language vs Same-Language',
    yLabel: 'Speaker Similarity',
    xLabel: 'Speaker',
    valueSuffix: '',
    series: [
        { key: 'crossLang', label: 'Cross-Language', color: '#314685' },
        { key: 'sameLang', label: 'Same-Language', color: '#A0C4FF' },
    ],
    data: [
        { category: 'Anushka', crossLang: 0.885, sameLang: 0.914 },
        { category: 'Arya', crossLang: 0.891, sameLang: 0.908 },
        { category: 'Manisha', crossLang: 0.878, sameLang: 0.902 },
        { category: 'Vidya', crossLang: 0.893, sameLang: 0.919 },
        { category: 'Abhilash', crossLang: 0.882, sameLang: 0.905 },
        { category: 'Hitesh', crossLang: 0.876, sameLang: 0.898 },
        { category: 'Karun', crossLang: 0.889, sameLang: 0.911 },
        { category: 'Raghav', crossLang: 0.884, sameLang: 0.907 },
    ],
};

export const overallPerformanceChart = {
    type: 'rankedBar',
    id: 'overall-wer',
    title: 'Bodhan ASR — Overall Benchmark Performance',
    subtitle: 'Average WER across Voice of India test set (lower is better)',
    yLabel: 'WER (%)',
    highlightKey: 'bodhan',
    data: [
        { name: 'Bodhan Scribe', key: 'bodhan', score: 4.2, highlight: true },
        { name: 'Model B', score: 5.8, color: '#A0C4FF' },
        { name: 'Model C', score: 6.1, color: '#C8D8F0' },
        { name: 'Model D', score: 6.5, color: '#E8D88A' },
        { name: 'Model E', score: 7.2, color: '#FFD4B2' },
        { name: 'Model F', score: 8.0, color: '#FFDAC1' },
    ],
};

export const trainingDataDonut = {
    type: 'donut',
    id: 'training-breakdown',
    title: 'Training Data Breakdown',
    subtitle: '1.35M total hours across three data sources',
    totalLabel: 'Total hours',
    totalValue: '1.35M',
    segments: [
        {
            label: 'Weak / synthetic',
            value: 96.3,
            hours: 1300,
            display: '1.30M',
            gradientFrom: '#1e3a6e',
            gradientTo: '#4a7fd4',
        },
        {
            label: 'Zero-shot TTS',
            value: 2.96,
            hours: 40,
            display: '40K',
            gradientFrom: '#e85a20',
            gradientTo: '#ffb347',
        },
        {
            label: 'Human labeled',
            value: 0.74,
            hours: 11,
            display: '11K',
            gradientFrom: '#3d8fd4',
            gradientTo: '#9ed0ff',
        },
    ],
};

/** Lookup chart by id when referenced from post sections */
export const chartRegistry = {
    'vistaar-cer': vistaarCerChart,
    'speaker-consistency': speakerConsistencyChart,
    'overall-wer': overallPerformanceChart,
    'training-breakdown': trainingDataDonut,
};

export function resolveChart(chartRef) {
    if (typeof chartRef === 'string') return chartRegistry[chartRef];
    return chartRef;
}
