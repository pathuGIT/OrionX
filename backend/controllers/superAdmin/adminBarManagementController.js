import{ Bar, Bite, LiquorItem, SoftDrinkItem } from '../../models/superAdmin/adminBarManagementModel.js';

export const adminBarManagementController = {

 createBar : async (req, res) => {
  try {
    const bar = await Bar.create(req.body);
    res.status(201).json(bar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

},



 getAllBars :  async (req, res) => {
  try {
    const bars = await Bar.findAll();
    res.json(bars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

},



 getBarById :  async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.id);
    if (!bar) {
      return res.status(404).json({ message: 'Bar not found' });
    }
    res.json(bar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

},



 updateBar :  async (req, res) => {
  try {
    const result = await Bar.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Bar not found' });
    }
    res.json({ message: 'Bar updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

},



 deleteBar :  async (req, res) => {
  try {
    const result = await Bar.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Bar not found' });
    }
    res.json({ message: 'Bar deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

},





//////////////////




  createBite :  async (req, res) => {
  try {
    const bite = await Bite.create(req.body);
    res.status(201).json(bite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

},



  getAllBites :  async (req, res) => {
  try {
    const bites = await Bite.findAll();
    res.json(bites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

},



  getBitesByBar :  async (req, res) => {
  try {
    const bites = await Bite.findByBar(req.params.barId);
    res.json(bites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

},



  updateBite :  async (req, res) => {
  try {
    const result = await Bite.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Bite not found' });
    }
    res.json({ message: 'Bite updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

},



  deleteBite :  async (req, res) => {
  try {
    const result = await Bite.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Bite not found' });
    }
    res.json({ message: 'Bite deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

},


//////////////////////////////////





 createLiquorItem :  async (req, res) => {
  try {
    const item = await LiquorItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

},



 getAllLiquorItems :  async (req, res) => {
  try {
    const items = await LiquorItem.findAll();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

},



 getLiquorByBar :  async (req, res) => {
  try {
    const items = await LiquorItem.findByBar(req.params.barId);
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

},




 updateLiquorItem :  async (req, res) => {
  try {
    const result = await LiquorItem.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Liquor item not found' });
    }
    res.json({ message: 'Liquor item updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

},



 deleteLiquorItem :  async (req, res) => {
  try {
    const result = await LiquorItem.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Liquor item not found' });
    }
    res.json({ message: 'Liquor item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
},


///////////////////////////////





 createSoftDrinkItem :  async (req, res) => {
  try {
    const item = await SoftDrinkItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

},



 getAllSoftDrinkItems :  async (req, res) => {
  try {
    const items = await SoftDrinkItem.findAll();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

},



 getSoftDrinksByBar :  async (req, res) => {
  try {
    const items = await SoftDrinkItem.findByBar(req.params.barId);
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

},



 updateSoftDrinkItem :  async (req, res) => {
  try {
    const result = await SoftDrinkItem.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Soft drink item not found' });
    }
    res.json({ message: 'Soft drink item updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

},



 deleteSoftDrinkItem :  async (req, res) => {
  try {
    const result = await SoftDrinkItem.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Soft drink item not found' });
    }
    res.json({ message: 'Soft drink item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

},


};
