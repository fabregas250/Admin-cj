import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { formatDate, formatCurrency } from '../utils/formatters'
import toast from 'react-hot-toast'
import { ArrowLeft, Ban, CheckCircle, Smartphone, Wallet, Calendar } from 'lucide-react'

export default function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserDetails()
  }, [id])

  const fetchUserDetails = async () => {
    setLoading(true)
    try {
      const [userResponse, devicesResponse] = await Promise.all([
        api.get(`/admin/users/${id}`),
        api.get(`/admin/users/${id}/devices`),
      ])
      setUser(userResponse.data.data)
      setDevices(devicesResponse.data.data || [])
    } catch (error) {
      toast.error('Failed to fetch user details')
      navigate('/users')
    } finally {
      setLoading(false)
    }
  }

  const handleActivate = async () => {
    try {
      const endpoint = user.isActive ? 'deactivate' : 'activate'
      await api.put(`/admin/users/${id}/${endpoint}`)
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`)
      fetchUserDetails()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate('/users')}>
          <ArrowLeft size={18} className="mr-2" />
          Back to Users
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info */}
        <Card title="User Information" className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-text-secondary">Full Name</p>
                <p className="text-lg font-semibold text-text-primary">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary mb-1">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">Phone</p>
                <p className="font-medium">{user.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">Joined</p>
                <p className="font-medium">{formatDate(user.createdAt, 'PPp')}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">Last Updated</p>
                <p className="font-medium">{formatDate(user.updatedAt, 'PPp')}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant={user.isActive ? 'danger' : 'success'}
                onClick={handleActivate}
                className="w-full"
              >
                {user.isActive ? (
                  <>
                    <Ban size={18} className="mr-2" />
                    Deactivate User
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} className="mr-2" />
                    Activate User
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Account Info */}
        <Card title="Account Information">
          {user.account ? (
            <div className="space-y-4">
              <div className="p-4 bg-primary-50 rounded-lg">
                <p className="text-sm text-text-secondary mb-1">Account Number</p>
                <p className="text-xl font-bold text-primary-600">{user.account.accountNumber}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">Balance</p>
                <p className="text-2xl font-bold text-text-primary">
                  {formatCurrency(user.account.balance)}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">Currency</p>
                <p className="font-medium">{user.account.currency}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.account.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.account.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-text-secondary">No account found</p>
          )}
        </Card>
      </div>

      {/* Devices */}
      <Card title="Registered Devices">
        {devices.length > 0 ? (
          <div className="space-y-3">
            {devices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Smartphone className="text-primary-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">{device.deviceName || 'Unknown Device'}</p>
                    <p className="text-sm text-text-secondary">{device.deviceId}</p>
                    <p className="text-xs text-text-secondary">
                      Last used: {formatDate(device.lastUsedAt)}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  device.isVerified
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {device.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-text-secondary">No devices registered</p>
        )}
      </Card>
    </div>
  )
}
