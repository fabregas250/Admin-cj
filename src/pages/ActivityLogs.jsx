import { useState, useEffect } from 'react'
import api from '../services/api'
import Card from '../components/common/Card'
import Table from '../components/common/Table'
import Input from '../components/common/Input'
import Pagination from '../components/common/Pagination'
import { formatDate } from '../utils/formatters'
import { Search, Filter } from 'lucide-react'

export default function ActivityLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState('all')
  const pageSize = 20

  useEffect(() => {
    fetchLogs()
  }, [currentPage, searchTerm, filterAction])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
        action: filterAction !== 'all' ? filterAction : undefined,
      }
      const response = await api.get('/admin/activity-logs', { params })
      setLogs(response.data.data.logs)
      setTotalPages(response.data.data.totalPages)
      setTotalItems(response.data.data.totalItems)
    } catch (error) {
      console.error('Failed to fetch activity logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      header: 'Timestamp',
      accessor: 'createdAt',
      render: (row) => (
        <div>
          <div className="font-medium">{formatDate(row.createdAt, 'PPp')}</div>
        </div>
      ),
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row) => (
        <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
          {row.action}
        </span>
      ),
    },
    {
      header: 'Admin',
      accessor: 'admin',
      render: (row) => (
        <div>
          <div className="font-medium">{row.adminUser?.email || 'System'}</div>
          {row.adminUser?.role && (
            <div className="text-sm text-text-secondary capitalize">{row.adminUser.role}</div>
          )}
        </div>
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => (
        <div className="max-w-md">
          <p className="text-sm">{row.description}</p>
          {row.metadata && (
            <p className="text-xs text-text-secondary mt-1">
              {JSON.stringify(row.metadata)}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'IP Address',
      accessor: 'ipAddress',
      render: (row) => <span className="text-sm font-mono">{row.ipAddress || 'N/A'}</span>,
    },
  ]

  const actionTypes = [
    'all',
    'USER_ACTIVATED',
    'USER_DEACTIVATED',
    'DEVICE_VERIFIED',
    'DEVICE_UNVERIFIED',
    'NOTIFICATION_SENT',
    'ACCOUNT_ACTIVATED',
    'ACCOUNT_DEACTIVATED',
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Activity Logs</h1>
        <p className="text-text-secondary">System activity and audit trail</p>
      </div>

      <Card>
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
            <Input
              type="text"
              placeholder="Search logs..."
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
          data={logs}
          loading={loading}
          emptyMessage="No activity logs found"
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
