import { useState, useEffect } from 'react'
import { Plus, Trash2, UserCog, AlertCircle } from 'lucide-react'
import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

interface Admin {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'super_admin' | 'admin'
  isActive: number
  createdAt: string
}

interface AdminCounts {
  admins: number
  superAdmins: number
  adminLimit: number
  superAdminLimit: number
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'

export function AdminRoles() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [counts, setCounts] = useState<AdminCounts | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [revoking, setRevoking] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    role: 'admin' as 'admin' | 'super_admin',
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  // Fetch admins on mount
  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = useAuthStore.getState().token
      const response = await axios.get(`${API_BASE}/admin/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setAdmins(response.data.data.admins || [])
        setCounts(response.data.data.counts || null)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load admin users')
      console.error('Error fetching admins:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email.trim()) {
      setFormError('Email is required')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError('Please enter a valid email address')
      return
    }

    if (counts && counts.admins >= counts.adminLimit && formData.role === 'admin') {
      setFormError(`Maximum ${counts.adminLimit} admins allowed`)
      return
    }

    try {
      setFormLoading(true)
      setFormError(null)
      const token = useAuthStore.getState().token

      const response = await axios.post(
        `${API_BASE}/admin/roles`,
        {
          email: formData.email,
          role: formData.role,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.data.success) {
        setSuccess(`Admin role assigned successfully to ${formData.email}`)
        setFormData({ email: '', role: 'admin' })
        setShowForm(false)

        // Refresh list
        await fetchAdmins()

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000)
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to create admin'
      setFormError(errorMsg)
      console.error('Error creating admin:', err)
    } finally {
      setFormLoading(false)
    }
  }

  const handleRevokeAdmin = async (userId: string, email: string) => {
    if (!window.confirm(`Revoke admin access for ${email}? This user will lose all admin privileges.`)) {
      return
    }

    try {
      setRevoking(userId)
      setError(null)
      const token = useAuthStore.getState().token

      const response = await axios.delete(`${API_BASE}/admin/roles/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setSuccess(`Admin access revoked for ${email}`)

        // Refresh list
        await fetchAdmins()

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000)
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to revoke admin access'
      setError(errorMsg)
      console.error('Error revoking admin:', err)
    } finally {
      setRevoking(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const adminCount = counts?.admins || 0
  const superAdminCount = counts?.superAdmins || 0
  const adminLimit = counts?.adminLimit || 5
  const canAddAdmin = adminCount < adminLimit

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <UserCog className="w-8 h-8" />
            Role Management
          </h1>
          <p className="text-gray-600 mt-1">Manage super admin and admin users</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          disabled={!canAddAdmin}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          Add Admin
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Super Admins</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{superAdminCount}</div>
          <div className="text-xs text-gray-500 mt-1">Maximum: 1</div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Admins</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {adminCount}/{adminLimit}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(adminCount / adminLimit) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Total Admins</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{superAdminCount + adminCount}</div>
          <div className="text-xs text-gray-500 mt-1">Super + Regular</div>
        </div>
      </div>

      {/* Error Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-900">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Not Allowed Message */}
      {!canAddAdmin && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-900">Admin Limit Reached</h3>
            <p className="text-sm text-amber-700 mt-1">
              You have reached the maximum number of {adminLimit} admins. Revoke an admin to add a new one.
            </p>
          </div>
        </div>
      )}

      {/* Add Admin Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Add New Admin</h2>

          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
               title='Role'
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'super_admin' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="admin">Admin (Product Management Only)</option>
                <option value="super_admin">Super Admin (Full Access)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {formData.role === 'admin'
                  ? 'Can add, edit products and view stock only'
                  : 'Full access to all admin functions'}
              </p>
            </div>

            {formError && <p className="text-sm text-red-600">{formError}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={formLoading}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
              >
                {formLoading ? 'Adding...' : 'Add Admin'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setFormError(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admins List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Joined</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No admin users yet
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {admin.firstName} {admin.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          admin.role === 'super_admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {admin.role === 'super_admin' ? '⭐ Super Admin' : 'Admin'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {admin.role === 'super_admin' && superAdminCount <= 1 ? (
                        <span className="text-xs text-gray-500">Protected</span>
                      ) : (
                        <button
                          onClick={() => handleRevokeAdmin(admin.id, admin.email)}
                          disabled={revoking === admin.id}
                          className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
                          title="Revoke admin access"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900">About Admin Roles</h3>
        <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
          <li>
            <strong>Super Admin:</strong> Full access to all features including dashboard, analytics, orders, users, reviews, coupons, and DIY videos
          </li>
          <li>
            <strong>Admin:</strong> Restricted access - can only add/edit products and view stock quantities
          </li>
          <li>Only one Super Admin is allowed</li>
          <li>Maximum 5 regular Admins are allowed</li>
        </ul>
      </div>
    </div>
  )
}

export default AdminRoles
