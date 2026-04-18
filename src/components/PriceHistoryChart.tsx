'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PricePoint {
  price: number;
  currency: string;
  recordedAt: string;
}

interface PriceHistoryChartProps {
  data: PricePoint[];
}

export default function PriceHistoryChart({ data }: PriceHistoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-700/50 rounded-xl">
        <p className="text-slate-400">Zatiaľ nie sú žiadne dáta</p>
      </div>
    );
  }

  const formattedData = data.map((point) => ({
    ...point,
    date: new Date(point.recordedAt).toLocaleDateString('sk-SK', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }),
    fullDate: new Date(point.recordedAt).toLocaleString('sk-SK', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }));

  const currency = data[0]?.currency || 'EUR';

  return (
    <div className="bg-slate-700/50 rounded-xl p-4">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12}
            tickLine={false}
            domain={['dataMin - 10', 'dataMax + 10']}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#f8fafc',
            }}
            labelStyle={{ color: '#f8fafc' }}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#10b981' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}