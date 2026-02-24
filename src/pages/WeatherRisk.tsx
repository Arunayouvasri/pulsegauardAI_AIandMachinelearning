import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CloudSun, Thermometer, Droplets, Wind } from "lucide-react";
import { getWeatherRisk } from "@/lib/health-utils";
import { motion } from "framer-motion";

const API_KEY = "6330e121b3e7ac896907ea6242da80e1";

interface WeatherData {
  temp: number;
  humidity: number;
  description: string;
  city: string;
  windSpeed: number;
  feelsLike: number;
}

export default function WeatherRisk() {
  const [city, setCity] = useState("London");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("City not found");
      const d = await res.json();
      setWeather({
        temp: d.main.temp,
        humidity: d.main.humidity,
        description: d.weather[0].description,
        city: d.name,
        windSpeed: d.wind.speed,
        feelsLike: d.main.feels_like,
      });
    } catch {
      setError("Could not fetch weather data. Check city name.");
    }
    setLoading(false);
  };

  const risk = weather ? getWeatherRisk(weather.temp, weather.humidity) : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-2xl space-y-6">
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-sm">Weather-Based Hypertension Risk</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Enter city name" value={city} onChange={(e) => setCity(e.target.value)} className="h-9" onKeyDown={(e) => e.key === "Enter" && fetchWeather()} />
            <Button onClick={fetchWeather} disabled={loading} size="sm">{loading ? "Loading..." : "Check"}</Button>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </CardContent>
      </Card>

      {weather && risk && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{weather.city} Weather</CardTitle>
                <Badge className={`risk-${risk.color}`}>{risk.risk} Risk</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-lg font-bold">{Math.round(weather.temp)}°C</p>
                  <p className="text-[10px] text-muted-foreground">Temperature</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-lg font-bold">{weather.humidity}%</p>
                  <p className="text-[10px] text-muted-foreground">Humidity</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-lg font-bold">{weather.windSpeed} m/s</p>
                  <p className="text-[10px] text-muted-foreground">Wind</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CloudSun className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-lg font-bold">{Math.round(weather.feelsLike)}°C</p>
                  <p className="text-[10px] text-muted-foreground">Feels Like</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader><CardTitle className="text-sm">Environmental BP Risk Score</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className={`text-3xl font-bold text-${risk.color}`}>{risk.score}</span>
                <span className="mb-1 text-sm text-muted-foreground">/100</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className={`h-full rounded-full bg-${risk.color} transition-all`} style={{ width: `${risk.score}%` }} />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {risk.risk === "Low" && "Current weather conditions are favorable for BP management."}
                {risk.risk === "Moderate" && "Take precautions — stay hydrated and avoid extreme exertion."}
                {risk.risk === "High" && "Weather conditions may elevate BP. Stay indoors and monitor closely."}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
