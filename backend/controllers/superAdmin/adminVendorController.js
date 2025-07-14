import AdminVendor from '../../models/superAdmin/adminVendorModel.js';

export const getAllVendors = async (req, res) => {
    try {
        const vendors = await AdminVendor.getAllVendors();
        res.status(200).json(vendors);
    } catch (error) {
        console.error('Error fetching vendors:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createVendor = async (req, res) => {
    try {
        const vendorData = req.body;
        const newVendor = await AdminVendor.createVendor(vendorData);
        res.status(201).json(newVendor);
    } catch (error) {
        console.error('Error creating vendor:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const vendorData = req.body;
        const updatedVendor = await AdminVendor.updateVendor(id, vendorData);
        res.json(updatedVendor);
    } catch (error) {
        if (error.message.startsWith('Vendor not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;
        await AdminVendor.deleteVendor(id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting vendor:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getVendorServices = async (req, res) => {
    try {
        const { id } = req.params;
        const services = await AdminVendor.getVendorServices(id);
        res.json(services);
    } catch (error) {
        console.error('Error fetching vendor services:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const assignServicesToVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const { serviceIds } = req.body;
        
        if (!Array.isArray(serviceIds)) {
            return res.status(400).json({ error: 'Invalid service IDs format' });
        }
        
        await AdminVendor.assignServicesToVendor(id, serviceIds);
        res.json({ message: 'Services assigned successfully' });
    } catch (error) {
        console.error('Error assigning services:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getVendorById = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await AdminVendor.getVendorById(id);
        res.json(vendor);
    } catch (error) {
        console.error('Error fetching vendor by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};