// components/WeeklyStatsChart.tsx - Weekly review statistics chart using Recharts

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { DailyStat } from '@/lib/stats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeeklyStatsChartProps {
  /** Daily stats for the week */
  data: DailyStat[];

  /** Chart height */
  height?: number;

  /** Whether to show rating breakdown */
  showBreakdown?: boolean;
}

interface TooltipPayloadEntry {
  value: number;
  name: string;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
  showBreakdown?: boolean;
}

// Custom tooltip component - defined outside to prevent re-creation on each render
function CustomTooltip({ active, payload, label, showBreakdown }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const total = payload.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="bg-popover border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-medium mb-1">{label}</p>
      {showBreakdown ? (
        <div className="space-y-1">
          {payload.map((entry) => (
            <div key={entry.name} className="flex justify-between gap-4">
              <span style={{ color: entry.color }}>{entry.name}</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
          <div className="border-t pt-1 mt-1 flex justify-between gap-4">
            <span>Total</span>
            <span className="font-semibold">{total}</span>
          </div>
        </div>
      ) : (
        <p>{total} review{total !== 1 ? 's' : ''}</p>
      )}
    </div>
  );
}

/**
 * Bar chart showing weekly review activity
 * Optionally shows breakdown by rating quality
 */
export function WeeklyStatsChart({
  data,
  height = 200,
  showBreakdown = false,
}: WeeklyStatsChartProps) {

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip showBreakdown={showBreakdown} />} />

            {showBreakdown ? (
              <>
                <Legend
                  wrapperStyle={{ fontSize: 12 }}
                  iconType="circle"
                  iconSize={8}
                />
                <Bar
                  dataKey="easy"
                  name="Easy"
                  stackId="a"
                  fill="hsl(142, 76%, 36%)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="good"
                  name="Good"
                  stackId="a"
                  fill="hsl(217, 91%, 60%)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="hard"
                  name="Hard"
                  stackId="a"
                  fill="hsl(45, 93%, 47%)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="again"
                  name="Again"
                  stackId="a"
                  fill="hsl(0, 84%, 60%)"
                  radius={[4, 4, 0, 0]}
                />
              </>
            ) : (
              <Bar
                dataKey="reviewed"
                name="Reviews"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export type { WeeklyStatsChartProps };
