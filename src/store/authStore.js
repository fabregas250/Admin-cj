import { create } from 'zustand'
import api from '../services/api'

// Load from localStorage on initialization
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem('admin-auth-storage')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    // Ignore parsing errors
  }
  return { token: null, admin: null, isAuthenticated: false }
}

// Save to localStorage
const saveToStorage = (state) => {
  try {
    localStorage.setItem('admin-auth-storage', JSON.stringify({
      token: state.token,
      admin: state.admin,
      isAuthenticated: state.isAuthenticated,
    }))
  } catch (e) {
    // Ignore storage errors
  }
}

const initialState = loadFromStorage()
if (initialState.token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${initialState.token}`
}

const useAuthStore = create((set) => ({
  token: initialState.token,
  admin: initialState.admin,
  isAuthenticated: initialState.isAuthenticated,
  
  login: async (email, password) => {
    try {
      const response = await api.post('/admin/auth/login', { email, password })
      const { token, admin } = response.data.data
      
      const newState = { 
        token, 
        admin,
        isAuthenticated: true 
      }
      
      set(newState)
      saveToStorage(newState)
      
      // Set auth token in axios instance
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  },
  
  logout: () => {
    set({ 
      token: null, 
      admin: null,
      isAuthenticated: false 
    })
    localStorage.removeItem('admin-auth-storage')
    delete api.defaults.headers.common['Authorization']
  },
  
  setAuthToken: (token) => {
    set({ token })
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },
}))

export { useAuthStore }
export default useAuthStore
