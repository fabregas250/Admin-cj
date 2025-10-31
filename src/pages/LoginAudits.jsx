import { useState, useEffect } from 'react'
import api from '../services/api'
import Card from '../components/common/Card'
import Table from '../components/common/Table'
import Input from '../components/common/Input'
import Pagination from '../components/common/Pagination'
import { formatDate } from '../utils/formatters'
import { Search, Filter, CheckCircle, XCircle, AlertCircle, Shield } from 'lucide-react'

export default function LoginAudits() {
  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState('all')
  const pageSize = 20

  useEffect(() => {
    fetchAudits()
  }, [currentPage, searchTerm, filterAction])

  const fetchAudits = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
        action: filterAction !== 'all' ? filterAction : undefined,
      }
      const response = await api.get('/admin/login-audits', { params })
      setAudits(response.data.data.audits)
      setTotalPages(response.data.data.totalPages)
      setTotalItems(response.data.data.totalItems)
    } catch (error) {
      console.error('Failed to fetch login audits:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActionIcon = (action) => {
    switch (action) {
      case 'LOGIN_SUCCESS':
        return <CheckCircle className="text-green-600" size={18} />
      case 'LOGIN_FAILED':
        return <XCircle className="text-red-600" size={18} />
      case 'NEW_DEVICE_DETECTED':
        return <AlertCircle className="text-yellow-600" size={18} />
      case 'REGISTRATION_SUCCESS':
        return <Shield className="text-blue-600" size={18} />
      default:
        return <AlertCircle className="text-gray-600" size={18} />
    }
  }

  const getActionColor = (action) => {
    switch (action) {
      case 'LOGIN_SUCCESS':
        return 'bg-green-100 text-green-800'
      case 'LOGIN_FAILED':
        return 'bg-red-100 text-red-800'
      case 'NEW_DEVICE_DETECTED':
        return 'bg-yellow-100 text-yellow-800'
      case 'REGISTRATION_SUCCESS':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const columns = [
    {
      header: 'Action',
      accessor: 'action',
      render: (row) => (
        <div className="flex items-center gap-2">
          {getActionIcon(row.action)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(row.action)}`}>
            {row.action.replace(/_/g, ' ')}
          </span>
        </div>
      ),
    },
    {
      header: 'User',
      accessor: 'user',
      render: (row) => (
        <div>
          {row.user ? (
            <>
              <div className="font-medium text-text-primary">
                {row.user.firstName} {row.user.lastName}
              </div>
              <div className="text-sm text-text-secondary">{row.user.email}</div>
            </>
          ) : (
            <div className="text-sm text-text-secondary">{row.email || 'N/A'}</div>
          )}
        </div>
      ),
    },
    {
      header: 'Device',
      accessor: 'device',
      render: (row) => (
        <div>
          {row.device ? (
            <>
              <div className="text-sm font-medium">{row.device.deviceName || 'Unknown'}</div>
              <div className="text-xs text-text-secondary font-mono truncate max-w-[150px]">
                {row.device.deviceId}
              </div>
              <span className={`text-xs px-1 py-0.5 rounded ${
                row.device.isVerified
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {row.device.isVerified ? 'Verified' : 'Pending'}
              </span>
            </>
          ) : (
            <span className="text-sm text-text-secondary">N/A</span>
          )}
        </div>
      ),
    },
    {
      header: 'IP Address',
      accessor: 'ipAddress',
      render: (row) => <span className="font-mono text-sm">{row.ipAddress || 'N/A'}</span>,
    },
    {
      header: 'User Agent',
      accessor: 'userAgent',
      render: (row) => (
        <span className="text-xs text-text-secondary truncate max-w-[200px] block">
          {row.userAgent || 'N/A'}
        </span>
      ),
    },
    {
      header: 'Timestamp',
      accessor: 'createdAt',
      render: (row) => formatDate(row.createdAt, 'PPp'),
    },
    {
      header: 'Metadata',
      accessor: 'metadata',
      render: (row) => (
        row.metadata ? (
          <div className="text-xs text-text-secondary max-w-[200px]">
            {JSON.stringify(row.metadata).substring(0, 50)}...
          </div>
        ) : (
          <span className="text-xs text-text-secondary">N/A</span>
        )
      ),
    },
  ]

  const actionTypes = [
    'all',
    'LOGIN_SUCCESS',
    'LOGIN_FAILED',
    'NEW_DEVICE_DETECTED',
    'REGISTRATION_SUCCESS',
    'REGISTRATION_FAILED',
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Login Audits</h1>
        <p className="text-text-secondary">View client login and registration audit trail</p>
      </div>

      <Card>
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
            <Input
              type="text"
              placeholder="Search by email, name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
            <select
              value={filterAction}
              onChange={(e) => {
                setFilterAction(e.target.value)
                setCurrentPage(1)
              }}
              className="input-field pl-10 w-full sm:w-auto"
            >
              {actionTypes.map((action) => (
                <option key={action} value={action}>
                  {action === 'all' ? 'All Actions' : action.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Table
          columns={columns}
          data={audits}
          loading={loading}
          emptyMessage="No login audits found"
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
