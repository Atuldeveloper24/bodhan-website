import { useMemo, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const COLORS = {
    blue: '#314685',
    orange: '#FF6B35',
    gold: '#E8B34F',
    paleBlue: '#A0C4FF',
    cream: '#FFEAD2',
    text: '#525252',
    muted: '#737373',
};

const Slider = ({ id, label, value, min, max, step = 1, suffix = '', onChange }) => (
    <label htmlFor={id} className="research-lab-control">
        <span>
            {label}
            <strong>{value}{suffix}</strong>
        </span>
        <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
        />
    </label>
);

const LabTooltip = ({ active, payload, label, suffix = '' }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="research-lab-tooltip">
            <p>{label}</p>
            {payload
                .filter((entry) => entry.value > 0 && entry.name !== 'Start')
                .map((entry) => (
                    <span key={entry.name}>
                        <i style={{ backgroundColor: entry.color }} />
                        {entry.name}: {entry.value}{suffix}
                    </span>
                ))}
        </div>
    );
};

export const WerPlayground = () => {
    const [referenceWords, setReferenceWords] = useState(20);
    const [substitutions, setSubstitutions] = useState(2);
    const [deletions, setDeletions] = useState(1);
    const [insertions, setInsertions] = useState(1);

    const safeSubstitutions = Math.min(substitutions, referenceWords);
    const safeDeletions = Math.min(deletions, referenceWords - safeSubstitutions);
    const correct = Math.max(0, referenceWords - safeSubstitutions - safeDeletions);
    const wer = ((safeSubstitutions + safeDeletions + insertions) / referenceWords) * 100;
    const chartData = [{
        name: 'Reference',
        Correct: correct,
        Substitutions: safeSubstitutions,
        Deletions: safeDeletions,
        Insertions: insertions,
    }];

    const handleReferenceChange = (value) => {
        setReferenceWords(value);
        setSubstitutions((current) => Math.min(current, value));
        setDeletions((current) => Math.min(current, Math.max(0, value - Math.min(substitutions, value))));
    };

    return (
        <div className="research-lab" aria-labelledby="wer-lab-title">
            <div className="research-lab-heading">
                <div>
                    <p className="research-type-eyebrow">Interactive experiment</p>
                    <h3 id="wer-lab-title">Build a Word Error Rate</h3>
                </div>
                <output aria-live="polite">
                    <strong>{wer.toFixed(1)}%</strong>
                    <span>WER</span>
                </output>
            </div>

            <div className="research-lab-controls research-lab-controls-four">
                <Slider id="reference-words" label="Reference words" value={referenceWords} min={5} max={50} onChange={handleReferenceChange} />
                <Slider id="substitutions" label="Substitutions" value={safeSubstitutions} min={0} max={referenceWords - safeDeletions} onChange={setSubstitutions} />
                <Slider id="deletions" label="Deletions" value={safeDeletions} min={0} max={referenceWords - safeSubstitutions} onChange={setDeletions} />
                <Slider id="insertions" label="Insertions" value={insertions} min={0} max={10} onChange={setInsertions} />
            </div>

            <div className="research-lab-chart" role="img" aria-label={`Word error composition: ${correct} correct, ${safeSubstitutions} substitutions, ${safeDeletions} deletions, and ${insertions} insertions. WER is ${wer.toFixed(1)} percent.`}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 12, right: 12, bottom: 8, left: 0 }}>
                        <CartesianGrid stroke={COLORS.cream} horizontal={false} />
                        <XAxis type="number" tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="name" hide />
                        <Tooltip content={<LabTooltip />} cursor={false} />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: COLORS.text }} />
                        <Bar dataKey="Correct" stackId="words" fill={COLORS.paleBlue} animationDuration={500} radius={[6, 0, 0, 6]} />
                        <Bar dataKey="Substitutions" stackId="words" fill={COLORS.orange} animationDuration={500} />
                        <Bar dataKey="Deletions" stackId="words" fill={COLORS.blue} animationDuration={500} />
                        <Bar dataKey="Insertions" stackId="words" fill={COLORS.gold} animationDuration={500} radius={[0, 6, 6, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <p className="research-lab-equation">
                ({safeSubstitutions} substitutions + {safeDeletions} deletions + {insertions} insertions) ÷ {referenceWords} reference words
            </p>
        </div>
    );
};

export const StreamingTimelineLab = () => {
    const [chunkMs, setChunkMs] = useState(640);
    const [overlap, setOverlap] = useState(20);

    const { timeline, stepMs, updatesPerSecond, chunksInTenSeconds, repeatedMs } = useMemo(() => {
        const step = chunkMs * (1 - overlap / 100);
        const chunks = Math.max(1, Math.ceil((10000 - chunkMs) / step) + 1);
        const visibleChunks = Array.from({ length: Math.min(7, chunks) }, (_, index) => ({
            name: `Chunk ${index + 1}`,
            Start: Number(((index * step) / 1000).toFixed(2)),
            Audio: Number((chunkMs / 1000).toFixed(2)),
        }));

        return {
            timeline: visibleChunks,
            stepMs: step,
            updatesPerSecond: 1000 / step,
            chunksInTenSeconds: chunks,
            repeatedMs: Math.max(0, chunks * chunkMs - 10000),
        };
    }, [chunkMs, overlap]);

    return (
        <div className="research-lab" aria-labelledby="stream-lab-title">
            <div className="research-lab-heading">
                <div>
                    <p className="research-type-eyebrow">Interactive experiment</p>
                    <h3 id="stream-lab-title">Streaming chunk timeline</h3>
                </div>
                <div className="research-lab-live-metrics" aria-live="polite">
                    <span><strong>{updatesPerSecond.toFixed(1)}</strong> updates/sec</span>
                    <span><strong>{chunksInTenSeconds}</strong> chunks / 10 sec</span>
                </div>
            </div>

            <div className="research-lab-controls">
                <Slider id="chunk-size" label="Chunk size" value={chunkMs} min={160} max={1280} step={160} suffix=" ms" onChange={setChunkMs} />
                <Slider id="chunk-overlap" label="Overlap" value={overlap} min={0} max={50} step={5} suffix="%" onChange={setOverlap} />
            </div>

            <div className="research-lab-timeline" role="img" aria-label={`The first ${timeline.length} audio chunks, each ${chunkMs} milliseconds long with ${overlap} percent overlap.`}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeline} layout="vertical" margin={{ top: 6, right: 24, bottom: 24, left: 4 }} barCategoryGap={5}>
                        <CartesianGrid stroke={COLORS.cream} vertical horizontal={false} />
                        <XAxis type="number" unit="s" tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 'dataMax']} />
                        <YAxis type="category" dataKey="name" width={58} tick={{ fill: COLORS.text, fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<LabTooltip suffix=" sec" />} cursor={{ fill: 'rgba(255, 234, 210, 0.35)' }} />
                        <Bar dataKey="Start" stackId="timeline" fill="transparent" isAnimationActive={false} legendType="none" />
                        <Bar dataKey="Audio" stackId="timeline" fill={COLORS.blue} animationDuration={450} radius={4}>
                            <LabelList dataKey="Audio" position="right" formatter={(value) => `${value}s`} fill={COLORS.muted} fontSize={10} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <p className="research-lab-equation">
                New audio every {Math.round(stepMs)} ms · approximately {(repeatedMs / 1000).toFixed(1)} sec of overlapping audio processed across a 10-second clip
            </p>
            <p className="research-lab-note">Conceptual timeline only; it does not claim measured Bodhan model latency.</p>
        </div>
    );
};

const ResearchExperiment = ({ type }) => {
    if (type === 'wer-playground') return <WerPlayground />;
    if (type === 'streaming-timeline') return <StreamingTimelineLab />;
    return null;
};

export default ResearchExperiment;
