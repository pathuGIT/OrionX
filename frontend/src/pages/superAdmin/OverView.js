import React, { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { OverViewService } from '../../services/OverViewService';

// Simple inline Card component
const Card = ({ title, children }) => (
  <div className="bg-white p-4 rounded-2xl shadow">
    <h4 className="text-sm font-medium text-gray-500">{title}</h4>
    <div className="mt-2 text-2xl font-bold">{children}</div>
  </div>
)

// helper to map "2025-06" → { year: "2025", month: "Jun" }
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function parseYearMonth(ym) {
  const [year, m] = ym.split('-')
  const idx = parseInt(m, 10) - 1
  return { year, month: monthNames[idx] }
}

const OverView = () => {
  const [kpis, setKpis] = useState({
    totalBookings: 0,
    upcomingEvents: 0,
    monthlyRevenue: 0,
    totalCustomers: 0,
  })
  // pivoted: [ { month: 'Jan', '2024': 12000, '2025': 15000 }, … ]
  const [revenueData, setRevenueData] = useState([])
  const [years, setYears] = useState([])

  useEffect(() => {
    // fetch KPI cards
    OverViewService.getKpis()
      .then(setKpis)
      .catch(console.error);

    // fetch revenue trend
    OverViewService.getRevenueTrend()
      .then(raw => {
        //
        // raw should be an array of { month: "YYYY-MM", total_price: number }
        //
        const byMonth = {}     // temp map monthName → { month, [year]: revenue }
        const seenYears = new Set()

        raw.forEach(({ month: ym, total_price }) => {
          const { year, month } = parseYearMonth(ym)
          seenYears.add(year)

          if (!byMonth[month]) {
            byMonth[month] = { month }
          }
          // assign revenue under its year key
          byMonth[month][year] = total_price
        })

        // ensure all months appear in calendar order (Jan–Dec)
        const fullMonths = monthNames.map(m => byMonth[m] || { month: m })
        setRevenueData(fullMonths)
        setYears(Array.from(seenYears).sort())
      })
      .catch(console.error)
  }, [])

  // Compute max revenue value for YAxis
  const maxRevenue = React.useMemo(() => {

    const maxValue = Math.max(
      ...revenueData.flatMap(obj =>
        Object.entries(obj)
          .filter(([key]) => /^\d{4}$/.test(key)) // Only year keys like '2024', '2025'
          .map(([, value]) => parseFloat(value))
      )
    );
    return maxValue
  }, [revenueData, years])

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Bookings">{kpis.totalBookings}</Card>
        <Card title="Upcoming Events">{kpis.upcomingEvents}</Card>
        <Card title="Revenue (This Month)">Rs.{kpis.monthlyRevenue}</Card>
        <Card title="Total Customers">{kpis.totalCustomers}</Card>
      </div>

      {/* Revenue Trend Chart */}
      <div>
        <h3 className="text-lg font-medium mb-2">Revenue by Month</h3>
        <div className="bg-white p-4 rounded-2xl shadow">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={revenueData}
              margin={{ top: 20, right: 40, left: 40, bottom: 20 }}
            >
              <XAxis dataKey="month" />
              <YAxis
                domain={[0, maxRevenue ? Math.ceil(maxRevenue * 1.1) : 1000]}
                width={90}
                tickCount={8} // Suggests 8 ticks for more granularity
              />
              <Tooltip />
              <Legend verticalAlign="top" />
              {years.map(year => (
                <Line
                  key={year}
                  type="monotone"
                  dataKey={year}
                  name={year}
                  strokeWidth={3}
                  stroke={
                    year === String(new Date().getFullYear())
                      ? "#2563eb" // blue for current year
                      : "#a3a3a3" // grey for past years
                  }
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-medium mb-2">Recent Bookings</h3>
        {/* TODO: fetch & render a simple table here */}
      </div>
    </div>
  )
}

export default OverView
