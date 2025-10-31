import { useState, useEffect } from 'react'
import api from '../services/api'
import Card from '../components/common/Card'
import Table from '../components/common/Table'
import Input from '../components/common/Input'
import Pagination from '../components/common/Pagination'
import { formatCurrency, formatDate } from '../utils/formatters'
import { Search, Filter, ArrowDownCircle, ArrowUpCircle, Send, ArrowDownToLine } from 'lucide-react'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const pageSize = 20

  useEffect(() => {
    fetchTransactions()
  }, [currentPage, searchTerm, filterType])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
        type: filterType !== 'all' ? filterType : undefined,
      }
      const response = await api.get('/admin/transactions', { params })
      setTransactions(response.data.data.transactions)
      setTotalPages(response.data.data.totalPages)
      setTotalItems(response.data.data.totalItems)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowDownCircle className="text-green-600" size={18} />
      case 'WITHDRAWAL':
        return <ArrowUpCircle className="text-red-600" size={18} />
      case 'TRANSFER_OUT':
        return <Send className="text-blue-600" size={18} />
      case 'TRANSFER_IN':
        return <ArrowDownToLine className="text-purple-600" size={18} />
      default:
        return null
    }
  }

  const getTransactionColor = (type) => {
    switch (type) {
      case 'DEPOSIT':
        return 'bg-green-100 text-green-800'
      case 'WITHDRAWAL':
        return 'bg-red-100 text-red-800'
      case 'TRANSFER_OUT':
        return 'bg-blue-100 text-blue-800'
      case 'TRANSFER_IN':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const columns = [
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => (
        <div className="flex items-center gap-2">
          {getTransactionIcon(row.type)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTransactionColor(row.type)}`}>
            {row.type.replace('_', ' ')}
          </span>
        </div>
      ),
    },
    {
      header: 'User',
      accessor: 'user',
      render: (row) => (
        <div>
          <div className="font-medium text-text-primary">
            {row.account?.user?.firstName} {row.account?.user?.lastName}
          </div>
          <div className="text-sm text-text-secondary">{row.account?.user?.email}</div>
          <div className="text-xs text-text-secondary font-mono">{row.account?.accountNumber}</div>
        </div>
      ),
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row) => (
        <span className="font-bold text-lg">
          {row.type === 'WITHDRAWAL' || row.type === 'TRANSFER_OUT' ? '-' : '+'}
          {formatCurrency(parseFloat(row.amount))}
        </span>
      ),
    },
    {
      header: 'Balance After',
      accessor: 'balanceAfter',
      render: (row) => (
        <span className="font-medium">{formatCurrency(parseFloat(row.balanceAfter))}</span>
      ),
    },
    {
      header: 'Reference',
      accessor: 'reference',
      render: (row) => (
        <span className="font-mono text-xs">{row.reference || 'N/A'}</span>
      ),
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (row) => formatDate(row.createdAt, 'PPp'),
    },
    {
      header: 'Details',
      accessor: 'details',
      render: (row) => {
        if (row.type === 'TRANSFER_OUT' && row.recipientAccount) {
          return (
            <div className="text-xs">
              <p className="text-text-secondary">To: {row.recipientAccount.user?.firstName} {row.recipientAccount.user?.lastName}</p>
              <p className="text-text-secondary font-mono">{row.recipientAccount.accountNumber}</p>
            </div>
          )
        }
        if (row.type === 'TRANSFER_IN' && row.senderAccount) {
          return (
            <div className="text-xs">
              <p className="text-text-secondary">From: {row.senderAccount.user?.firstName} {row.senderAccount.user?.lastName}</p>
              <p className="text-text-secondary font-mono">{row.senderAccount.accountNumber}</p>
            </div>
          )
        }
        return <span className="text-xs text-text-secondary">{row.description || 'N/A'}</span>
      },
    },
  ]

  const transactionTypes = ['all', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER_OUT', 'TRANSFER_IN']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Transactions</h1>
        <p className="text-text-secondary">View all system transactions</p>
      </div>

      <Card>
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
            <Input
              type="text"
              placeholder="Search by reference, description, account number, or email..."
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
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value)
                setCurrentPage(1)
              }}
              className="input-field pl-10 w-full sm:w-auto"
            >
              {transactionTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Table
          columns={columns}
          data={transactions}
          loading={loading}
          emptyMessage="No transactions found"
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
