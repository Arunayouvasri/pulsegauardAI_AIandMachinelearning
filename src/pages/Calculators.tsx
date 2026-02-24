import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { getHealthData } from "@/lib/health-store";
import {
  predictBloodGroup, calculateIdealWeight, interpretBMI, estimateBodyFat,
  calculateSodiumLimit, calculateWaterRequirement, calculateGeneticRisk,
  calculateMetabolicRisk, calculateHealthReadiness,
} from "@/lib/health-utils";

const anim = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

function ScoreCard({ title, value, unit, color, description }: {
  title: string; value: string | number; unit?: string; color: string; description: string;
}) {
  return (
    <motion.div variants={item}>
      <Card className="glass-card h-full">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">{title}</p>
          <div className="mt-1 flex items-end gap-1">
            <span className={`text-2xl font-bold text-${color}`}>{value}</span>
            {unit && <span className="mb-0.5 text-xs text-muted-foreground">{unit}</span>}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Calculators() {
  const data = getHealthData();

  if (!data) {
    return <p className="py-20 text-center text-muted-foreground">Complete a health assessment first.</p>;
  }

  const bloodGroups = predictBloodGroup(data.parentBloodGroup1 || "A", data.parentBloodGroup2 || "B");
  const idealWeight = calculateIdealWeight(data.height, data.gender);
  const bmiResult = interpretBMI(data.bmi);
  const bodyFat = estimateBodyFat(data.weight, data.age, data.gender, data.bmi);
  const sodiumLimit = calculateSodiumLimit(data.systolic);
  const waterReq = calculateWaterRequirement(data.weight);
  const geneticRisk = calculateGeneticRisk(data.familyHistory, data.age, data.bmi);
  const metabolicRisk = calculateMetabolicRisk(data.bmi, data.cholesterol, data.bloodSugar);
  const readiness = calculateHealthReadiness(data);

  return (
    <motion.div variants={anim} initial="hidden" animate="show" className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div variants={item}>
          <Card className="glass-card h-full">
            <CardHeader><CardTitle className="text-sm">Blood Group Finder</CardTitle></CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Parents: {data.parentBloodGroup1} × {data.parentBloodGroup2}</p>
              <div className="mt-2 flex gap-2">
                {bloodGroups.map((g) => <Badge key={g} className="bg-primary/10 text-primary">{g}</Badge>)}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">Possible blood groups for offspring</p>
            </CardContent>
          </Card>
        </motion.div>

        <ScoreCard title="Ideal Body Weight" value={idealWeight} unit="kg" color="primary" description={`Based on ${data.height}cm, ${data.gender}`} />
        <ScoreCard title="BMI Category" value={bmiResult.category} color={bmiResult.color} description={`BMI: ${data.bmi} — ${bmiResult.category} range`} />
        <ScoreCard title="Body Fat %" value={bodyFat} unit="%" color={bodyFat > 30 ? "danger" : bodyFat > 25 ? "warning" : "success"} description="Estimated body fat percentage" />
        <ScoreCard title="Daily Sodium Limit" value={sodiumLimit} unit="mg" color={sodiumLimit < 2000 ? "danger" : "primary"} description="Recommended daily sodium intake" />
        <ScoreCard title="Daily Water Requirement" value={waterReq} unit="L" color="primary" description="Based on your body weight" />
        <ScoreCard title="Genetic Hypertension Risk" value={`${geneticRisk}%`} color={geneticRisk > 40 ? "danger" : geneticRisk > 20 ? "warning" : "success"} description={data.familyHistory ? "Elevated due to family history" : "No family history reported"} />
        <ScoreCard title="Metabolic Risk Index" value={`${metabolicRisk}%`} color={metabolicRisk > 50 ? "danger" : metabolicRisk > 25 ? "warning" : "success"} description="Based on BMI, cholesterol, blood sugar" />
        <ScoreCard title="Daily Health Readiness" value={`${readiness}%`} color={readiness >= 70 ? "success" : readiness >= 40 ? "warning" : "danger"} description="Overall readiness score for the day" />
      </div>
    </motion.div>
  );
}
