import { getAdvancedMenu } from "../models/advnaceMenuViewModel.js";


export const fetchMenuOverview = async (req, res) => {
  try {
    const menu = await getAdvancedMenu();
    res.json({ success: true, data: menu });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};