'use client';

const COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#8b5cf6', // violet-500
  '#f97316', // orange-500
];

interface SparklineRound {
  roundNumber: number;
  scores: Record<string, number> | null;
}

interface ConfidenceSparklineProps {
  rounds: SparklineRound[];
  options: string[];
}

export default function ConfidenceSparkline({
  rounds,
  options,
}: ConfidenceSparklineProps) {
  // Filter rounds that have scores
  const scoredRounds = rounds.filter((r) => r.scores !== null);
  if (scoredRounds.length < 1) return null;

  const width = 200;
  const height = 44;
  const padding = { top: 4, right: 8, bottom: 4, left: 8 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const maxRound = Math.max(...scoredRounds.map((r) => r.roundNumber));
  const minRound = Math.min(...scoredRounds.map((r) => r.roundNumber));
  const roundRange = Math.max(maxRound - minRound, 1);

  const getX = (roundNum: number) =>
    padding.left + ((roundNum - minRound) / roundRange) * plotWidth;
  const getY = (score: number) =>
    padding.top + plotHeight - (score / 10) * plotHeight;

  return (
    <div className="flex items-center gap-3">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="shrink-0"
      >
        {/* Grid lines */}
        {[2.5, 5, 7.5].map((v) => (
          <line
            key={v}
            x1={padding.left}
            x2={width - padding.right}
            y1={getY(v)}
            y2={getY(v)}
            stroke="#27272a"
            strokeWidth={0.5}
          />
        ))}

        {/* Lines and dots for each option */}
        {options.map((option, optIdx) => {
          const color = COLORS[optIdx % COLORS.length];
          const points = scoredRounds
            .filter((r) => r.scores && r.scores[option] !== undefined)
            .map((r) => ({
              x: getX(r.roundNumber),
              y: getY(r.scores![option]),
              score: r.scores![option],
            }));

          if (points.length === 0) return null;

          // Path
          const pathD = points
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
            .join(' ');

          return (
            <g key={option}>
              <path
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.8}
              />
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={2.5}
                  fill={color}
                  opacity={0.9}
                >
                  <title>{`${option}: ${p.score}/10`}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        {options.map((option, i) => (
          <div key={option} className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-[10px] text-zinc-500 truncate max-w-20">{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
