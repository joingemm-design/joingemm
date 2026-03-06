import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

const data = [{ v: 100 }, { v: 400 }, { v: 300 }, { v: 900 }, { v: 700 }, { v: 1400 }];

export default function RevenueGraph() {
  return (
    <div className="w-full h-full p-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={4} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}