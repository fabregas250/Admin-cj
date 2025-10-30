import { useState, useEffect } from 'react'
import api from '../services/api'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { formatDate } from '../utils/formatters'
import toast from 'react-hot-toast'
import { Send, Users, User } from 'lucide-react'

export default function Notifications() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [recipientType, setRecipientType] = useState('user')
  const [selectedUserId, setSelectedUserId] = useState('')
  const [users, setUsers] = useState([])
  const [sending, setSending] = useState(false)
  const [sendHistory, setSendHistory] = useState([])

  useEffect(() => {
    fetchUsers()
    fetchSendHistory()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users', { params: { limit: 100 } })
      setUsers(response.data.data.users || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const fetchSendHistory = async () => {
    try {
      const response = await api.get('/admin/notifications/history')
      setSendHistory(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch send history:', error)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    
    if (!title || !message) {
      toast.error('Title and message are required')
      return
    }

    if (recipientType === 'user' && !selectedUserId) {
      toast.error('Please select a user')
      return
    }

    setSending(true)
    try {
      const payload = {
        title,
        message,
        recipientType,
        userId: recipientType === 'user' ? selectedUserId : undefined,
      }

      await api.post('/admin/notifications/push', payload)
      toast.success('Notification sent successfully!')
      
      // Reset form
      setTitle('')
      setMessage('')
      setSelectedUserId('')
      
      // Refresh history
      fetchSendHistory()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send notification')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Push Notifications</h1>
        <p className="text-text-secondary">Send push notifications to users</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Send Notification">
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Recipient Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="user"
                    checked={recipientType === 'user'}
                    onChange={(e) => setRecipientType(e.target.value)}
                    className="text-primary-500"
                  />
                  <User size={18} />
                  <span>Single User</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="all"
                    checked={recipientType === 'all'}
                    onChange={(e) => setRecipientType(e.target.value)}
                    className="text-primary-500"
                  />
                  <Users size={18} />
                  <span>All Users</span>
                </label>
              </div>
            </div>

            {recipientType === 'user' && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Select User
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="input-field"
                  required={recipientType === 'user'}
                >
                  <option value="">Choose a user...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Notification title"
            />

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-field"
                rows={4}
                required
                placeholder="Notification message"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={sending}
            >
              <Send size={18} className="mr-2" />
              {sending ? 'Sending...' : 'Send Notification'}
            </Button>
          </form>
        </Card>

        <Card title="Send History">
          {sendHistory.length > 0 ? (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {sendHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-gray-50 rounded-lg border-l-4 border-primary-500"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-text-primary">{item.title}</h4>
                    <span className="text-xs text-text-secondary">
                      {formatDate(item.createdAt, 'PPp')}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mb-2">{item.message}</p>
                  <div className="flex items-center gap-4 text-xs text-text-secondary">
                    <span>To: {item.recipientType === 'all' ? 'All Users' : item.userEmail}</span>
                    <span className={`px-2 py-1 rounded-full ${
                      item.status === 'sent' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-text-secondary">No send history</p>
          )}
        </Card>
      </div>
    </div>
  )
}
