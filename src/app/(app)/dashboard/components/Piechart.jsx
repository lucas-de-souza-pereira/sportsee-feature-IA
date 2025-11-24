"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#0B23F4", "#B6BDFC"];

export default function Piechart({ done, goal }) {
  const remaining = Math.max(goal - done, 0);

  if (!done) {
    return (
      <div className="card h-full w-full flex items-center justify-center">
      <p>Pas de courses cette semaine !</p>
      </div>
      )

  }
  const data = [
    { name: "Réalisées", value: done },
    { name: "Restants", value: remaining },
  ];

  const ROTATION = 270
  return (
    <div className="card px-9.5 pt-4 pb-9.5 min-w-[450px]">
      <p className="text-lg">
        <span className="typo-xl text-primary">x{done}</span>{" "}
        <span className="text-[#B6BDFC] typo-base">sur objectif de {goal}</span>
      </p>
      <p className="text-sm text-tertiary mt-1">
        Courses hebdomadaires réalisées
      </p>

      <div className="relative h-41 w-66 m-auto mt-6 flex items-center justify-center">
        <div className=" h-41 w-41">
          {/* Donut */}
          <ResponsiveContainer width="100%" height="100%" initialDimension={ { width: 164, height: 164 } }>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius="50%"
                outerRadius="100%"
                startAngle={90 + ROTATION}
                endAngle={-270 + ROTATION}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Légende "x restants" en haut à droite */}
          <div className="absolute top-2 right-5 flex items-center gap-1 text-[10px] text-tertiary">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#B6BDFC]" />
            <span>{remaining} restants</span>
          </div>

          {/* Légende "y réalisées" en bas à gauche */}
          <div className="absolute bottom-6 left-0 flex items-center gap-1 text-[10px] text-tertiary">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary" />
            <span>{done} réalisées</span>
          </div>
        </div>
      </div>
    </div>
  );
}
