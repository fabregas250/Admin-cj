import { useState, useEffect } from 'react'
import api from '../services/api'
import Card from '../components/common/Card'
import Table from '../components/common/Table'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Pagination from '../components/common/Pagination'
import { formatCurrency, formatDate } from '../utils/formatters'
import toast from 'react-hot-toast'
import { Search, Ban, CheckCircle, Wallet } from 'lucide-react'

export default function Accounts() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const pageSize = 10

  useEffect(() => {
    fetchAccounts()
  }, [currentPage, searchTerm])

  const fetchAccounts = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
      }
      const response = await api.get('/admin/accounts', { params })
      setAccounts(response.data.data.accounts)
      setTotalPages(response.data.data.totalPages)
      setTotalItems(response.data.data.totalItems)
    } catch (error) {
      toast.error('Failed to fetch accounts')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleActivate = async (accountId, isActive) => {
    try {
      const endpoint = isActive ? 'deactivate' : 'activate'
      await api.put(`/admin/accounts/${accountId}/${endpoint}`)
      toast.success(`Account ${isActive ? 'deactivated' : 'activated'} successfully`)
      fetchAccounts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const columns = [
    {
      header: 'Account Number',
      accessor: 'accountNumber',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Wallet className="text-primary-600" size={18} />
          </div>
          <span className="font-mono font-medium">{row.accountNumber}</span>
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
      header: 'Balance',
      accessor: 'balance',
      render: (row) => (
        <span className="font-bold text-lg text-text-primary">
          {formatCurrency(row.balance)}
        </span>
      ),
    },
    {
      header: 'Currency',
      accessor: 'currency',
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
      header: 'Created',
      accessor: 'createdAt',
      render: (row) => formatDate(row.createdAt, 'MMM d, yyyy'),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
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
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Accounts</h1>
        <p className="text-text-secondary">Manage user accounts</p>
      </div>

      <Card>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
            <Input
              type="text"
              placeholder="Search by account number or user..."
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
          data={accounts}
          loading={loading}
          emptyMessage="No accounts found"
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
