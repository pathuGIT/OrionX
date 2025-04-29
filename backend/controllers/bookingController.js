import { addNewVenue, deleteVenueByIdModel, getAllVenuesModel, checkVenuById, getVenueByIdModel, updateNewVenueModel } from "../models/bookingModel.js";

//add venues (venues add to system by admin)
export const addVenue = async (req, res) => {
    const { name, time, location, minCapacity, maxCapacity, price } = req.body;

    // Validation
    if (
        !name ||
        !time ||
        !location ||
        minCapacity == null ||
        maxCapacity == null ||
        price == null
    ) {
        return res.status(400).json({ msg: "All fields are required." });
    }
    if (typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ msg: "Venue name is required." });
    }
    if (isNaN(minCapacity) || minCapacity < 0) {
        return res.status(400).json({ msg: "minCapacity must be a non-negative number." });
    }
    if (isNaN(maxCapacity) || maxCapacity < minCapacity) {
        return res.status(400).json({ msg: "maxCapacity must be a number greater than or equal to minCapacity." });
    }
    if (isNaN(price) || price < 0) {
        return res.status(400).json({ msg: "price must be a non-negative number." });
    }

    try {
        await addNewVenue({ name, time, location, minCapacity, maxCapacity, price });
        res.status(201).json({ message: `Venue added successfully` });
    } catch (error) {
        res.status(500).json({ msg: 'Server error...', error });
    }

};

export const getAllVenue = async (req, res) => {
    try {
        const venues = await getAllVenuesModel();
        res.status(200).json(venues);
    } catch (error) {
        res.status(500).json({ msg: 'Server error...', error });
    }

}

export const deleteVenueById = async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ msg: "Venue id is required." });
    }

    // Correct way to check if venue exists
    if (!(await checkVenuById(id))) {
        return res.status(404).json({ msg: "Venue not found." });
    }

    try {
        const result = await deleteVenueByIdModel(id);

        if (result.affectedRows === 0) {   // Notice: MySQL returns affectedRows
            return res.status(404).json({ msg: "Venue not found." });
        }

        res.status(200).json({ message: "Venue deleted successfully." });
    } catch (error) {
        res.status(500).json({ msg: "Server error...", error });
    }
};

export const getVenueById = async (req, res) => {
    const { id } = req.query;
    try {
        const result = await getVenueByIdModel(id);

        if (!result || result.length === 0) { 
            return res.status(404).json({ msg: "Venue not found." });
        }

        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ msg: "Server error...", error });
    }
}

export const updateVenueById = async (req, res) => {
    const { id } = req.query;
    const { name, time, location, minCapacity, maxCapacity, price } = req.body;

    // Correct way to check if venue exists
    if (!(await checkVenuById(id))) {
        return res.status(404).json({ msg: "Venue not found." });
    }

    // Validation
    if (
        !name ||
        !time ||
        !location ||
        minCapacity == null ||
        maxCapacity == null ||
        price == null
    ) {
        return res.status(400).json({ msg: "All fields are required." });
    }
    if (typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ msg: "Venue name is required." });
    }
    if (isNaN(minCapacity) || minCapacity < 0) {
        return res.status(400).json({ msg: "minCapacity must be a non-negative number." });
    }
    if (isNaN(maxCapacity) || maxCapacity < minCapacity) {
        return res.status(400).json({ msg: "maxCapacity must be a number greater than or equal to minCapacity." });
    }
    if (isNaN(price) || price < 0) {
        return res.status(400).json({ msg: "price must be a non-negative number." });
    }

    try {
        await updateNewVenueModel({id, name, time, location, minCapacity, maxCapacity, price });
        res.status(201).json({ message: `Venue updated successfully` });
    } catch (error) {
        res.status(500).json({ msg: 'Server error...', error });
    }
}