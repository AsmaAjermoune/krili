"use client";

import { memo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  enAttente: number;
  enCours: number;
  terminees: number;
}

const STATUS_CONFIG = [
  { label: "En attente", color: "#f59e0b" },
  { label: "En cours", color: "#3b82f6" },
  { label: "Terminées", color: "#22c55e" },
];

export default memo(function StatusDonutChart({ enAttente, enCours, terminees }: Props) {
  const values = [enAttente, enCours, terminees];
  const total = values.reduce((s, v) => s + v, 0);
  const data = STATUS_CONFIG.map((s, i) => ({ ...s, value: values[i] })).filter((d) => d.value > 0);

  if (total === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-slate-400">Aucune location pour le moment</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={74}
              paddingAngle={3}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "none",
                borderRadius: 12,
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                fontSize: 12,
              }}
              formatter={(value, name) => [value, name]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-[#0f172a]">{total}</span>
          <span className="text-[11px] text-slate-400">locations</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 pb-1 pt-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
            <span className="text-xs text-slate-500">{d.label}</span>
            <span className="text-xs font-semibold text-[#0f172a]">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
