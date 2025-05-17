import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

// Simple inline Card component in case you don't have one yet
const Card = ({ title, children }) => (
  <div className="bg-white p-4 rounded-2xl shadow">
    <h4 className="text-sm font-medium text-gray-500">{title}</h4>
    <div className="mt-2 text-2xl font-bold">{children}</div>
  </div>
)

const OverView = () => {
  const [kpis, setKpis] = useState({
    totalBookings: 0,
    upcomingEvents: 0,
    monthlyRevenue: 0,
    totalCustomers: 0,
  })
  const [revenueData, setRevenueData] = useState([])

  useEffect(() => {
    axios.get('/api/admin/overview/kpis')
      .then(res => setKpis(res.data))
      .catch(console.error)

    axios.get('/api/admin/overview/revenue-trend')
      .then(res => setRevenueData(res.data))
      .catch(console.error)
  }, [])

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
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3182ce" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bookings Table (you can flesh this out next) */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-medium mb-2">Recent Bookings</h3>
        {/* TODO: fetch & render a simple table here */}
      </div>
    </div>
  )
}

export default OverView
