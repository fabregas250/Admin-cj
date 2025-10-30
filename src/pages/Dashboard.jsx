import { useState, useEffect } from 'react'
import api from '../services/api'
import Card from '../components/common/Card'
import { 
  Users, 
  Smartphone, 
  Wallet, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { formatCurrency, formatDate } from '../utils/formatters'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalAccounts: 0,
    totalBalance: 0,
    pendingDevices: 0,
    totalTransactions: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats')
      setStats(response.data.data.stats)
      setRecentActivity(response.data.data.recentActivity || [])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending Devices',
      value: stats.pendingDevices,
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Total Balance',
      value: formatCurrency(stats.totalBalance),
      icon: Wallet,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-secondary">Overview of your system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className="hover:shadow-banking-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {loading ? '...' : stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`${stat.color} w-6 h-6`} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <Card title="Recent Activity">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {activity.description}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {formatDate(activity.createdAt)}
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-gray-200 rounded-full text-text-secondary">
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-text-secondary">No recent activity</p>
        )}
      </Card>
    </div>
  )
}
