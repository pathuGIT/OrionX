export const encryptBookingId = (bookingId) => {
    // Simple Base64 encoding (not secure for sensitive data)
    return btoa(bookingId);
};

export const decryptBookingId = (encryptedId) => {
    try {
        // Decode the Base64 string
        return atob(encryptedId);
    } catch (error) {
        console.error("Failed to decrypt booking ID:", error);
        return null; // Return null if decryption fails
    }
};