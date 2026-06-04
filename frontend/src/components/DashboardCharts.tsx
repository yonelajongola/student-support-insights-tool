import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { DashboardSummary } from "../types/models";
import { VisibleChartKey } from "../types/settings";

type Props = {
  dashboard: DashboardSummary;
  visibleCharts: Record<VisibleChartKey, boolean>;
};

type ChartDatum = {
  name: string;
  value: number;
};

const palette = ["#00288e", "#1e40af", "#505f76", "#ba1a1a", "#16a34a", "#f97316"];
const riskPalette: Record<string, string> = {
  Low: "#16a34a",
  Medium: "#2563eb",
  High: "#f97316",
  Critical: "#ba1a1a"
};
const internetOrder = ["Reliable", "Unstable", "Limited"];

function toChartData(source: Record<string, number>, preferredOrder?: string[]) {
  const entries = Object.entries(source ?? {}).map(([name, value]) => ({ name, value }));

  if (!preferredOrder) {
    return entries.sort((left, right) => right.value - left.value);
  }

  return entries.sort((left, right) => preferredOrder.indexOf(left.name) - preferredOrder.indexOf(right.name));
}

function normalizeSupportNeeds(source: Record<string, number>) {
  const normalized = new Map<string, number>();

  for (const [rawName, count] of Object.entries(source ?? {})) {
    const parts = rawName
      .split(/[;,]/)
      .map((value) => value.trim())
      .filter((value) => value.length > 0 && value.toLowerCase() !== "none");

    if (parts.length === 0) {
      normalized.set("None", (normalized.get("None") ?? 0) + count);
      continue;
    }

    for (const part of parts) {
      normalized.set(part, (normalized.get(part) ?? 0) + count);
    }
  }

  return Array.from(normalized.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((left, right) => right.value - left.value);
}

function toProvinceInternetData(source: Record<string, Record<string, number>>) {
  return Object.entries(source ?? {})
    .map(([province, values]) => ({
      province,
      Reliable: values.Reliable ?? 0,
      Unstable: values.Unstable ?? 0,
      Limited: values.Limited ?? 0
    }))
    .sort((left, right) => left.province.localeCompare(right.province));
}

function confidenceData(dashboard: DashboardSummary): ChartDatum[] {
  return [
    { name: "Digital", value: dashboard.averageDigitalConfidence },
    { name: "Programming", value: dashboard.averageProgrammingConfidence },
    { name: "AI Readiness", value: dashboard.averageAiFamiliarity }
  ];
}

function percent(part: number, total: number) {
  if (total === 0) return 0;
  return Math.round((part * 100) / total);
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name?: string; value?: number; dataKey?: string }>; label?: string }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-title">{label ?? payload[0]?.name}</div>
      {payload.map((entry) => (
        <div key={`${entry.dataKey}-${entry.name}`} className="chart-tooltip-value">
          {entry.name ?? entry.dataKey}: {entry.value}
        </div>
      ))}
    </div>
  );
}

function EmptyChart({ text }: { text: string }) {
  return <div className="chart-empty">{text}</div>;
}

export default function DashboardCharts({ dashboard, visibleCharts }: Props) {
  const riskData = toChartData(dashboard.riskCategoryDistribution, ["Low", "Medium", "High", "Critical"]);
  const supportData = normalizeSupportNeeds(dashboard.supportNeedDistribution);
  const deviceData = toChartData(dashboard.deviceAccessDistribution);
  const provinceInternetData = toProvinceInternetData(dashboard.internetAccessByProvince);
  const averages = confidenceData(dashboard);
  const totalRisk = riskData.reduce((sum, item) => sum + item.value, 0);
  const highCritical = riskData.filter((item) => ["High", "Critical"].includes(item.name)).reduce((sum, item) => sum + item.value, 0);
  const totalSupport = supportData.reduce((sum, item) => sum + item.value, 0);
  const totalDevices = deviceData.reduce((sum, item) => sum + item.value, 0);
  const topDevice = deviceData[0];
  const visibleChartCount = Object.values(visibleCharts).filter(Boolean).length;

  return (
    <div className="chart-grid">
      {visibleChartCount === 0 ? <EmptyChart text="All charts are currently hidden by Settings." /> : null}

      {visibleCharts.riskDistribution ? <section className="chart-card chart-risk">
        <div className="chart-card-head">
          <div>
            <h3>Risk Distribution</h3>
            <p>Low, medium, high, and critical risk categories.</p>
          </div>
          <span aria-hidden="true">⋮</span>
        </div>
        <div className="chart-frame">
          {riskData.length ? (
            <ResponsiveContainer>
              <PieChart>
                <Pie data={riskData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={2}>
                  {riskData.map((entry) => <Cell key={entry.name} fill={riskPalette[entry.name] ?? palette[0]} />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : <EmptyChart text="Upload learner data to calculate risk distribution." />}
          {riskData.length ? <div className="donut-center"><strong>{percent(highCritical, totalRisk)}%</strong><span>High/Critical</span></div> : null}
        </div>
        <p className="chart-summary">{highCritical} of {totalRisk} learners are currently marked high or critical.</p>
      </section> : null}

      {visibleCharts.supportNeedsBreakdown ? <section className="chart-card chart-wide">
        <div className="chart-card-head">
          <div>
            <h3>Support Needs by Category</h3>
            <p>Support demand across transport, data, academic support and mentoring.</p>
          </div>
        </div>
        <div className="chart-frame">
          {supportData.length ? (
            <ResponsiveContainer>
              <BarChart data={supportData} margin={{ top: 18, right: 16, left: 0, bottom: 18 }}>
                <CartesianGrid strokeDasharray="2 6" stroke="#d8dadc" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="value" fill="#00288e" radius={[2, 2, 0, 0]} name="Learners">
                  <LabelList dataKey="value" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyChart text="Support needs appear after learner data is loaded." />}
        </div>
        <p className="chart-summary">{totalSupport} support need entries are represented in this chart.</p>
      </section> : null}

      {visibleCharts.deviceAccessDistribution ? <section className="chart-card">
        <div className="chart-card-head">
          <div>
            <h3>Device Access</h3>
            <p>Main device access pattern for the cohort.</p>
          </div>
        </div>
        <div className="chart-frame small-chart">
          {deviceData.length ? (
            <ResponsiveContainer>
              <PieChart>
                <Pie data={deviceData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={82} startAngle={180} endAngle={0}>
                  {deviceData.map((entry, index) => <Cell key={entry.name} fill={palette[index % palette.length]} />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : <EmptyChart text="Device access data not available." />}
          {topDevice ? <div className="donut-center bottom-center"><strong>{topDevice.name}</strong><span>{percent(topDevice.value, totalDevices)}% major</span></div> : null}
        </div>
      </section> : null}

      {visibleCharts.internetAccessByProvince ? <section className="chart-card">
        <div className="chart-card-head">
          <div>
            <h3>Internet Stability</h3>
            <p>Reliable, unstable and limited internet by province.</p>
          </div>
        </div>
        <div className="chart-frame small-chart">
          {provinceInternetData.length ? (
            <ResponsiveContainer>
              <BarChart data={provinceInternetData} layout="vertical" margin={{ top: 8, right: 16, left: 36, bottom: 8 }}>
                <CartesianGrid strokeDasharray="2 6" stroke="#d8dadc" />
                <XAxis type="number" allowDecimals={false} hide />
                <YAxis dataKey="province" type="category" width={72} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                {internetOrder.map((key, index) => (
                  <Bar key={key} dataKey={key} stackId="internet" fill={index === 0 ? "#16a34a" : index === 1 ? "#00288e" : "#ba1a1a"} radius={index === internetOrder.length - 1 ? [0, 8, 8, 0] : [0, 0, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyChart text="Internet access data not available." />}
        </div>
      </section> : null}

      {visibleCharts.confidenceComparison ? <section className="chart-card">
        <div className="chart-card-head">
          <div>
            <h3>Confidence Levels</h3>
            <p>Digital, programming and AI confidence scores.</p>
          </div>
        </div>
        <div className="chart-frame small-chart">
          <ResponsiveContainer>
            <BarChart data={averages} margin={{ top: 18, right: 16, left: 0, bottom: 12 }}>
              <CartesianGrid strokeDasharray="2 6" stroke="#d8dadc" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis domain={[0, 5]} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" fill="#00288e" radius={[2, 2, 0, 0]} name="Average score">
                <LabelList dataKey="value" position="top" formatter={(value: number) => value.toFixed(1)} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section> : null}
    </div>
  );
}
