import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { HealthInput } from "@/lib/health-utils";
import { setHealthData, addProgressEntry } from "@/lib/health-store";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

function FieldTip({ tip }: { tip: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="ml-1 inline h-3.5 w-3.5 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[200px] text-xs">{tip}</TooltipContent>
    </Tooltip>
  );
}

const defaultValues: HealthInput = {
  systolic: 120, diastolic: 80, heartRate: 72, bmi: 24, cholesterol: 190,
  bloodSugar: 95, sleepHours: 7, stressLevel: "Medium", saltIntake: "Medium",
  physicalActivity: true, familyHistory: false, height: 170, gender: "Male",
  weight: 70, age: 30, parentBloodGroup1: "A", parentBloodGroup2: "B",
};

export default function HealthAssessment() {
  const [form, setForm] = useState<HealthInput>(defaultValues);
  const navigate = useNavigate();
  const { toast } = useToast();

  const update = (key: keyof HealthInput, value: any) => setForm((p) => ({ ...p, [key]: value }));
  const numField = (key: keyof HealthInput, label: string, tip: string, unit?: string) => (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}{unit && <span className="text-muted-foreground"> ({unit})</span>}<FieldTip tip={tip} /></Label>
      <Input type="number" value={form[key] as number} onChange={(e) => update(key, parseFloat(e.target.value) || 0)} className="h-9" />
    </div>
  );

  const handleSubmit = () => {
    if (form.systolic < 60 || form.diastolic < 40) {
      toast({ title: "Invalid Input", description: "Please enter valid BP values.", variant: "destructive" });
      return;
    }
    setHealthData(form);
    addProgressEntry(form);
    toast({ title: "Assessment Saved", description: "View your analysis results." });
    navigate("/analysis");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-3xl space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Blood Pressure & Vitals</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {numField("systolic", "Systolic BP", "Upper number in BP reading", "mmHg")}
          {numField("diastolic", "Diastolic BP", "Lower number in BP reading", "mmHg")}
          {numField("heartRate", "Heart Rate", "Resting heart rate", "bpm")}
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Body Metrics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {numField("bmi", "BMI", "Body Mass Index. Normal: 18.5-24.9")}
          {numField("height", "Height", "Your height", "cm")}
          {numField("weight", "Weight", "Your weight", "kg")}
          {numField("age", "Age", "Your current age", "years")}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Gender</Label>
            <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Health Indicators</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {numField("cholesterol", "Cholesterol", "Total cholesterol level", "mg/dL")}
          {numField("bloodSugar", "Blood Sugar", "Fasting blood sugar", "mg/dL")}
          {numField("sleepHours", "Sleep Hours", "Average hours of sleep per night", "hrs")}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Stress Level<FieldTip tip="Your perceived stress level" /></Label>
            <Select value={form.stressLevel} onValueChange={(v) => update("stressLevel", v)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Salt Intake<FieldTip tip="Daily sodium intake level" /></Label>
            <Select value={form.saltIntake} onValueChange={(v) => update("saltIntake", v)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Lifestyle & History</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label className="text-xs">Physical Activity<FieldTip tip="Do you exercise regularly?" /></Label>
            <Switch checked={form.physicalActivity} onCheckedChange={(v) => update("physicalActivity", v)} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label className="text-xs">Family History of BP<FieldTip tip="Do your parents or siblings have hypertension?" /></Label>
            <Switch checked={form.familyHistory} onCheckedChange={(v) => update("familyHistory", v)} />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Blood Group Finder</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Parent 1 Blood Group</Label>
            <Select value={form.parentBloodGroup1} onValueChange={(v) => update("parentBloodGroup1", v)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["A", "B", "AB", "O"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Parent 2 Blood Group</Label>
            <Select value={form.parentBloodGroup2} onValueChange={(v) => update("parentBloodGroup2", v)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["A", "B", "AB", "O"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSubmit} className="w-full" size="lg">
        Submit Health Assessment
      </Button>
    </motion.div>
  );
}
