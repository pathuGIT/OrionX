export const encryptBookingId = (bookingId) => {
    // Simple Base64 encoding (not secure for sensitive data)
    return btoa(bookingId);
};

export const decryptBookingId = (encryptedId) => {
    // Decode the Base64 string
    return atob(encryptedId);
};