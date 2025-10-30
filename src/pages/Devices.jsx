import { useState, useEffect } from 'react'
import api from '../services/api'
import Card from '../components/common/Card'
import Table from '../components/common/Table'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Pagination from '../components/common/Pagination'
import { formatDate } from '../utils/formatters'
import toast from 'react-hot-toast'
import { Search, CheckCircle, XCircle, Smartphone } from 'lucide-react'

export default function Devices() {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterVerified, setFilterVerified] = useState('all')
  const pageSize = 10

  useEffect(() => {
    fetchDevices()
  }, [currentPage, searchTerm, filterVerified])

  const fetchDevices = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
        verified: filterVerified !== 'all' ? filterVerified === 'verified' : undefined,
      }
      const response = await api.get('/admin/devices', { params })
      setDevices(response.data.data.devices)
      setTotalPages(response.data.data.totalPages)
      setTotalItems(response.data.data.totalItems)
    } catch (error) {
      toast.error('Failed to fetch devices')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (deviceId, isVerified) => {
    try {
      const endpoint = isVerified ? 'unverify' : 'verify'
      await api.put(`/admin/devices/${deviceId}/${endpoint}`)
      toast.success(`Device ${isVerified ? 'unverified' : 'verified'} successfully`)
      fetchDevices()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const columns = [
    {
      header: 'Device',
      accessor: 'device',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Smartphone className="text-primary-600" size={18} />
          </div>
          <div>
            <div className="font-medium text-text-primary">
              {row.deviceName || 'Unknown Device'}
            </div>
            <div className="text-sm text-text-secondary font-mono text-xs">
              {row.deviceId.substring(0, 20)}...
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'User',
      accessor: 'user',
      render: (row) => (
        <div>
          <div className="font-medium text-text-primary">
            {row.user?.firstName} {row.user?.lastName}
          </div>
          <div className="text-sm text-text-secondary">{row.user?.email}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'isVerified',
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.isVerified
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {row.isVerified ? 'Verified' : 'Pending'}
        </span>
      ),
    },
    {
      header: 'Last Used',
      accessor: 'lastUsedAt',
      render: (row) => formatDate(row.lastUsedAt, 'PPp'),
    },
    {
      header: 'Registered',
      accessor: 'createdAt',
      render: (row) => formatDate(row.createdAt, 'MMM d, yyyy'),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          {!row.isVerified ? (
            <button
              onClick={() => handleVerify(row.id, row.isVerified)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Verify Device"
            >
              <CheckCircle size={18} />
            </button>
          ) : (
            <button
              onClick={() => handleVerify(row.id, row.isVerified)}
              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              title="Unverify Device"
            >
              <XCircle size={18} />
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Devices</h1>
        <p className="text-text-secondary">Manage and verify client devices</p>
      </div>

      <Card>
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
            <Input
              type="text"
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10"
            />
          </div>
          <select
            value={filterVerified}
            onChange={(e) => {
              setFilterVerified(e.target.value)
              setCurrentPage(1)
            }}
            className="input-field w-full sm:w-auto"
          >
            <option value="all">All Devices</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>
        </div>

        <Table
          columns={columns}
          data={devices}
          loading={loading}
          emptyMessage="No devices found"
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>
    </div>
  )
}
