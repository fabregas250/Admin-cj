import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Card from '../components/common/Card'
import Table from '../components/common/Table'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Pagination from '../components/common/Pagination'
import { formatDate, formatCurrency } from '../utils/formatters'
import toast from 'react-hot-toast'
import { Eye, Ban, CheckCircle, Search } from 'lucide-react'

export default function Users() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const pageSize = 10

  useEffect(() => {
    fetchUsers()
  }, [currentPage, searchTerm])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
      }
      const response = await api.get('/admin/users', { params })
      setUsers(response.data.data.users)
      setTotalPages(response.data.data.totalPages)
      setTotalItems(response.data.data.totalItems)
    } catch (error) {
      toast.error('Failed to fetch users')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleActivate = async (userId, isActive) => {
    try {
      const endpoint = isActive ? 'deactivate' : 'activate'
      await api.put(`/admin/users/${userId}/${endpoint}`)
      toast.success(`User ${isActive ? 'deactivated' : 'activated'} successfully`)
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <div className="font-medium text-text-primary">
            {row.firstName} {row.lastName}
          </div>
          <div className="text-sm text-text-secondary">{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Phone',
      accessor: 'phoneNumber',
    },
    {
      header: 'Account Balance',
      accessor: 'balance',
      render: (row) => (
        <span className="font-medium">{formatCurrency(row.account?.balance || 0)}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Joined',
      accessor: 'createdAt',
      render: (row) => formatDate(row.createdAt, 'MMM d, yyyy'),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/users/${row.id}`)}
            className="p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleActivate(row.id, row.isActive)}
            className={`p-2 rounded-lg transition-colors ${
              row.isActive
                ? 'text-red-600 hover:bg-red-50'
                : 'text-green-600 hover:bg-green-50'
            }`}
            title={row.isActive ? 'Deactivate' : 'Activate'}
          >
            {row.isActive ? <Ban size={18} /> : <CheckCircle size={18} />}
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Users</h1>
          <p className="text-text-secondary">Manage all users</p>
        </div>
      </div>

      <Card>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
            <Input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10"
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={users}
          loading={loading}
          emptyMessage="No users found"
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
