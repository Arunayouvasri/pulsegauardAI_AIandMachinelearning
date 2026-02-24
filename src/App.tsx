import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "@/pages/Index";
import HealthAssessment from "@/pages/HealthAssessment";
import Analysis from "@/pages/Analysis";
import Calculators from "@/pages/Calculators";
import WeatherRisk from "@/pages/WeatherRisk";
import ProgressTracker from "@/pages/ProgressTracker";
import ReportPage from "@/pages/ReportPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assessment" element={<HealthAssessment />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/weather" element={<WeatherRisk />} />
            <Route path="/progress" element={<ProgressTracker />} />
            <Route path="/report" element={<ReportPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
