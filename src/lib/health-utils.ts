export interface HealthInput {
  systolic: number;
  diastolic: number;
  heartRate: number;
  bmi: number;
  cholesterol: number;
  bloodSugar: number;
  sleepHours: number;
  stressLevel: "Low" | "Medium" | "High";
  saltIntake: "Low" | "Medium" | "High";
  physicalActivity: boolean;
  familyHistory: boolean;
  height: number;
  gender: "Male" | "Female";
  weight: number;
  age: number;
  parentBloodGroup1?: string;
  parentBloodGroup2?: string;
}

export interface BPClassification {
  stage: string;
  color: string;
  description: string;
}

export function classifyBP(systolic: number, diastolic: number): BPClassification {
  if (systolic < 120 && diastolic < 80) return { stage: "Normal", color: "success", description: "Your blood pressure is within the healthy range." };
  if (systolic < 130 && diastolic < 80) return { stage: "Elevated", color: "warning", description: "Elevated BP. Lifestyle changes recommended." };
  if (systolic < 140 || diastolic < 90) return { stage: "Stage 1 Hypertension", color: "warning", description: "Stage 1 hypertension. Consult a healthcare provider." };
  if (systolic >= 140 || diastolic >= 90) return { stage: "Stage 2 Hypertension", color: "danger", description: "Stage 2 hypertension. Seek medical attention." };
  if (systolic > 180 || diastolic > 120) return { stage: "Hypertensive Crisis", color: "danger", description: "EMERGENCY: Seek immediate medical attention!" };
  return { stage: "Unknown", color: "muted", description: "" };
}

export function calculateRiskScore(input: HealthInput): number {
  let score = 0;
  const bp = classifyBP(input.systolic, input.diastolic);
  if (bp.stage === "Stage 1 Hypertension") score += 20;
  if (bp.stage === "Stage 2 Hypertension") score += 35;
  if (bp.stage === "Hypertensive Crisis") score += 50;
  if (input.bmi > 30) score += 10;
  else if (input.bmi > 25) score += 5;
  if (input.cholesterol > 240) score += 10;
  else if (input.cholesterol > 200) score += 5;
  if (input.bloodSugar > 126) score += 10;
  else if (input.bloodSugar > 100) score += 5;
  if (input.sleepHours < 6) score += 8;
  if (input.stressLevel === "High") score += 10;
  else if (input.stressLevel === "Medium") score += 5;
  if (input.saltIntake === "High") score += 8;
  else if (input.saltIntake === "Medium") score += 4;
  if (!input.physicalActivity) score += 8;
  if (input.familyHistory) score += 12;
  if (input.age > 60) score += 8;
  else if (input.age > 45) score += 5;
  return Math.min(100, score);
}

export function getHealthInsights(input: HealthInput) {
  const insights: { category: string; icon: string; message: string; priority: "low" | "medium" | "high" }[] = [];
  if (input.sleepHours < 7) insights.push({ category: "Sleep", icon: "🌙", message: `Aim for 7-9 hours of sleep. You're getting ${input.sleepHours}h.`, priority: "medium" });
  if (input.bmi > 25) insights.push({ category: "Weight", icon: "⚖️", message: "Consider a balanced diet to reach a healthy BMI range (18.5-24.9).", priority: "medium" });
  if (!input.physicalActivity) insights.push({ category: "Exercise", icon: "🏃", message: "Aim for 150 minutes of moderate aerobic activity per week.", priority: "high" });
  if (input.stressLevel === "High") insights.push({ category: "Stress", icon: "🧘", message: "Practice relaxation techniques like meditation or deep breathing.", priority: "high" });
  if (input.saltIntake === "High") insights.push({ category: "Diet", icon: "🧂", message: "Reduce sodium intake to less than 2,300mg per day.", priority: "high" });
  if (input.cholesterol > 200) insights.push({ category: "Cholesterol", icon: "🫀", message: "Include more fiber-rich foods and omega-3 fatty acids.", priority: "medium" });
  if (input.bloodSugar > 100) insights.push({ category: "Blood Sugar", icon: "🩸", message: "Monitor blood sugar levels and reduce refined carbohydrates.", priority: "medium" });
  const waterNeeded = calculateWaterRequirement(input.weight);
  insights.push({ category: "Hydration", icon: "💧", message: `Drink at least ${waterNeeded}L of water daily.`, priority: "low" });
  return insights;
}

export function predictBPTrend(systolic: number, diastolic: number) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const variance = (Math.random() - 0.5) * 10;
    const dVariance = (Math.random() - 0.5) * 6;
    days.push({
      day: `Day ${i + 1}`,
      systolic: Math.round(systolic + variance - i * 0.5),
      diastolic: Math.round(diastolic + dVariance - i * 0.3),
    });
  }
  return days;
}

export function calculateHealthStability(input: HealthInput): number {
  let score = 100;
  const bp = classifyBP(input.systolic, input.diastolic);
  if (bp.stage !== "Normal") score -= 20;
  if (input.bmi < 18.5 || input.bmi > 30) score -= 15;
  else if (input.bmi > 25) score -= 8;
  if (input.sleepHours < 6 || input.sleepHours > 9) score -= 10;
  if (input.stressLevel === "High") score -= 15;
  if (!input.physicalActivity) score -= 10;
  if (input.cholesterol > 240) score -= 10;
  if (input.bloodSugar > 126) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function detectBPPattern(systolic: number, diastolic: number): string[] {
  const patterns: string[] = [];
  if (systolic > 135 && diastolic < 85) patterns.push("Isolated Systolic Hypertension");
  if (systolic > 140) patterns.push("Morning Surge Risk");
  if (diastolic > 90) patterns.push("Nocturnal Hypertension Risk");
  if (systolic - diastolic > 60) patterns.push("Wide Pulse Pressure");
  if (patterns.length === 0) patterns.push("No concerning patterns detected");
  return patterns;
}

export function predictBloodGroup(parent1: string, parent2: string): string[] {
  const alleles: Record<string, string[]> = {
    "A": ["A", "O"], "B": ["B", "O"], "AB": ["A", "B"], "O": ["O", "O"]
  };
  const a1 = alleles[parent1] || ["O", "O"];
  const a2 = alleles[parent2] || ["O", "O"];
  const possible = new Set<string>();
  for (const g1 of a1) {
    for (const g2 of a2) {
      const combo = [g1, g2].sort().join("");
      if (combo === "OO") possible.add("O");
      else if (combo === "AO" || combo === "AA") possible.add("A");
      else if (combo === "BO" || combo === "BB") possible.add("B");
      else if (combo === "AB") possible.add("AB");
    }
  }
  return Array.from(possible);
}

export function calculateIdealWeight(heightCm: number, gender: string): number {
  const heightIn = heightCm / 2.54;
  if (gender === "Male") return Math.round((50 + 2.3 * (heightIn - 60)) * 10) / 10;
  return Math.round((45.5 + 2.3 * (heightIn - 60)) * 10) / 10;
}

export function interpretBMI(bmi: number): { category: string; color: string } {
  if (bmi < 18.5) return { category: "Underweight", color: "warning" };
  if (bmi < 25) return { category: "Normal", color: "success" };
  if (bmi < 30) return { category: "Overweight", color: "warning" };
  return { category: "Obese", color: "danger" };
}

export function estimateBodyFat(weight: number, age: number, gender: string, bmi: number): number {
  if (gender === "Male") return Math.round((1.20 * bmi + 0.23 * age - 16.2) * 10) / 10;
  return Math.round((1.20 * bmi + 0.23 * age - 5.4) * 10) / 10;
}

export function calculateSodiumLimit(systolic: number): number {
  if (systolic >= 140) return 1500;
  if (systolic >= 130) return 1800;
  return 2300;
}

export function calculateWaterRequirement(weightKg: number): number {
  return Math.round(weightKg * 0.033 * 10) / 10;
}

export function calculateGeneticRisk(familyHistory: boolean, age: number, bmi: number): number {
  let risk = 0;
  if (familyHistory) risk += 35;
  if (age > 55) risk += 20;
  else if (age > 40) risk += 10;
  if (bmi > 30) risk += 15;
  else if (bmi > 25) risk += 8;
  return Math.min(100, risk);
}

export function calculateMetabolicRisk(bmi: number, cholesterol: number, bloodSugar: number): number {
  let risk = 0;
  if (bmi > 30) risk += 30;
  else if (bmi > 25) risk += 15;
  if (cholesterol > 240) risk += 25;
  else if (cholesterol > 200) risk += 12;
  if (bloodSugar > 126) risk += 30;
  else if (bloodSugar > 100) risk += 15;
  return Math.min(100, risk);
}

export function calculateHealthReadiness(input: HealthInput): number {
  const stability = calculateHealthStability(input);
  const risk = calculateRiskScore(input);
  const sleepScore = input.sleepHours >= 7 && input.sleepHours <= 9 ? 100 : Math.max(0, 100 - Math.abs(input.sleepHours - 8) * 20);
  return Math.round((stability * 0.4 + (100 - risk) * 0.4 + sleepScore * 0.2));
}

export function getRiskColor(score: number): string {
  if (score <= 30) return "success";
  if (score <= 60) return "warning";
  return "danger";
}

export function getWeatherRisk(temp: number, humidity: number): { risk: string; color: string; score: number } {
  let score = 0;
  if (temp > 35) score += 30;
  else if (temp > 30) score += 15;
  else if (temp < 5) score += 25;
  else if (temp < 10) score += 12;
  if (humidity > 80) score += 20;
  else if (humidity > 60) score += 10;
  if (humidity < 20) score += 15;
  const risk = score <= 20 ? "Low" : score <= 45 ? "Moderate" : "High";
  const color = score <= 20 ? "success" : score <= 45 ? "warning" : "danger";
  return { risk, color, score: Math.min(100, score) };
}
