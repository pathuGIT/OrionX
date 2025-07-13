import bcrypt from 'bcrypt';
import { assignSubAdmin, changeUserPassword, deactivateAdmin, findUserById, listAdmins, listEmployees, updateUserProfile, updateUserRole } from '../models/settingModel.js';

export const getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    res.json({ name: user.name, email: user.email, status: user.status, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    await updateUserProfile(req.params.id, name, email);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { current, new: newPwd } = req.body;
    // verify current omitted for brevity

    // Verify admin's password
    const admin = await findUserById(req.params.id)
    if (!admin) return res.status(404).json({ error: 'Admin not found' })

    const validPassword = await bcrypt.compare(current, admin.password)
    if (!validPassword) return res.status(401).json({ error: 'Invalid password' })

    const hash = await bcrypt.hash(newPwd, 10);
    await changeUserPassword(req.params.id, hash);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Failed to change password' });
  }
};

export const getAdmins = async (_req, res) => {
  try {
    const admins = await listAdmins();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
};

export const getEmployees = async (_req, res) => {
  try {
    const emps = await listEmployees();
    res.json(emps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

// export const assignAdmin = async (req, res) => {
//   const { employeeId } = req.body;
//   const newAdmin = await assignSubAdmin(employeeId);
//   res.status(201).json(newAdmin);
// };
export const assignAdmin = async (req, res) => {
  try {
    const { employeeId, role, password, adminId } = req.body

    // Verify admin's password
    const admin = await findUserById(adminId)
    if (!admin) return res.status(404).json({ error: 'Admin not found' })

    const validPassword = await bcrypt.compare(password, admin.password)
    if (!validPassword) return res.status(401).json({ error: 'Invalid password' })

    // Update role
    const updatedUser = await updateUserRole(employeeId, role)
    res.status(200).json(updatedUser)


  } catch (error) {
    console.error('Role assignment error:', error)
    res.status(500).json({ error: 'Failed to update role' })
  }
}

export const deactivate = async (req, res) => {
  await deactivateAdmin(req.params.id);
  res.sendStatus(204);
};