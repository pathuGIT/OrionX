// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { getProfile } from '../../services/settingService'

// const SettingView = () => {
//   const [profile, setProfile] = useState({ name: '', email: '', status: '', role: '' })
//   const [admins, setAdmins] = useState([])
//   const [employees, setEmployees] = useState([])
//   const [showAdd, setShowAdd] = useState(false)
//   const [selectedEmployee, setSelectedEmployee] = useState('')

//   useEffect(() => async () => {
//     const x = await getProfile(sessionStorage.getItem('id'));
//     setProfile({ name: x.name, email: x.email, status: x.status, role: x.role })
//   }, []);

//   return (
//     <div className="p-4 space-y-6 flex flex-col">
//       {/* My Profile */}
//       <div className="flex flex-row gap-4">
//         <section className="bg-white p-4 rounded-lg shadow space-y-3">
//           <h2 className="text-base font-semibold">My Profile</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <input
//               type="text"
//               className="border p-1 rounded text-xs"
//               placeholder="Name"
//               value={profile.name}
//               onChange={e => setProfile({ ...profile, name: e.target.value })}
//             />
//             <input
//               type="email"
//               className="border p-1 rounded text-xs"
//               placeholder="Email"
//               value={profile.email}
//               onChange={e => setProfile({ ...profile, email: e.target.value })}
//             />
//             <input
//               type="text"
//               className="border p-1 rounded text-xs"
//               placeholder="Status"
//               value={profile.status}
//               onChange={e => setProfile({ ...profile, status: e.target.value })}
//             />
//             <input
//               type="text"
//               className="border p-1 rounded text-xs"
//               placeholder="Role"
//               value={profile.role}
//               onChange={e => setProfile({ ...profile, role: e.target.value })}
//             />
//           </div>
//           <button
//             onClick={() => {}}
//             className="mt-1 px-3 py-1 bg-blue-600 text-xs text-white rounded"
//           >
//             Save
//           </button>
//         </section>

//         {/* Change Password */}
//         <section className="bg-white p-4 rounded-lg shadow space-y-3">
//           <h2 className="text-base font-semibold">Change Password</h2>
//           <div className="space-y-2">
//             <input type="password" className="border p-1 rounded text-xs" placeholder="Current Password" />
//             <input type="password" className="border p-1 rounded text-xs" placeholder="New Password" />
//             <input type="password" className="border p-1 rounded text-xs" placeholder="Confirm New" />
//           </div>
//           <button className="mt-1 px-3 py-1 bg-blue-600 text-xs text-white rounded">
//             Update
//           </button>
//         </section>
//       </div>

//       {/* Manage Admins */}
//       <section className="bg-white p-4 rounded-lg shadow space-y-3">
//         <div className="flex items-center justify-between">
//           <h2 className="text-base font-semibold">Manage Admins</h2>
//           <button
//             onClick={() => setShowAdd(true)}
//             className="px-3 py-1 bg-green-600 text-xs text-white rounded"
//           >
//             Add Sub-Admin
//           </button>
//         </div>

//         {showAdd && (
//           <div className="mt-2 flex space-x-2 items-center">
//             <select
//               className="border p-1 rounded text-xs"
//               value={selectedEmployee}
//               onChange={e => setSelectedEmployee(e.target.value)}
//             >
//               <option value="">Select Employee</option>
//               {employees.map(emp => (
//                 <option key={emp.id} value={emp.id}>{emp.name}</option>
//               ))}
//             </select>
//             <button
//               onClick={() => {}}
//               className="px-3 py-1 bg-blue-600 text-xs text-white rounded"
//             >
//               Assign Role
//             </button>
//             <button
//               onClick={() => setShowAdd(false)}
//               className="px-3 py-1 bg-gray-300 text-xs text-black rounded"
//             >
//               Cancel
//             </button>
//           </div>
//         )}

//         <table className="w-full text-left text-sm">
//           <thead>
//             <tr>
//               <th className="border-b p-1">Name</th>
//               <th className="border-b p-1">Email</th>
//               <th className="border-b p-1">Role</th>
//               <th className="border-b p-1">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {admins.map(admin => (
//               <tr key={admin.id}>
//                 <td className="p-1">{admin.name}</td>
//                 <td className="p-1">{admin.email}</td>
//                 <td className="p-1">{admin.role}</td>
//                 <td className="p-1 space-x-2">
//                   <button className="text-xs text-red-600">Deactivate</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>
//     </div>
//   )
// }

// export default SettingView
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getProfile, getAdmins, getEmployees, assignRole, deactivateAdmin, updateProfile, changePassword } from '../../services/settingService'

const SettingView = () => {
  const [profile, setProfile] = useState({ name: '', email: '', status: '', role: '' })
  const [admins, setAdmins] = useState([])
  const [employees, setEmployees] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getProfile(sessionStorage.getItem('id'))
        setProfile(profileData)
        const adminsData = await getAdmins()
        setAdmins(adminsData)
        const employeesData = await getEmployees()
        setEmployees(employeesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const handleSubmitPassword = async (e) => {
    e.preventDefault()
    // Add password change logic
  }

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Profile Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">My Profile</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={profile.status}
                  onChange={e => setProfile({ ...profile, status: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={profile.role}
                  readOnly
                />
              </div>
            </div>
            <button
              onClick={() => updateProfile(sessionStorage.getItem('id'), profile)}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Password Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
          <form onSubmit={handleSubmitPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={handlePasswordChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={handlePasswordChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={handlePasswordChange}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>

      {/* Admins Management Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">Manage Admins</h2>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Sub-Admin
          </button>
        </div>

        {showAdd && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedEmployee}
                onChange={e => setSelectedEmployee(e.target.value)}
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => assignRole(selectedEmployee)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Assign Role
                </button>
                <button
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map(admin => (
                <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{admin.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => deactivateAdmin(admin.id)}
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SettingView