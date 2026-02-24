import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { getHealthData } from "@/lib/health-store";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  classifyBP, calculateRiskScore, calculateHealthStability, calculateHealthReadiness,
  interpretBMI, estimateBodyFat, calculateIdealWeight, calculateWaterRequirement,
  calculateSodiumLimit, calculateGeneticRisk, calculateMetabolicRisk, getHealthInsights,
  detectBPPattern, predictBloodGroup,
} from "@/lib/health-utils";
import jsPDF from "jspdf";

export default function ReportPage() {
  const data = getHealthData();
  const navigate = useNavigate();

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-muted-foreground">No health data. Complete an assessment first.</p>
        <Button onClick={() => navigate("/assessment")}>Go to Assessment</Button>
      </div>
    );
  }

  const generatePDF = () => {
    const doc = new jsPDF();
    const bp = classifyBP(data.systolic, data.diastolic);
    const risk = calculateRiskScore(data);
    const stability = calculateHealthStability(data);
    const readiness = calculateHealthReadiness(data);
    const bmiResult = interpretBMI(data.bmi);
    const bodyFat = estimateBodyFat(data.weight, data.age, data.gender, data.bmi);
    const idealWeight = calculateIdealWeight(data.height, data.gender);
    const water = calculateWaterRequirement(data.weight);
    const sodium = calculateSodiumLimit(data.systolic);
    const genetic = calculateGeneticRisk(data.familyHistory, data.age, data.bmi);
    const metabolic = calculateMetabolicRisk(data.bmi, data.cholesterol, data.bloodSugar);
    const insights = getHealthInsights(data);
    const patterns = detectBPPattern(data.systolic, data.diastolic);
    const bloodGroups = predictBloodGroup(data.parentBloodGroup1 || "A", data.parentBloodGroup2 || "B");

    let y = 20;
    const addLine = (text: string, size = 10, bold = false) => {
      doc.setFontSize(size);
      if (bold) doc.setFont("helvetica", "bold");
      else doc.setFont("helvetica", "normal");
      doc.text(text, 20, y);
      y += size * 0.5 + 3;
      if (y > 270) { doc.addPage(); y = 20; }
    };

    addLine("PulseGuard AI — Health Report", 18, true);
    addLine(`Generated: ${new Date().toLocaleDateString()}`, 9);
    y += 5;

    addLine("PATIENT DATA", 12, true);
    addLine(`Age: ${data.age} | Gender: ${data.gender} | Height: ${data.height}cm | Weight: ${data.weight}kg`);
    addLine(`BMI: ${data.bmi} (${bmiResult.category}) | Heart Rate: ${data.heartRate} bpm`);
    y += 3;

    addLine("BLOOD PRESSURE ANALYSIS", 12, true);
    addLine(`BP: ${data.systolic}/${data.diastolic} mmHg — ${bp.stage}`);
    addLine(`Risk Score: ${risk}/100 | Stability: ${stability}% | Readiness: ${readiness}%`);
    addLine(`Patterns: ${patterns.join(", ")}`);
    y += 3;

    addLine("HEALTH METRICS", 12, true);
    addLine(`Body Fat: ${bodyFat}% | Ideal Weight: ${idealWeight}kg`);
    addLine(`Cholesterol: ${data.cholesterol} mg/dL | Blood Sugar: ${data.bloodSugar} mg/dL`);
    addLine(`Daily Water: ${water}L | Sodium Limit: ${sodium}mg`);
    addLine(`Genetic Risk: ${genetic}% | Metabolic Risk: ${metabolic}%`);
    addLine(`Sleep: ${data.sleepHours}h | Stress: ${data.stressLevel} | Salt: ${data.saltIntake}`);
    addLine(`Physical Activity: ${data.physicalActivity ? "Yes" : "No"} | Family History: ${data.familyHistory ? "Yes" : "No"}`);
    addLine(`Blood Group (offspring): ${bloodGroups.join(", ")}`);
    y += 3;

    addLine("RECOMMENDATIONS", 12, true);
    insights.forEach((ins) => addLine(`${ins.icon} ${ins.category}: ${ins.message}`));

    addLine("", 10);
    addLine("This report is for informational purposes only. Consult a healthcare professional.", 8);

    doc.save("PulseGuard_Health_Report.pdf");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-xl space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-sm">Download Health Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Generate a comprehensive PDF report with all your health metrics, BP analysis,
            risk scores, personalized insights, and recommendations.
          </p>
          <div className="rounded-lg border p-4 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Report includes:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Blood pressure classification & staging</li>
              <li>Risk prediction score & health stability</li>
              <li>Body metrics (BMI, body fat, ideal weight)</li>
              <li>Cholesterol & blood sugar analysis</li>
              <li>Genetic & metabolic risk indices</li>
              <li>Personalized health recommendations</li>
              <li>BP patterns & blood group prediction</li>
            </ul>
          </div>
          <Button onClick={generatePDF} className="w-full gap-2" size="lg">
            <FileDown className="h-4 w-4" />
            Download PDF Report
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
