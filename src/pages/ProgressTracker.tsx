import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProgressHistory } from "@/lib/health-store";
import { classifyBP, calculateRiskScore } from "@/lib/health-utils";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

export default function ProgressTracker() {
  const history = getProgressHistory();

  if (history.length === 0) {
    return <p className="py-20 text-center text-muted-foreground">No progress data yet. Complete assessments to track progress.</p>;
  }

  const chartData = history.map((entry, i) => ({
    entry: `#${i + 1}`,
    systolic: entry.systolic,
    diastolic: entry.diastolic,
    risk: calculateRiskScore(entry),
    weight: entry.weight,
    date: new Date(entry.date).toLocaleDateString(),
  }));

  const latest = history[history.length - 1];
  const previous = history.length > 1 ? history[history.length - 2] : null;

  const bpChange = previous ? latest.systolic - previous.systolic : 0;
  const riskChange = previous ? calculateRiskScore(latest) - calculateRiskScore(previous) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Weekly Comparison */}
      {previous && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "BP Change", value: `${bpChange > 0 ? "+" : ""}${bpChange} mmHg`, good: bpChange <= 0 },
            { label: "Risk Change", value: `${riskChange > 0 ? "+" : ""}${riskChange}`, good: riskChange <= 0 },
            { label: "Latest Status", value: classifyBP(latest.systolic, latest.diastolic).stage, good: classifyBP(latest.systolic, latest.diastolic).color === "success" },
          ].map((s) => (
            <Card key={s.label} className="glass-card">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`mt-1 text-lg font-bold ${s.good ? "text-success" : "text-danger"}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* BP Progress Chart */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-sm">Blood Pressure Progress</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="entry" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="systolic" stroke="hsl(var(--chart-5))" strokeWidth={2} name="Systolic" />
              <Line type="monotone" dataKey="diastolic" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Diastolic" />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk Progress Chart */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-sm">Risk Score Trend</CardTitle></CardHeader>
        <CardContent className="h-52">
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="entry" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="risk" stroke="hsl(var(--chart-4))" strokeWidth={2} name="Risk Score" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-sm">Assessment History</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2 pr-4">BP</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 pr-4">Risk</th>
                  <th className="pb-2">Weight</th>
                </tr>
              </thead>
              <tbody>
                {history.slice().reverse().map((entry, i) => {
                  const bp = classifyBP(entry.systolic, entry.diastolic);
                  return (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 pr-4">{new Date(entry.date).toLocaleDateString()}</td>
                      <td className="py-2 pr-4">{entry.systolic}/{entry.diastolic}</td>
                      <td className="py-2 pr-4"><Badge className={`risk-${bp.color} text-[10px]`}>{bp.stage}</Badge></td>
                      <td className="py-2 pr-4">{calculateRiskScore(entry)}</td>
                      <td className="py-2">{entry.weight} kg</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
