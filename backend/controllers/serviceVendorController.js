import ServiceVendorModel from '../models/serviceVendorModel.js';

export const getServiceVendors = async (req, res) => {
    try {
        const results = await ServiceVendorModel.getServiceVendors();
        
        const groupedData = results.reduce((acc, row) => {
            if (!acc[row.serviceId]) {
                acc[row.serviceId] = {
                    serviceId: row.serviceId,
                    serviceName: row.serviceName,
                    vendors: []
                };
            }
            acc[row.serviceId].vendors.push({
                vendorId: row.vendorId,
                contact: row.contact,
                email: row.email,
                address: row.address
            });
            return acc;
        }, {});

        res.status(200).json({ 
            success: true, 
            message: "Service vendors fetched successfully",
            data: Object.values(groupedData) 
        });

    } catch (error) {
        console.error("Error fetching service vendors:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Internal Server Error" 
        });
    }
};