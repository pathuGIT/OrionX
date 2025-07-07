import { v4 as uuidv4 } from 'uuid';
import { addNewVenue, deleteVenueByIdModel, getAllVenuesModel, checkVenuById, getVenueByIdModel, updateNewVenueModel, checkBookingByVenueId, insertContract, getDamageFeeForfeited, insertPricing, getBookingById, getVenueBytId, insertBooking, checkBookingExists, getAllBookings, getBookingByIdAdvance, updateBookingStatusModel, updateContractModel, updatePricingModel, updateBookingVenueModel, updateDamageFeeModel, getContractById, getBookingPricingById, updateGuestsModel, updateAdditionalHoursModel, UpdateBookingPrice_BiteSoftLiquorModel, getBiteSoftLiquorFromEventModel, updateBookingPricingModel, searchAllBookings } from "../models/bookingModel.js";

//add venues (venues add to system by admin)
export const addVenue = async (req, res) => {
    const { name, time, location, minCapacity, maxCapacity, price, additionalHourFee, openedTimePeriod } = req.body;

    // Validation
    if (
        !name ||
        !time ||
        !location ||
        minCapacity == null ||
        maxCapacity == null ||
        price == null ||
        additionalHourFee == null ||
        openedTimePeriod == null

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
    if (isNaN(additionalHourFee) || additionalHourFee < 0) {
        return res.status(400).json({ msg: "additionalHourFee must be a non-negative number." });
    }
    if (isNaN(additionalHourFee) || additionalHourFee < 0) {
        return res.status(400).json({ msg: "openedTimePeriod is required." });
    }

    try {
        await addNewVenue({ name, time, location, minCapacity, maxCapacity, price, additionalHourFee, openedTimePeriod });
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
    const { id } = req.params;


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

        res.status(200).json({ msg: "Venue deleted successfully." });
    } catch (error) {
        res.status(500).json({ msg: "This Venue is Already used, Can't deleted it.", error });
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
    const { name, time, location, minCapacity, maxCapacity, price, additionalHourFee, openedTimePeriod } = req.body;

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
        price == null ||
        additionalHourFee == null ||
        openedTimePeriod == null

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

    if (isNaN(additionalHourFee) || additionalHourFee < 0) {
        return res.status(400).json({ msg: "additionalHourFee must be a non-negative number." });
    }
    if (isNaN(openedTimePeriod) || openedTimePeriod < 0) {
        return res.status(400).json({ msg: "openedTimePeriod must be a non-negative number." });
    }

    try {
        await updateNewVenueModel({ id, name, time, location, minCapacity, maxCapacity, price, additionalHourFee, openedTimePeriod });
        res.status(201).json({ message: `Venue updated successfully` });
    } catch (error) {
        res.status(500).json({ msg: 'Server error...', error });
    }
}

export const checkVenuIdInBooking = async (req, res) => {
    const { venueId } = req.params;
    const bookingExists = await checkBookingByVenueId(venueId);
    res.status(200).json({ exists: bookingExists });
}



/////////////////
export async function createBooking(req, res) {
    try {
        const {
            date,
            slot,
            customerId,
            guests,
            venueId,
            extraHours,
            payDeposit // boolean
        } = req.body;

        console.log("Bookk:", req.body)
        // 1. Fetch venue details
        const venue = await getVenueBytId(venueId);
        if (!venue) return res.status(404).json({ error: 'Venue not found' });

        // 2. Calculate hall charge
        let hallCharge = 0.00;
        if (guests >= venue.min_capacity && guests <= venue.max_capacity) {
            hallCharge = venue.price;
        } else if (guests > venue.max_capacity) {
            hallCharge = 0;
        } else if (guests < venue.min_capacity) {
            hallCharge = venue.price;
        }

        // 3. Calculate extra hour fee
        const extraHourFee = extraHours * parseFloat(venue.additional_hour_fee || 0);

        // 4. Insert booking
        let status = 'pending';
        if (payDeposit) {
            status = 'confirmed';
        }

        // Valid new booking is already booked with same booking_date & slot
        const existingBooking = await checkBookingExists(date, slot, venueId);
        if (existingBooking) {
            return res.status(400).json({ message: 'Booking already exists for this date and slot!!. Please check another date or venue.' });
        }

        const insertedId = await insertBooking({
            date,
            slot,
            customerId,
            guests,
            venueId,
            extraHours,
            status
        });
        const bookingId = insertedId; // if varchar, adjust accordingly

        // 5. Insert contract if paid
        if (payDeposit) {
            const contractId = uuidv4();
            await insertContract({ bookingId });
        }

        // 6. Forfeited deposit (damage fee) if any
        const forfeitedDeposit = await getDamageFeeForfeited(bookingId);

        // 7. Insert pricing row
        const overallTotal = Number(hallCharge) + Number(extraHourFee);
        await insertPricing({
            bookingId,
            menuPriceTotal: 0.00,
            hallCharge,
            extraHourFee,
            overallTotal,
            forfeitedDeposit
        });

        return res.status(201).json({ booking_id: bookingId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getBooking(req, res) {
    try {
        const booking = await getBookingById(req.params.id);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        res.json(booking);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


/////////////// Advance booking view controllers

export const getBookings = async (req, res) => {
    console.log("aaa")
    try {
        const status = req.query.status || "all";
        const bookings = await getAllBookings(status);
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ success: false, message: "Failed to fetch bookings." });
    }
};

export const searchBookings = async (req, res) => {
    try {
        const item = req.query.search;
        console.log("aaaaaaaaaaa", item)
        const bookings = await searchAllBookings(item);
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ success: false, message: "Failed to fetch bookings." });
    }
};

// Get details of a single booking
export const getBookingDetails = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const bookingDetails = await getBookingByIdAdvance(bookingId);
        if (!bookingDetails) {
            return res.status(404).json({ success: false, message: "Booking not found." });
        }
        res.status(200).json({ success: true, data: bookingDetails });
    } catch (error) {
        console.error("Error fetching booking details:", error);
        res.status(500).json({ success: false, message: "Failed to fetch booking details." });
    }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const { status } = req.body;


        if (status === "2") {
            const currentContract = await getContractById(bookingId);
            if (!currentContract) {
                await insertContract({ bookingId });
                return res.status(201).json({ success: true, message: "Contract created successfully." });
            }

            console.log("currentContract", currentContract.data)
            // change contract
            await updateDamageFeeModel(bookingId, 0, 0, 50000, 'pending');

            ///////////////////////////////////////////////////////////////////////////////////////////////////
            const currBooking = await getBookingById(bookingId);
            console.log("currBooking", currBooking)
            const venue = await getVenueBytId(currBooking.venue_id);
            if (!venue) return res.status(404).json({ error: 'Venue not found' });

            // Calculate hall charge
            let hallCharge = 0.00;
            if (currBooking.number_of_guests >= venue.min_capacity && currBooking.number_of_guests <= venue.max_capacity) {
                hallCharge = venue.price;
            } else if (currBooking.number_of_guests > venue.max_capacity) {
                hallCharge = 0;
            } else if (currBooking.number_of_guests < venue.min_capacity) {
                hallCharge = venue.price;
            }

            // 3. Calculate extra hour fee
            const extraHourFee = currBooking.additional_hours * parseFloat(venue.additional_hour_fee || 0);

            // change booking_pricing forfeited_deposit
            const currentBookingPrice = await getBookingPricingById(bookingId);
            const newBookingPrice = {
                menuPriceTotal: currentBookingPrice.menu_price_total,
                hallCharge: hallCharge, // Updated hall charge
                extraHourFee: extraHourFee, // Updated extra hour fee
                bitesPayment: currentBookingPrice.bites_payment,
                fountainPayment: currentBookingPrice.fountain_payment,
                otherPayment: currentBookingPrice.other_payment,
                forfeitedDeposit: 0
            };
            await updatePricingModel(bookingId, newBookingPrice);
        }

        if (status === "1") {
            await updateDamageFeeModel(bookingId, 0, 0, 0, 'canceled');

            const currentBookingPrice = await getBookingPricingById(bookingId);
            const newBookingPrice = {
                menuPriceTotal: currentBookingPrice.menu_price_total,
                hallCharge: currentBookingPrice.hall_charge,
                extraHourFee: currentBookingPrice.extra_hour_fee,
                bitesPayment: currentBookingPrice.bites_payment,
                fountainPayment: currentBookingPrice.fountain_payment,
                otherPayment: currentBookingPrice.other_payment,
                forfeitedDeposit: 0
            };
            await updatePricingModel(bookingId, newBookingPrice);
        }

        if (status === "3") {
            // change contract
            await updateDamageFeeModel(bookingId, 0, 0, 0, 'canceled');


            // change booking_pricing forfeited_deposit
            const currentBookingPrice = await getBookingPricingById(bookingId);
            const newBookingPrice = {
                menuPriceTotal: 0,
                hallCharge: 0,
                extraHourFee: 0,
                bitesPayment: 0,
                fountainPayment: 0,
                otherPayment: 0,
                forfeitedDeposit: 0
            };
            await updatePricingModel(bookingId, newBookingPrice);
        }

        const result1 = await updateBookingStatusModel(bookingId, status);
        if (result1.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Booking not found or status not updated." });
        }

        res.status(200).json({ success: true, message: "Booking status updated successfully." });
    } catch (error) {
        console.error("Error updating booking status:", error);
        res.status(500).json({ success: false, message: "Failed to update booking status." });
    }
};

// Update contract information
export const updateContract = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const { depositAmount, damageFee, refundAmount, status } = req.body;
        const result = await updateContractModel(bookingId, { depositAmount, damageFee, refundAmount, status });
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Contract not found or not updated." });
        }
        res.status(200).json({ success: true, message: "Contract updated successfully." });
    } catch (error) {
        console.error("Error updating contract:", error);
        res.status(500).json({ success: false, message: "Failed to update contract." });
    }
};

// Update booking pricing information
export const UpdateBookingPrice_BiteSoftLiquor = async (req, res) => {
    try {
        const bookingId = req.params.id;
        let TotalBitePrice = 0;

        const resultObj = await getBiteSoftLiquorFromEventModel(bookingId);

        if (!resultObj) {
            TotalBitePrice = 0;
        }
        else{
            TotalBitePrice = resultObj.TotalBitePrice;
        }

        const result = await UpdateBookingPrice_BiteSoftLiquorModel(bookingId, TotalBitePrice);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Pricing for Bite not found for this bookingId." });
        }
        res.status(200).json({ success: true, message: "Bite updated successfully." });
    } catch (error) {
        console.error("Error updating Bite:", error);
        res.status(500).json({ success: false, message: "Failed to update Bite." });
    }
};

export const updateBookingVenue = async (req, res) => {
    //const [booking, setBooking] = useState(null);
    try {
        const bookingId = req.params.id;
        const { venueId } = req.body;
        const result = await updateBookingVenueModel(bookingId, venueId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Booking not found or venue not updated." });
        }

        // update booking pricing 

        // get booking from booking id
        const bookingResult = await getBookingById(req.params.id);
        // If your model returns an array, get the first item
        const booking = Array.isArray(bookingResult) ? bookingResult[0] : bookingResult;
        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        // 1. Fetch venue details
        const venue = await getVenueByIdModel(venueId);
        if (!venue) return res.status(404).json({ error: 'Venue not found' });

        // 2. Calculate hall charge
        let hallCharge = 0.00;
        if (booking.number_of_guests >= venue[0].min_capacity && booking.number_of_guests <= venue[0].max_capacity) {
            hallCharge = venue[0].price;
        }

        // 3. Calculate extra hour fee
        const extraHourFee = booking.additional_hours * parseFloat(venue[0].additional_hour_fee);

        // 4. Calculate overall total
        //const overallTotal = hallCharge + extraHourFee;
        //const overallTotal = Number(hallCharge) + Number(extraHourFee);

        console.log("hallcharge:", hallCharge)
        console.log("extraHourFee:", extraHourFee)

        // Update booking with new pricing information
        await updateBookingPricingModel(bookingId, {
            hallCharge,
            extraHourFee
        });

        res.status(200).json({ success: true, message: "Booking venue updated successfully." });
    } catch (error) {
        console.error("Error updating booking venue:", error);
        res.status(500).json({ success: false, message: "Failed to update booking venue." });
    }
};

export const updateDamageFee = async (req, res) => {
    const bookingId = req.params.id;
    const { damageFee, refundAmount, depositAmount, status } = req.body;

    try {
        const currentContract = await getContractById(bookingId);

        // change contract
        if (currentContract.deposit_amount < damageFee) {
            return res.status(400).json({ success: false, message: "Damage fee exceeds current deposit amount." });
        }
        const newRefundAmount = currentContract.deposit_amount - Number(damageFee);
        const newDamageFee = Number(damageFee);
        const newDepositAmount = Number(currentContract.deposit_amount);
        let newStatus = "";
        if (currentContract.deposit_amount == damageFee) {
            newStatus = "forfeited";
        } else {
            newStatus = "refunded";
        }

        console.log("contract data:", bookingId, newDamageFee, newRefundAmount, newDepositAmount, newStatus, "curr:", currentContract);
        const result = await updateDamageFeeModel(bookingId, newDamageFee, newRefundAmount, newDepositAmount, newStatus);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Damage fee not found or not updated." });
        }

        // change booking status
        const newBookingStatus = "done";
        await updateBookingStatusModel(bookingId, newBookingStatus);

        // change booking_pricing forfeited_deposit
        const currentBookingPrice = await getBookingPricingById(bookingId);
        const newBookingPrice = {
            menuPriceTotal: currentBookingPrice.menu_price_total,
            hallCharge: currentBookingPrice.hall_charge,
            extraHourFee: currentBookingPrice.extra_hour_fee,
            bitesPayment: currentBookingPrice.bites_payment,
            fountainPayment: currentBookingPrice.fountain_payment,
            otherPayment: currentBookingPrice.other_payment,
            forfeitedDeposit: newDamageFee
        };
        await updatePricingModel(bookingId, newBookingPrice);

        console.log("New booking price:", newBookingPrice);
        console.log("booking status:", status);
        console.log("contract data:", bookingId, newDamageFee, newRefundAmount, newDepositAmount, newStatus);

        res.status(200).json({ success: true, message: "Damage fee updated successfully." });
    } catch (error) {
        console.error("Error updating damage fee:", error);
        res.status(500).json({ success: false, message: "Failed to update damage fee." });
    }
}

// update menu budget
export const updateMenuFee = async (req, res) => {
    const bookingId = req.params.id;
    const { menueFee } = req.body;

    console.log("menueFee:", menueFee, bookingId)

    try {

        const bookingData = await getBookingById(bookingId);

        // change booking_pricing forfeited_deposit
        const currentBookingPrice = await getBookingPricingById(bookingId);
        const newBookingPrice = {
            menuPriceTotal: menueFee * bookingData.number_of_guests,
            hallCharge: currentBookingPrice.hall_charge,
            extraHourFee: currentBookingPrice.extra_hour_fee,
            bitesPayment: currentBookingPrice.bites_payment,
            fountainPayment: currentBookingPrice.fountain_payment,
            otherPayment: currentBookingPrice.other_payment,
            forfeitedDeposit: currentBookingPrice.forfeited_deposit
        };
        await updatePricingModel(bookingId, newBookingPrice);

        res.status(200).json({ success: true, message: "Menu fee updated successfully." });
    } catch (error) {
        console.error("Error updating menu fee:", error);
        res.status(500).json({ success: false, message: "Failed to update menu fee." });
    }
}


export const updateGuests = async (req, res) => {
    const bookingId = req.params.id;
    const { number_of_guests } = req.body;

    try {
        // get current booking
        const currBooking = await getBookingById(bookingId);

        // update current booking guest
        await updateGuestsModel(bookingId, number_of_guests);
        console.log(bookingId, number_of_guests)

        // get current venue 
        const venue = await getVenueBytId(currBooking.venue_id);

        let hallCharge = 0.00;
        if (number_of_guests >= venue.min_capacity && number_of_guests <= venue.max_capacity) {
            hallCharge = venue.price;
        } else if (number_of_guests > venue.max_capacity) {
            hallCharge = 0;
        } else if (number_of_guests < venue.min_capacity) {
            hallCharge = venue.price;
        }

        // Calculate extra hour fee if needed
        const extraHourFee = (currBooking.additional_hours || 0) * parseFloat(venue.additional_hour_fee || 0);

        // get curr booking pricing
        const currentBookingPrice = await getBookingPricingById(bookingId);
        const newBookingPrice = {
            menuPriceTotal: currentBookingPrice.menu_price_total,
            hallCharge: hallCharge,
            extraHourFee: extraHourFee,
            bitesPayment: currentBookingPrice.bites_payment,
            fountainPayment: currentBookingPrice.fountain_payment,
            otherPayment: currentBookingPrice.other_payment,
            forfeitedDeposit: currentBookingPrice.forfeited_deposit
        };
        // update curr booking pricing
        await updatePricingModel(bookingId, newBookingPrice);
        res.status(200).json({ success: true, message: "No.of guests updated successfully." });

    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update No.of guests.", error: err.message });
    }
}

export const updateAdditionalHours = async (req, res) => {
    const bookingId = req.params.id;
    const { additionalHours } = req.body;

    try {
        await updateAdditionalHoursModel(bookingId, additionalHours);

        const currBooking = await getBookingById(bookingId);
        // get current venue 
        const venue = await getVenueBytId(currBooking.venue_id);

        // get curr booking pricing
        const currentBookingPrice = await getBookingPricingById(bookingId);
        const newExtraHourFee = Number(venue.additional_hour_fee) * Number(additionalHours);
        const newBookingPrice = {
            menuPriceTotal: currentBookingPrice.menu_price_total,
            hallCharge: currentBookingPrice.hall_charge,
            extraHourFee: newExtraHourFee,
            bitesPayment: currentBookingPrice.bites_payment,
            fountainPayment: currentBookingPrice.fountain_payment,
            otherPayment: currentBookingPrice.other_payment,
            forfeitedDeposit: currentBookingPrice.forfeited_deposit
        };
        // update curr booking pricing
        await updatePricingModel(bookingId, newBookingPrice);

        res.status(200).json({ success: true, message: "Additional hours updated successfully." });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update additional hours.", error: err.message });
    }
}