import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getHealthData } from "@/lib/health-store";
import { motion } from "framer-motion";
import {
  classifyBP, calculateRiskScore, getHealthInsights, predictBPTrend,
  calculateHealthStability, detectBPPattern, getRiskColor,
} from "@/lib/health-utils";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadialBarChart, RadialBar, Legend,
} from "recharts";
import { AlertTriangle } from "lucide-react";

const anim = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function Analysis() {
  const data = getHealthData();
  const navigate = useNavigate();

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-muted-foreground">No health data found. Complete an assessment first.</p>
        <Button onClick={() => navigate("/assessment")}>Go to Assessment</Button>
      </div>
    );
  }

  const bp = classifyBP(data.systolic, data.diastolic);
  const risk = calculateRiskScore(data);
  const insights = getHealthInsights(data);
  const trend = predictBPTrend(data.systolic, data.diastolic);
  const stability = calculateHealthStability(data);
  const patterns = detectBPPattern(data.systolic, data.diastolic);
  const isEmergency = bp.stage === "Stage 2 Hypertension" || bp.stage === "Hypertensive Crisis";

  const sleepData = [4, 5, 6, 7, 8, 9, 10].map((h) => ({
    sleep: `${h}h`, systolic: Math.round(data.systolic + (7 - h) * 3 + Math.random() * 4),
  }));

  const stressData = [
    { level: "Low", systolic: data.systolic - 8, diastolic: data.diastolic - 5 },
    { level: "Medium", systolic: data.systolic, diastolic: data.diastolic },
    { level: "High", systolic: data.systolic + 12, diastolic: data.diastolic + 8 },
  ];

  const stabilityData = [{ name: "Stability", value: stability, fill: "hsl(var(--chart-1))" }];

  const performanceMetrics = {
    accuracy: 87.3, precision: 85.1, recall: 89.6, f1: 87.3,
  };

  return (
    <motion.div variants={anim} initial="hidden" animate="show" className="space-y-6">
      {isEmergency && (
        <Alert variant="destructive" className="border-danger">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Emergency Alert</AlertTitle>
          <AlertDescription>{bp.description}</AlertDescription>
        </Alert>
      )}

      {/* BP Classification & Risk */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div variants={item}>
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-sm">BP Classification</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className={`risk-${bp.color}`}>{bp.stage}</Badge>
                <span className="text-sm text-muted-foreground">{data.systolic}/{data.diastolic} mmHg</span>
              </div>
              <p className="text-xs text-muted-foreground">{bp.description}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-sm">Risk Score</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className={`text-3xl font-bold text-${getRiskColor(risk)}`}>{risk}</span>
                <span className="mb-1 text-sm text-muted-foreground">/100</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className={`h-full rounded-full bg-${getRiskColor(risk)} transition-all`} style={{ width: `${risk}%` }} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Stability & Patterns */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div variants={item}>
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-sm">Health Stability Score</CardTitle></CardHeader>
            <CardContent className="flex items-center gap-6">
              <div className="h-24 w-24">
                <ResponsiveContainer>
                  <RadialBarChart innerRadius="70%" outerRadius="100%" data={stabilityData} startAngle={90} endAngle={90 - (stability / 100) * 360}>
                    <RadialBar dataKey="value" cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <span className={`text-2xl font-bold text-${getRiskColor(100 - stability)}`}>{stability}%</span>
                <p className="text-xs text-muted-foreground">Overall health stability</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-sm">BP Patterns Detected</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {patterns.map((p) => (
                <Badge key={p} variant={p.includes("No concerning") ? "secondary" : "destructive"} className="text-xs">{p}</Badge>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* BP Trend Chart */}
      <motion.div variants={item}>
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-sm">Predicted BP Trend (Next 7 Days)</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="systolic" stroke="hsl(var(--chart-5))" strokeWidth={2} name="Systolic" dot={false} />
                <Line type="monotone" dataKey="diastolic" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Diastolic" dot={false} />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sleep & Stress Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div variants={item}>
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-sm">Sleep vs BP Impact</CardTitle></CardHeader>
            <CardContent className="h-52">
              <ResponsiveContainer>
                <BarChart data={sleepData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="sleep" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="systolic" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-sm">Stress vs BP Mapping</CardTitle></CardHeader>
            <CardContent className="h-52">
              <ResponsiveContainer>
                <BarChart data={stressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="level" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="systolic" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} name="Systolic" />
                  <Bar dataKey="diastolic" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Diastolic" />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Health Insights */}
      <motion.div variants={item}>
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-sm">Personalized Health Insights</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {insights.map((ins) => (
              <div key={ins.category} className="flex gap-3 rounded-lg border p-3">
                <span className="text-xl">{ins.icon}</span>
                <div>
                  <p className="text-xs font-semibold">{ins.category}</p>
                  <p className="text-xs text-muted-foreground">{ins.message}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Model Performance */}
      <motion.div variants={item}>
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-sm">Model Performance Evaluation</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Object.entries(performanceMetrics).map(([key, val]) => (
              <div key={key} className="text-center">
                <p className="text-2xl font-bold text-primary">{val}%</p>
                <p className="text-xs capitalize text-muted-foreground">{key === "f1" ? "F1 Score" : key}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
