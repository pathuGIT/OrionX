import bcrypt from 'bcrypt';
import { assignSubAdmin, changeUserPassword, deactivateAdmin, findUserById, listAdmins, listEmployees, updateUserProfile } from '../models/settingModel.js';

export const getProfile = async (req, res) => {
  const user = await findUserById(req.params.id);
  res.json({ name: user.name, email: user.email, status: user.status, role: user.role });
};

export const updateProfile = async (req, res) => {
  const { name, email } = req.body;
  await updateUserProfile(req.params.id, name, email);
  res.sendStatus(204);
};

export const changePassword = async (req, res) => {
  const { current, new: newPwd } = req.body;
  // verify current omitted for brevity
  const hash = await bcrypt.hash(newPwd, 10);
  await changeUserPassword(req.params.id, hash);
  res.sendStatus(204);
};

export const getAdmins = async (_req, res) => {
  const admins = await listAdmins();
  res.json(admins);
};

export const getEmployees = async (_req, res) => {
  const emps = await listEmployees();
  res.json(emps);
};

export const assignAdmin = async (req, res) => {
  const { employeeId } = req.body;
  const newAdmin = await assignSubAdmin(employeeId);
  res.status(201).json(newAdmin);
};

export const deactivate = async (req, res) => {
  await deactivateAdmin(req.params.id);
  res.sendStatus(204);
};