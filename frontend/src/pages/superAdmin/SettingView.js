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
// import React, { useEffect, useState } from 'react';
// import { useForm, useWatch } from 'react-hook-form';
// import Modal from 'react-modal';
// import settingService from '../../services/settingService';

// Modal.setAppElement('#root');

// export default function SettingView() {
//   const [profile, setProfile] = useState({ name: '', email: '' });
//   const [admins, setAdmins] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const { register, handleSubmit, reset, control, formState: { errors } } = useForm();
//   const newPassword = useWatch({ control, name: 'new' });

//   useEffect(() => {
//     async function fetchData() {
//       const [me, subs, emps] = await Promise.all([
//         settingService.getProfile(),
//         settingService.getAdmins(),
//         settingService.getEmployees()
//       ]);
//       setProfile(me);
//       setAdmins(subs);
//       setEmployees(emps);
//     }
//     fetchData();
//   }, []);

//   const onProfileSubmit = async data => {
//     await settingService.updateProfile(data);
//     setProfile(data);
//   };

//   const onPasswordSubmit = async data => {
//     await settingService.changePassword(data);
//     reset({ current: '', new: '', confirm: '' });
//   };

//   const openAssignModal = () => {
//     reset({ employeeId: '' });
//     setModalOpen(true);
//   };

//   const onAssignSubmit = async ({ employeeId }) => {
//     const newAdmin = await settingService.assignRole(employeeId);
//     setAdmins(prev => [...prev, newAdmin]);
//     setModalOpen(false);
//   };

//   const deactivate = async id => {
//     await settingService.deactivateAdmin(id);
//     setAdmins(prev => prev.filter(a => a.user_id !== id));
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6 space-y-6">
//       {/* Profile & Password */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <section className="bg-white p-6 rounded-2xl shadow-lg">
//           <h2 className="text-xl font-semibold mb-4">My Profile</h2>
//           <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
//             <div>
//               <label className="block text-sm">Name</label>
//               <input {...register('name', { required: true })} defaultValue={profile.name} className="w-full border rounded p-2 text-base" />
//               {errors.name && <span className="text-red-500 text-xs">Required</span>}
//             </div>
//             <div>
//               <label className="block text-sm">Email</label>
//               <input {...register('email', { required: true })} defaultValue={profile.email} className="w-full border rounded p-2 text-base" />
//               {errors.email && <span className="text-red-500 text-xs">Required</span>}
//             </div>
//             <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
//           </form>
//         </section>

//         <section className="bg-white p-6 rounded-2xl shadow-lg">
//           <h2 className="text-xl font-semibold mb-4">Change Password</h2>
//           <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
//             <div>
//               <label className="block text-sm">Current Password</label>
//               <input type="password" {...register('current', { required: true })} className="w-full border rounded p-2 text-base" />
//             </div>
//             <div>
//               <label className="block text-sm">New Password</label>
//               <input type="password" {...register('new', { required: true, minLength: 6 })} className="w-full border rounded p-2 text-base" />
//               {errors.new && <span className="text-red-500 text-xs">Minimum 6 chars</span>}
//             </div>
//             <div>
//               <label className="block text-sm">Confirm Password</label>
//               <input type="password" {...register('confirm', { required: true, validate: v => v === newPassword || 'Passwords must match' })} className="w-full border rounded p-2 text-base" />
//               {errors.confirm && <span className="text-red-500 text-xs">{errors.confirm.message}</span>}
//             </div>
//             <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
//           </form>
//         </section>
//       </div>

//       {/* Manage Sub-Admins */}
//       <section className="bg-white p-6 rounded-2xl shadow-lg">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Manage Sub-Admins</h2>
//           <button onClick={openAssignModal} className="bg-green-600 text-white px-4 py-2 rounded">Assign Role</button>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr><th className="p-2 border-b">Name</th><th className="p-2 border-b">Email</th><th className="p-2 border-b">Role</th><th className="p-2 border-b">Actions</th></tr>
//             </thead>
//             <tbody>
//               {admins.map(admin => (
//                 <tr key={admin.user_id}><td className="p-2">{admin.name}</td><td className="p-2">{admin.email}</td><td className="p-2 capitalize">{admin.role.replace('_',' ')}</td><td className="p-2"><button onClick={()=>deactivate(admin.user_id)} className="text-red-600 text-sm">Deactivate</button></td></tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>

//       {/* Assign Modal */}
//       <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} className="bg-white p-6 max-w-md mx-auto mt-20 rounded-2xl shadow-lg">
//         <h2 className="text-lg font-semibold mb-4">Select Employee</h2>
//         <form onSubmit={handleSubmit(onAssignSubmit)} className="space-y-4">
//           <select {...register('employeeId', { required: true })} className="w-full border rounded p-2">
//             <option value="">-- choose employee --</option>
//             {employees.map(e => <option key={e.employee_id} value={e.employee_id}>{e.name}</option>)}
//           </select>
//           <div className="flex justify-end space-x-2">
//             <button type="button" onClick={()=>setModalOpen(false)} className="px-4 py-2 rounded border">Cancel</button>
//             <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Assign</button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// }