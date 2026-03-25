import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SearchOutlined, PeopleOutlined } from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { useAdminStore } from '@/store/adminStore'

const ROLE_COLORS: Record<string, string> = {
  admin:    'bg-purple-100 text-purple-700',
  vendor:   'bg-amber-100 text-amber-700',
  customer: 'bg-teal-100 text-teal-700',
}

export default function AdminUsers() {
  const { users, userTotal, usersLoading, fetchUsers } = useAdminStore()
  const [search, setSearch] = useState('')
  const [page, setPage]     = useState(1)
  const LIMIT = 20

  useEffect(() => {
    document.title = 'Users | Admin — CraftworldCentre'
    fetchUsers(page)
  }, [page])

  const filtered = search
    ? users.filter((u) =>
        `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
      )
    : users

  const totalPages = Math.ceil(userTotal / LIMIT)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <div>
        <h1 className="font-display font-bold text-[#0d1f22] text-2xl">Users</h1>
        <p className="text-gray-400 text-sm">{userTotal} registered users</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-card p-4">
        <div className="relative max-w-md">
          <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            sx={{ fontSize: 18, color: '#9ca3af' }} />
          <input type="search" value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="input-field pl-9 text-sm h-10" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {usersLoading ? (
          <div className="flex items-center justify-center py-20">
            <CircularProgress size={28} sx={{ color: '#1A7A8A' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <PeopleOutlined sx={{ fontSize: 40, color: '#d1d5db' }} />
            <p className="text-gray-500 mt-2 text-sm">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  {['User', 'Email', 'Role', 'Status', 'Joined', 'Last Login'].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center
                                        text-white font-bold text-xs flex-shrink-0">
                          {user.first_name?.[0]?.toUpperCase() ?? 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-xs">
                            {user.first_name} {user.last_name}
                          </p>
                          {user.phone && (
                            <p className="text-[10px] text-gray-400">{user.phone}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-600">{user.email}</td>
                    <td className="px-5 py-3">
                      <span className={`badge text-[10px] ${ROLE_COLORS[user.role] ?? ROLE_COLORS.customer}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`flex items-center gap-1.5 text-[10px] font-semibold
                        ${user.is_active ? 'text-green-600' : 'text-red-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-400'}`} />
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(user.created_at).toLocaleDateString('en-NG', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {user.last_login_at
                        ? new Date(user.last_login_at).toLocaleDateString('en-NG', {
                            day: 'numeric', month: 'short',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border text-xs font-medium disabled:opacity-40 hover:bg-gray-50">
                ← Prev
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border text-xs font-medium disabled:opacity-40 hover:bg-gray-50">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
