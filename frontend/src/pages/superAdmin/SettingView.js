import React, { useEffect, useState } from 'react'
import axios from 'axios'

const SettingView = () => {
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [admins, setAdmins] = useState([])
  const [employees, setEmployees] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState('')

  useEffect(() => {
    // fetch profile and admins
    // axios.get('/api/admin/settings/profile').then(res => setProfile(res.data))
    // axios.get('/api/admin/settings/admins').then(res => setAdmins(res.data))
    //axios.get('/api/admin/employees').then(res => setEmployees(res.data))
  }, [])

  const saveProfile = () => axios.put('/api/admin/settings/profile', profile)
  const addSubAdmin = () => {
    if (!selectedEmployee) return
    axios.post('/api/admin/settings/admins', { employeeId: selectedEmployee })
      .then(res => {
        setAdmins(prev => [...prev, res.data])
        setSelectedEmployee('')
        setShowAdd(false)
      })
      .catch(console.error)
  }

  return (
    <div className="p-4 space-y-6 flex flex-col">
      {/* My Profile */}
      <div className="flex flex-row gap-4">
        <section className="bg-white p-4 rounded-lg shadow space-y-3">
          <h2 className="text-base font-semibold">My Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              className="border p-1 rounded text-xs"
              placeholder="Name"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
            />
            <input
              type="email"
              className="border p-1 rounded text-xs"
              placeholder="Email"
              value={profile.email}
              onChange={e => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <button
            onClick={saveProfile}
            className="mt-1 px-3 py-1 bg-blue-600 text-xs text-white rounded"
          >
            Save
          </button>
        </section>

        {/* Change Password */}
        <section className="bg-white p-4 rounded-lg shadow space-y-3">
          <h2 className="text-base font-semibold">Change Password</h2>
          <div className="space-y-2">
            <input type="password" className="border p-1 rounded text-xs" placeholder="Current Password" />
            <input type="password" className="border p-1 rounded text-xs" placeholder="New Password" />
            <input type="password" className="border p-1 rounded text-xs" placeholder="Confirm New" />
          </div>
          <button className="mt-1 px-3 py-1 bg-blue-600 text-xs text-white rounded">
            Update
          </button>
        </section>
      </div>

      {/* Manage Admins */}
      <section className="bg-white p-4 rounded-lg shadow space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Manage Admins</h2>
          <button
            onClick={() => setShowAdd(true)}
            className="px-3 py-1 bg-green-600 text-xs text-white rounded"
          >
            Add Sub-Admin
          </button>
        </div>

        {showAdd && (
          <div className="mt-2 flex space-x-2 items-center">
            <select
              className="border p-1 rounded text-xs"
              value={selectedEmployee}
              onChange={e => setSelectedEmployee(e.target.value)}
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
            <button
              onClick={addSubAdmin}
              className="px-3 py-1 bg-blue-600 text-xs text-white rounded"
            >
              Assign Role
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-3 py-1 bg-gray-300 text-xs text-black rounded"
            >
              Cancel
            </button>
          </div>
        )}

        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="border-b p-1">Name</th>
              <th className="border-b p-1">Email</th>
              <th className="border-b p-1">Role</th>
              <th className="border-b p-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id}>
                <td className="p-1">{admin.name}</td>
                <td className="p-1">{admin.email}</td>
                <td className="p-1">{admin.role}</td>
                <td className="p-1 space-x-2">
                  <button className="text-xs text-red-600">Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default SettingView