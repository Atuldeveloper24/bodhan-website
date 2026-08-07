import { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
    LabelList,
    PieChart,
    Pie,
} from 'recharts';

const CHART_COLORS = {
    brandBlue: '#314685',
    brandOrange: '#FF6B35',
    lightBlue: '#A0C4FF',
    paleYellow: '#E8D88A',
    cream: '#FFF9F0',
    grid: '#FFEAD2',
    text: '#525252',
    textMuted: '#737373',
};

const RoundedBar = (props) => {
    const { fill, x, y, width, height } = props;
    if (!height || height <= 0) return null;
    const radius = 4;
    return (
        <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill={fill}
            rx={radius}
            ry={radius}
        />
    );
};

const ChartTooltip = ({ active, payload, label, valueSuffix = '', lowerIsBetter = false }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="bg-[var(--text-primary)] text-white text-[13px] rounded-xl px-3.5 py-2.5 shadow-xl border border-white/10">
            <p className="font-medium mb-1.5 tracking-tight">{label}</p>
            {payload.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2 text-white/90">
                    <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span>
                        {entry.name}: {entry.value}
                        {valueSuffix}
                        {lowerIsBetter && ' (lower is better)'}
                    </span>
                </div>
            ))}
        </div>
    );
};

const ChartLegend = ({ payload }) => (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-1 mb-3">
        {payload?.map((entry) => (
            <div
                key={entry.value}
                className="flex items-center gap-2 text-[12.5px] text-[var(--color-10)]"
            >
                <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                />
                {entry.value}
            </div>
        ))}
    </div>
);

const ChartShell = ({ title, subtitle, children }) => (
    <div className="relative overflow-hidden research-surface rounded-xl my-8">
        <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
                background:
                    'radial-gradient(ellipse 70% 45% at 10% 0%, rgba(49, 70, 133, 0.06) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(255, 107, 53, 0.06) 0%, transparent 50%)',
            }}
        />
        <div className="relative p-5 md:p-6">
            <div className="text-center mb-5">
                <h4 className="research-type-h3 text-[var(--text-primary)] mb-1">{title}</h4>
                {subtitle && (
                    <p className="text-[13px] text-[var(--color-11)]">{subtitle}</p>
                )}
            </div>
            <div className="w-full h-[320px] md:h-[360px]">{children}</div>
        </div>
    </div>
);

export const GroupedBarChart = ({ chart }) => {
    const { title, subtitle, yLabel, xLabel, series, data, lowerIsBetter, valueSuffix = '' } = chart;

    return (
        <ChartShell title={title} subtitle={subtitle}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 12, left: 4, bottom: 20 }}>
                    <defs>
                        {series.map((s) => (
                            <linearGradient
                                key={s.key}
                                id={`bar-grad-${s.key}`}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop offset="0%" stopColor={s.color} stopOpacity={1} />
                                <stop offset="100%" stopColor={s.color} stopOpacity={0.65} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
                    <XAxis
                        dataKey="category"
                        tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        label={
                            xLabel
                                ? {
                                      value: xLabel,
                                      position: 'insideBottom',
                                      offset: -8,
                                      fill: CHART_COLORS.textMuted,
                                      fontSize: 11,
                                  }
                                : undefined
                        }
                    />
                    <YAxis
                        tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        label={
                            yLabel
                                ? {
                                      value: yLabel,
                                      angle: -90,
                                      position: 'insideLeft',
                                      fill: CHART_COLORS.textMuted,
                                      style: { textAnchor: 'middle', fontSize: 11 },
                                  }
                                : undefined
                        }
                    />
                    <Tooltip
                        content={
                            <ChartTooltip valueSuffix={valueSuffix} lowerIsBetter={lowerIsBetter} />
                        }
                        cursor={{ fill: 'rgba(255, 234, 210, 0.45)' }}
                    />
                    <Legend content={<ChartLegend />} />
                    {series.map((s) => (
                        <Bar
                            key={s.key}
                            dataKey={s.key}
                            name={s.label}
                            fill={`url(#bar-grad-${s.key})`}
                            shape={<RoundedBar />}
                            animationDuration={1100}
                            animationEasing="ease-out"
                            label={{
                                position: 'top',
                                fill: CHART_COLORS.textMuted,
                                fontSize: 10,
                                formatter: (v) => (typeof v === 'number' ? v.toFixed(1) : v),
                            }}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </ChartShell>
    );
};

export const RankedBarChart = ({ chart }) => {
    const { title, subtitle, yLabel, data, highlightKey = 'bodhan' } = chart;

    return (
        <ChartShell title={title} subtitle={subtitle}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 24, right: 12, left: 4, bottom: 48 }}>
                    <defs>
                        <linearGradient id="bar-grad-highlight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4a6bb5" />
                            <stop offset="100%" stopColor="#314685" />
                        </linearGradient>
                        <linearGradient id="bar-grad-muted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#c5d8f5" />
                            <stop offset="100%" stopColor="#A0C4FF" />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        angle={-20}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis
                        tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        domain={['auto', 'auto']}
                        label={
                            yLabel
                                ? {
                                      value: yLabel,
                                      angle: -90,
                                      position: 'insideLeft',
                                      fill: CHART_COLORS.textMuted,
                                      style: { textAnchor: 'middle', fontSize: 11 },
                                  }
                                : undefined
                        }
                    />
                    <Tooltip
                        content={<ChartTooltip valueSuffix="%" />}
                        cursor={{ fill: 'rgba(255, 234, 210, 0.45)' }}
                    />
                    <Bar
                        dataKey="score"
                        name="Score"
                        shape={<RoundedBar />}
                        animationDuration={1200}
                        animationEasing="ease-out"
                    >
                        {data.map((entry) => (
                            <Cell
                                key={entry.name}
                                fill={
                                    entry.highlight || entry.key === highlightKey
                                        ? 'url(#bar-grad-highlight)'
                                        : entry.color ?? 'url(#bar-grad-muted)'
                                }
                            />
                        ))}
                        <LabelList
                            dataKey="score"
                            position="top"
                            fill={CHART_COLORS.textMuted}
                            fontSize={10}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartShell>
    );
};

export const DonutChartPlaceholder = ({ chart }) => {
    const { title, subtitle, segments, totalLabel, totalValue } = chart;
    const [activeIndex, setActiveIndex] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(timer);
    }, []);

    const pieData = segments.map((seg, index) => ({
        name: seg.label,
        value: seg.hours ?? seg.value,
        index,
    }));

    return (
        <div className="relative overflow-hidden research-surface rounded-xl my-8 shadow-sm border border-[var(--primary-100)]">
            <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
                style={{
                    background:
                        'radial-gradient(ellipse 70% 50% at 20% 0%, rgba(255, 107, 53, 0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 90% 100%, rgba(49, 70, 133, 0.1) 0%, transparent 55%)',
                }}
            />

            <div className="relative p-5 md:p-7">
                <div className="text-center mb-6">
                    <h4 className="research-type-h3 text-[var(--text-primary)] mb-1">{title}</h4>
                    {subtitle && (
                        <p className="text-[13px] text-[var(--color-11)]">{subtitle}</p>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                    {/* Donut */}
                    <div className="relative w-52 h-52 md:w-60 md:h-60 shrink-0">
                        <div
                            className="absolute inset-0 rounded-full blur-2xl opacity-40 transition-opacity duration-700"
                            style={{
                                background:
                                    activeIndex !== null
                                        ? `linear-gradient(135deg, ${segments[activeIndex].gradientFrom}, ${segments[activeIndex].gradientTo})`
                                        : 'linear-gradient(135deg, #314685, #FF6B35)',
                            }}
                        />

                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <defs>
                                    {segments.map((seg, i) => (
                                        <linearGradient
                                            key={seg.label}
                                            id={`donut-grad-${i}`}
                                            x1="0"
                                            y1="0"
                                            x2="1"
                                            y2="1"
                                        >
                                            <stop offset="0%" stopColor={seg.gradientFrom} />
                                            <stop offset="100%" stopColor={seg.gradientTo} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="58%"
                                    outerRadius="82%"
                                    paddingAngle={3}
                                    stroke="var(--bg-cream-50)"
                                    strokeWidth={3}
                                    animationBegin={0}
                                    animationDuration={1400}
                                    animationEasing="ease-out"
                                    onMouseEnter={(_, index) => setActiveIndex(index)}
                                    onMouseLeave={() => setActiveIndex(null)}
                                >
                                    {pieData.map((entry) => (
                                        <Cell
                                            key={entry.name}
                                            fill={`url(#donut-grad-${entry.index})`}
                                            opacity={
                                                activeIndex === null || activeIndex === entry.index
                                                    ? 1
                                                    : 0.3
                                            }
                                            style={{
                                                filter:
                                                    activeIndex === entry.index
                                                        ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))'
                                                        : 'none',
                                                transition: 'opacity 0.3s ease, filter 0.3s ease',
                                                cursor: 'pointer',
                                            }}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>

                        <div
                            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-transform duration-700"
                            style={{ transform: mounted ? 'scale(1)' : 'scale(0.85)', opacity: mounted ? 1 : 0 }}
                        >
                            <span className="text-2xl md:text-3xl font-medium text-[var(--text-primary)] tracking-tight">
                                {totalValue}
                            </span>
                            <span className="research-type-eyebrow text-[var(--color-11)] mt-0.5">
                                {totalLabel}
                            </span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex-1 w-full space-y-3">
                        {segments.map((seg, i) => {
                            const isActive = activeIndex === i;
                            return (
                                <button
                                    key={seg.label}
                                    type="button"
                                    onMouseEnter={() => setActiveIndex(i)}
                                    onMouseLeave={() => setActiveIndex(null)}
                                    className={`w-full text-left rounded-lg px-4 py-3 transition-all duration-300 border ${
                                        isActive
                                            ? 'border-[var(--text-orange-500)]/30 bg-[var(--bg-cream-100)] shadow-sm'
                                            : 'border-transparent bg-[var(--bg-cream-50)]/80 hover:bg-[var(--bg-cream-100)]'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-3 mb-2">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span
                                                className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-300"
                                                style={{
                                                    background: `linear-gradient(135deg, ${seg.gradientFrom}, ${seg.gradientTo})`,
                                                    transform: isActive ? 'scale(1.3)' : 'scale(1)',
                                                }}
                                            />
                                            <span className="text-[13px] font-medium text-[var(--text-primary)] truncate">
                                                {seg.label}
                                            </span>
                                        </div>
                                        <span className="text-[13px] font-semibold text-[var(--text-primary)] shrink-0">
                                            {seg.display}
                                        </span>
                                    </div>

                                    <div className="h-1.5 rounded-full bg-[var(--primary-100)] overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000 ease-out"
                                            style={{
                                                width: mounted ? `${seg.value}%` : '0%',
                                                background: `linear-gradient(90deg, ${seg.gradientFrom}, ${seg.gradientTo})`,
                                                transitionDelay: `${200 + i * 180}ms`,
                                            }}
                                        />
                                    </div>

                                    <p className="text-[11px] text-[var(--color-11)] mt-1.5">
                                        {seg.value}% of training corpus
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CHART_REGISTRY = {
    groupedBar: GroupedBarChart,
    rankedBar: RankedBarChart,
    donut: DonutChartPlaceholder,
};

const BlogChart = ({ chart }) => {
    const Component = CHART_REGISTRY[chart.type];
    if (!Component) return null;
    return <Component chart={chart} />;
};

export default BlogChart;
