import { useState } from 'react';
import {
    Bar,
    BarChart,
    Cell,
    LabelList,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import ChartCard, {
    ChartLegend,
    ChartTooltipCard,
    useContainerSize,
} from './ChartCard';
import { CHART, axisTick, prefersReducedMotion, resolveSeries } from './chartTheme';

const formatValue = (value, digits = 1, suffix = '') => {
    if (typeof value !== 'number') return value;
    return `${value.toFixed(digits)}${suffix}`;
};

const Marker = ({ type, cx, cy, color, size = 7, focused = false }) => {
    const stroke = focused ? CHART.focus : color;
    const strokeWidth = focused ? 2 : 1.25;

    if (type === 'square') {
        const half = size;
        return (
            <rect
                x={cx - half}
                y={cy - half}
                width={half * 2}
                height={half * 2}
                fill={color}
                stroke={stroke}
                strokeWidth={strokeWidth}
            />
        );
    }

    if (type === 'diamond') {
        const d = size + 1;
        return (
            <polygon
                points={`${cx},${cy - d} ${cx + d},${cy} ${cx},${cy + d} ${cx - d},${cy}`}
                fill={color}
                stroke={stroke}
                strokeWidth={strokeWidth}
            />
        );
    }

    return (
        <circle
            cx={cx}
            cy={cy}
            r={size}
            fill={color}
            stroke={CHART.panel}
            strokeWidth={focused ? 2 : 1.5}
        />
    );
};

const CompactRechartsTooltip = ({ active, payload, label, valueSuffix = '', digits = 1 }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="chart-tooltip chart-tooltip-static">
            <p className="chart-tooltip-title">{label}</p>
            {payload.map((entry) => (
                <div key={entry.name} className="chart-tooltip-row">
                    <span className="chart-tooltip-label">
                        <span className="chart-marker chart-marker-circle" style={{ color: entry.color }} />
                        {entry.name}
                    </span>
                    <span className="chart-tooltip-value">{formatValue(entry.value, digits, valueSuffix)}</span>
                </div>
            ))}
        </div>
    );
};

const DotPlot = ({ chart, series }) => {
    const [ref, size] = useContainerSize();
    const [active, setActive] = useState(null);
    const isMobile = size.width > 0 && size.width < 560;
    const rowHeight = isMobile ? 36 : 32;
    const plotHeight = Math.max(220, chart.data.length * rowHeight + 48);

    const margin = {
        top: 8,
        right: isMobile ? 12 : 20,
        bottom: 28,
        left: isMobile ? 72 : 86,
    };

    const values = chart.data.flatMap((row) => series.map((item) => row[item.key]));
    const max = Math.max(...values) * 1.12;
    const innerWidth = Math.max(0, size.width - margin.left - margin.right);
    const innerHeight = Math.max(0, plotHeight - margin.top - margin.bottom);
    const x = (value) => margin.left + (value / max) * innerWidth;
    const y = (index) => margin.top + (index + 0.5) * (innerHeight / chart.data.length);
    const ticks = [0, Math.round(max / 2), Math.round(max)];

    const activeRow = active != null ? chart.data[active] : null;

    return (
        <div ref={ref} className="chart-svg-wrap" style={{ height: plotHeight }}>
            {size.width > 0 && (
                <svg
                    width={size.width}
                    height={plotHeight}
                    role="img"
                    aria-label={chart.title}
                >
                    {chart.data.map((_, index) => (
                        <line
                            key={`grid-${index}`}
                            x1={margin.left}
                            x2={size.width - margin.right}
                            y1={y(index)}
                            y2={y(index)}
                            stroke={CHART.grid}
                            strokeWidth={1}
                        />
                    ))}

                    {ticks.map((tick) => (
                        <g key={tick}>
                            <line
                                x1={x(tick)}
                                x2={x(tick)}
                                y1={margin.top}
                                y2={plotHeight - margin.bottom + 4}
                                stroke={tick === 0 ? CHART.axis : 'transparent'}
                                strokeWidth={1}
                            />
                            <text
                                x={x(tick)}
                                y={plotHeight - 8}
                                textAnchor="middle"
                                fill={CHART.text.secondary}
                                fontSize="12"
                                fontFamily="Manrope, sans-serif"
                            >
                                {tick}
                            </text>
                        </g>
                    ))}

                    {chart.data.map((row, index) => (
                        <g key={row.category}>
                            <text
                                x={margin.left - 10}
                                y={y(index) + 4}
                                textAnchor="end"
                                fill={CHART.text.primary}
                                fontSize="12"
                                fontFamily="Manrope, sans-serif"
                            >
                                {row.category}
                            </text>
                            <rect
                                x={margin.left}
                                y={y(index) - rowHeight / 2}
                                width={innerWidth}
                                height={rowHeight}
                                fill="transparent"
                                tabIndex={0}
                                focusable="true"
                                role="button"
                                aria-label={`${row.category}: ${series
                                    .map((item) => `${item.label} ${formatValue(row[item.key], 1, chart.valueSuffix)}`)
                                    .join(', ')}`}
                                onMouseEnter={() => setActive(index)}
                                onMouseLeave={() => setActive(null)}
                                onFocus={() => setActive(index)}
                                onBlur={() => setActive(null)}
                            />
                            {series.map((item) => (
                                <Marker
                                    key={item.key}
                                    type={item.marker}
                                    cx={x(row[item.key])}
                                    cy={y(index)}
                                    color={item.color}
                                    size={isMobile ? 6 : 7}
                                    focused={active === index}
                                />
                            ))}
                        </g>
                    ))}
                </svg>
            )}

            {activeRow && (
                <ChartTooltipCard
                    title={activeRow.category}
                    rows={series.map((item) => ({
                        label: item.label,
                        value: formatValue(activeRow[item.key], 1, chart.valueSuffix),
                        color: item.color,
                        marker: item.marker,
                    }))}
                    hint="↓ Lower is better"
                    x={x(Math.max(...series.map((item) => activeRow[item.key])))}
                    y={y(active)}
                    bounds={{ width: size.width, height: plotHeight }}
                />
            )}
        </div>
    );
};

const DumbbellPlot = ({ chart, series }) => {
    const [ref, size] = useContainerSize();
    const [active, setActive] = useState(null);
    const left = series[0];
    const right = series[1];
    const isMobile = size.width > 0 && size.width < 560;
    const rowHeight = isMobile ? 38 : 34;
    const plotHeight = Math.max(220, chart.data.length * rowHeight + 48);
    const margin = { top: 8, right: 16, bottom: 28, left: isMobile ? 76 : 88 };

    const values = chart.data.flatMap((row) => [row[left.key], row[right.key]]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = (max - min) * 0.35 || 0.02;
    const domainMin = min - pad;
    const domainMax = max + pad;
    const innerWidth = Math.max(0, size.width - margin.left - margin.right);
    const innerHeight = Math.max(0, plotHeight - margin.top - margin.bottom);
    const x = (value) => margin.left + ((value - domainMin) / (domainMax - domainMin)) * innerWidth;
    const y = (index) => margin.top + (index + 0.5) * (innerHeight / chart.data.length);
    const ticks = [min, (min + max) / 2, max].map((tick) => Number(tick.toFixed(2)));
    const activeRow = active != null ? chart.data[active] : null;

    return (
        <div ref={ref} className="chart-svg-wrap" style={{ height: plotHeight }}>
            {size.width > 0 && (
                <svg width={size.width} height={plotHeight} role="img" aria-label={chart.title}>
                    {chart.data.map((_, index) => (
                        <line
                            key={`grid-${index}`}
                            x1={margin.left}
                            x2={size.width - margin.right}
                            y1={y(index)}
                            y2={y(index)}
                            stroke={CHART.grid}
                            strokeWidth={1}
                        />
                    ))}

                    {ticks.map((tick) => (
                        <text
                            key={tick}
                            x={x(tick)}
                            y={plotHeight - 8}
                            textAnchor="middle"
                            fill={CHART.text.secondary}
                            fontSize="12"
                            fontFamily="Manrope, sans-serif"
                        >
                            {tick.toFixed(2)}
                        </text>
                    ))}

                    {chart.data.map((row, index) => {
                        const x1 = x(row[left.key]);
                        const x2 = x(row[right.key]);
                        return (
                            <g key={row.category}>
                                <text
                                    x={margin.left - 10}
                                    y={y(index) + 4}
                                    textAnchor="end"
                                    fill={CHART.text.primary}
                                    fontSize="12"
                                    fontFamily="Manrope, sans-serif"
                                >
                                    {row.category}
                                </text>
                                <rect
                                    x={margin.left}
                                    y={y(index) - rowHeight / 2}
                                    width={innerWidth}
                                    height={rowHeight}
                                    fill="transparent"
                                    tabIndex={0}
                                    focusable="true"
                                    role="button"
                                    aria-label={`${row.category}: ${left.label} ${row[left.key].toFixed(3)}, ${right.label} ${row[right.key].toFixed(3)}`}
                                    onMouseEnter={() => setActive(index)}
                                    onMouseLeave={() => setActive(null)}
                                    onFocus={() => setActive(index)}
                                    onBlur={() => setActive(null)}
                                />
                                <line
                                    x1={x1}
                                    x2={x2}
                                    y1={y(index)}
                                    y2={y(index)}
                                    stroke={CHART.axis}
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                />
                                <Marker type={left.marker} cx={x1} cy={y(index)} color={left.color} focused={active === index} />
                                <Marker type={right.marker} cx={x2} cy={y(index)} color={right.color} focused={active === index} />
                            </g>
                        );
                    })}
                </svg>
            )}

            {activeRow && (
                <ChartTooltipCard
                    title={activeRow.category}
                    rows={series.map((item) => ({
                        label: item.label,
                        value: activeRow[item.key].toFixed(3),
                        color: item.color,
                        marker: item.marker,
                    }))}
                    hint="↑ Higher is better"
                    x={x(activeRow[right.key])}
                    y={y(active)}
                    bounds={{ width: size.width, height: plotHeight }}
                />
            )}
        </div>
    );
};

const GroupedDotChart = ({ chart }) => {
    const series = resolveSeries(chart.series);

    return (
        <ChartCard
            title={chart.title}
            subtitle={chart.subtitle}
            note={chart.note}
            description={chart.description}
            legend={<ChartLegend series={series} />}
            table={{
                headers: ['Language', ...series.map((item) => item.label)],
                rows: chart.data.map((row) => [
                    row.category,
                    ...series.map((item) => formatValue(row[item.key], 1, chart.valueSuffix)),
                ]),
            }}
        >
            <DotPlot chart={chart} series={series} />
        </ChartCard>
    );
};

const DumbbellChart = ({ chart }) => {
    const series = resolveSeries(chart.series);

    return (
        <ChartCard
            title={chart.title}
            subtitle={chart.subtitle}
            note={chart.note}
            description={chart.description}
            legend={<ChartLegend series={series} />}
            table={{
                headers: ['Speaker', ...series.map((item) => item.label)],
                rows: chart.data.map((row) => [
                    row.category,
                    ...series.map((item) => row[item.key].toFixed(3)),
                ]),
            }}
        >
            <DumbbellPlot chart={chart} series={series} />
        </ChartCard>
    );
};

const RankedBarPlot = ({ chart }) => {
    const reduceMotion = prefersReducedMotion();
    const highlightKey = chart.highlightKey ?? 'bodhan';
    const plotHeight = Math.max(200, chart.data.length * 42 + 36);

    return (
        <ChartCard
            title={chart.title}
            subtitle={chart.subtitle}
            note={chart.note}
            description={chart.description}
            plotHeight={plotHeight}
            table={{
                headers: ['System', 'WER (%)'],
                rows: chart.data.map((row) => [row.name, `${row.score}`]),
            }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chart.data}
                    layout="vertical"
                    margin={{ top: 4, right: 36, left: 4, bottom: 4 }}
                    barCategoryGap="32%"
                    maxBarSize={22}
                >
                    <XAxis
                        type="number"
                        domain={[0, 'auto']}
                        tick={axisTick}
                        axisLine={{ stroke: CHART.axis }}
                        tickLine={false}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={118}
                        tick={axisTick}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        content={<CompactRechartsTooltip valueSuffix="%" digits={1} />}
                        cursor={{ fill: 'rgba(92, 83, 74, 0.06)' }}
                    />
                    <Bar
                        dataKey="score"
                        name="WER"
                        radius={[0, 5, 5, 0]}
                        maxBarSize={22}
                        isAnimationActive={!reduceMotion}
                    >
                        {chart.data.map((entry) => (
                            <Cell
                                key={entry.name}
                                fill={
                                    entry.highlight || entry.key === highlightKey
                                        ? CHART.series.primary
                                        : CHART.series.muted
                                }
                            />
                        ))}
                        <LabelList
                            dataKey="score"
                            position="right"
                            fill={CHART.text.secondary}
                            fontSize={12}
                            content={({ x, y, width, height, value, index }) => {
                                const entry = chart.data[index];
                                if (!entry?.highlight) return null;
                                return (
                                    <text
                                        x={x + width + 8}
                                        y={y + height / 2 + 4}
                                        fill={CHART.series.primary}
                                        fontSize="12"
                                        fontFamily="Manrope, sans-serif"
                                        fontWeight="650"
                                    >
                                        {value}%
                                    </text>
                                );
                            }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};

const CompositionChart = ({ chart }) => {
    const [active, setActive] = useState(null);
    const series = chart.segments.map((segment, index) => ({
        key: segment.label,
        label: segment.label,
        color: [CHART.series.tertiary, CHART.series.primary, CHART.series.secondary][index],
        marker: ['diamond', 'circle', 'square'][index],
        display: segment.display,
        value: segment.value,
    }));

    return (
        <ChartCard
            title={chart.title}
            subtitle={chart.subtitle}
            note={chart.note}
            description={chart.description}
            legend={<ChartLegend series={series} />}
            plotHeight={88}
            table={{
                headers: ['Source', 'Hours', 'Share'],
                rows: chart.segments.map((segment) => [
                    segment.label,
                    segment.display,
                    `${segment.value}%`,
                ]),
            }}
        >
            <div className="chart-composition">
                <div
                    className="chart-composition-bar"
                    role="img"
                    aria-label={chart.segments.map((segment) => `${segment.label} ${segment.display}`).join(', ')}
                >
                    {series.map((item, index) => (
                        <button
                            key={item.key}
                            type="button"
                            className="chart-composition-slice"
                            style={{
                                width: `${item.value}%`,
                                background: item.color,
                                opacity: active === null || active === index ? 1 : 0.45,
                            }}
                            aria-label={`${item.label}: ${item.display}, ${item.value}%`}
                            onMouseEnter={() => setActive(index)}
                            onMouseLeave={() => setActive(null)}
                            onFocus={() => setActive(index)}
                            onBlur={() => setActive(null)}
                        />
                    ))}
                </div>
                <ul className="chart-composition-stats">
                    {series.map((item) => (
                        <li key={item.key}>
                            <strong>{item.display}</strong>
                            <span>{item.label}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </ChartCard>
    );
};

const CHART_REGISTRY = {
    groupedBar: GroupedDotChart,
    dotPlot: GroupedDotChart,
    dumbbell: DumbbellChart,
    rankedBar: RankedBarPlot,
    donut: CompositionChart,
    composition: CompositionChart,
};

const BlogChart = ({ chart }) => {
    const Component = CHART_REGISTRY[chart.type];
    if (!Component) return null;
    return <Component chart={chart} />;
};

export default BlogChart;
