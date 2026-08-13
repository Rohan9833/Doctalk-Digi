import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "12 May", starts: 4000, completions: 2500 },
  { name: "13 May", starts: 5300, completions: 3300 },
  { name: "14 May", starts: 6200, completions: 4100 },
  { name: "15 May", starts: 7800, completions: 5400 },
  { name: "16 May", starts: 6500, completions: 4300 },
  { name: "17 May", starts: 6100, completions: 3800 },
  { name: "18 May", starts: 3700, completions: 2500 },
];

function QuizChart() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border w-full">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Quiz Activity Over Time
        </h2>
        <div className="border rounded-lg px-3 py-1 text-sm text-gray-600">
          Last 7 Days
        </div>
      </div>

      {/* Chart — no wrapper div, just ResponsiveContainer with fixed height */}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="starts" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="completions" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}

export default QuizChart;