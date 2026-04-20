"use client";

import { memo, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { type Location } from "@/lib/api";

interface Props {
  locations: Location[];
}

function buildMonthly(locations: Location[]) {
  const map = new Map<string, number>();
  for (const loc of locations) {
    const d = new Date(loc.dateDebut);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map.set(key, (map.get(key) ?? 0) + loc.montantLocation);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, total]) => {
      const [y, m] = key.split("-");
      return {
        label: new Date(Number(y), Number(m) - 1).toLocaleDateString("fr-MA", { month: "short" }),
        total,
      };
    });
}

export default memo(function SpendingChart({ locations }: Props) {
  const data = useMemo(() => buildMonthly(locations), [locations]);

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-slate-400">Effectuez des locations pour voir vos dépenses</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff6700" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#ff6700" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => (v >= 1000 ? `${v / 1000}k` : String(v))}
        />
        <Tooltip
          contentStyle={{
            background: "#fff",
            border: "none",
            borderRadius: 12,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            fontSize: 12,
          }}
          formatter={(value) => {
            const n = typeof value === "number" ? value : Number(value);
            return [
              new Intl.NumberFormat("fr-MA", {
                style: "currency",
                currency: "MAD",
                maximumFractionDigits: 0,
              }).format(n),
              "Dépenses",
            ];
          }}
          labelStyle={{ color: "#0f172a", fontWeight: 600, marginBottom: 4 }}
          cursor={{ stroke: "#ff6700", strokeWidth: 1, strokeDasharray: "4 4" }}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#ff6700"
          strokeWidth={2.5}
          fill="url(#spendGrad)"
          dot={{ r: 4, fill: "#ff6700", stroke: "#fff", strokeWidth: 2 }}
          activeDot={{ r: 6, fill: "#ff6700", stroke: "#fff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
});
