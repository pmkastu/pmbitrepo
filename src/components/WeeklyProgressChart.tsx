import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WeeklyProgressChartProps {
  /** Daily activity log: array of { date: string, quizzes: number, bites: number } */
  activityLog: { date: string; quizzes: number; bites: number }[];
}

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

const dayLabel = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
};

export function WeeklyProgressChart({ activityLog }: WeeklyProgressChartProps) {
  const data = useMemo(() => {
    const last7 = getLast7Days();
    const log = Array.isArray(activityLog) ? activityLog : [];
    return last7.map((date) => {
      const entry = log.find((a) => a.date === date);
      return {
        day: dayLabel(date),
        quizzes: entry?.quizzes ?? 0,
        bites: entry?.bites ?? 0,
      };
    });
  }, [activityLog]);

  return (
    <Card className="glass rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-base">📊 Weekly Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                width={24}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="quizzes" name="Quizzes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="bites" name="Bites" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
