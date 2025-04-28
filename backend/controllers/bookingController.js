import { addNewVenue } from "../models/bookingModel.js";


//add venues (venues add to system by admin)
export const addVenue = async (req, res) => {
    const { name, time, location, minCapacity, maxCapacity, price } = req.body;
    try {
        await addNewVenue({ name, time, location, minCapacity, maxCapacity, price });
        res.status(201).json({ message: `Venue added successfully` });
    } catch (error) {
        res.status(500).json({ msg: 'Server error...', error });
    }
};