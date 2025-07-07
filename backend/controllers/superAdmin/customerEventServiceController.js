import CustomerEventService from '../../models/superAdmin/customerEventServiceModel.js';

export const getAllCustomerEventServices = async (req, res) => {
  try {
    const services = await CustomerEventService.getAll();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getCustomerEventServiceById = async (req, res) => {
  try {
    const service = await CustomerEventService.getById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createCustomerEventService = async (req, res) => {
  try {
    const newService = await CustomerEventService.create(req.body);
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateCustomerEventService = async (req, res) => {
  try {
    const updatedService = await CustomerEventService.update(req.params.id, req.body);
    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteCustomerEventService = async (req, res) => {
  try {
    await CustomerEventService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await CustomerEventService.getAllCustomer();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all bookings with customer info
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await CustomerEventService.getAllBooking();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllEventServicesCustomer = async (req, res) => {
    try {
        const events = await CustomerEventService.getAllEventServicesSimple();
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};