import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Activity, Brain, Shield, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { getHealthData } from "@/lib/health-store";
import { classifyBP, calculateRiskScore, calculateHealthStability, calculateHealthReadiness } from "@/lib/health-utils";

const features = [
  { icon: Heart, title: "BP Classification", desc: "Instant hypertension staging", path: "/assessment" },
  { icon: Activity, title: "Risk Prediction", desc: "AI-powered risk analysis", path: "/analysis" },
  { icon: Brain, title: "Health Insights", desc: "Personalized recommendations", path: "/analysis" },
  { icon: Shield, title: "Pattern Detection", desc: "Morning surge & nocturnal risk", path: "/analysis" },
  { icon: TrendingUp, title: "Progress Tracking", desc: "Monitor your health journey", path: "/progress" },
  { icon: Zap, title: "Weather Risk", desc: "Environmental BP risk factors", path: "/weather" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const navigate = useNavigate();
  const data = getHealthData();

  const stats = data ? {
    bp: classifyBP(data.systolic, data.diastolic),
    risk: calculateRiskScore(data),
    stability: calculateHealthStability(data),
    readiness: calculateHealthReadiness(data),
  } : null;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-gradient-to-br from-primary/10 via-accent to-primary/5 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">PulseGuard AI</h1>
        <p className="mt-1 text-sm text-muted-foreground">Intelligent Blood Pressure Prediction System</p>
        {!data && (
          <Button onClick={() => navigate("/assessment")} className="mt-4">
            Start Health Assessment →
          </Button>
        )}
      </motion.div>

      {/* Stats Cards */}
      {stats && (
        <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "BP Status", value: stats.bp.stage, color: stats.bp.color },
            { label: "Risk Score", value: `${stats.risk}/100`, color: stats.risk <= 30 ? "success" : stats.risk <= 60 ? "warning" : "danger" },
            { label: "Stability", value: `${stats.stability}%`, color: stats.stability >= 70 ? "success" : stats.stability >= 40 ? "warning" : "danger" },
            { label: "Readiness", value: `${stats.readiness}%`, color: stats.readiness >= 70 ? "success" : stats.readiness >= 40 ? "warning" : "danger" },
          ].map((s) => (
            <motion.div key={s.label} variants={item}>
              <Card className="glass-card">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={`mt-1 text-xl font-bold text-${s.color}`}>{s.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Feature Grid */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <motion.div key={f.title} variants={item}>
            <Card
              className="glass-card cursor-pointer transition-all hover:shadow-xl hover:-translate-y-0.5"
              onClick={() => navigate(f.path)}
            >
              <CardHeader className="flex flex-row items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm">{f.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
