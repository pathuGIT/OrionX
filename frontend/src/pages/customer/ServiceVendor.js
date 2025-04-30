import React, { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Star } from 'lucide-react';
import { getServiceVendors } from '../../services/EventService';
import { decryptCustId, decryptBookingId } from '../../utills/encryptionUtils';

const ServiceVendor = ({ customerID, bookingId }) => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [decryptedIds, setDecryptedIds] = useState({
        customerId: null,
        bookingId: null
    });

    useEffect(() => {
        const decryptIds = () => {
            try {
                if (!customerID || !bookingId) {
                    throw new Error("Missing customer or booking ID");
                }

                const decryptedCustomerId = decryptCustId(customerID);
                const decryptedBookingId = decryptBookingId(bookingId);

                if (!decryptedCustomerId || !decryptedBookingId) {
                    throw new Error("Invalid customer or booking ID format");
                }

                setDecryptedIds({
                    customerId: decryptedCustomerId,
                    bookingId: decryptedBookingId
                });

            } catch (error) {
                console.error("Decryption error:", error);
                setError(error.message);
                setLoading(false);
            }
        };

        decryptIds();
    }, [customerID, bookingId]);

    useEffect(() => {
        if (!decryptedIds.customerId || !decryptedIds.bookingId) return;

        const fetchVendors = async () => {
            try {
                const data = await getServiceVendors(
                    decryptedIds.customerId,
                    decryptedIds.bookingId
                );
                setVendors(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchVendors();
    }, [decryptedIds]);

    if (loading) return (
        <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading vendors...</p>
        </div>
    );

    if (error) return (
        <div className="text-center py-12">
            <p className="text-red-500 text-xl">{error}</p>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Assigned Service Vendors
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map((vendor) => (
                    <div key={vendor.Vendor_ID} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {vendor.Vendor_Name || "Professional Vendor"}
                                </h3>
                                <div className="flex items-center text-yellow-400">
                                    <Star className="w-5 h-5" />
                                    <span className="ml-1">5.0</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center text-gray-600">
                                    <Phone className="w-5 h-5 mr-2 text-blue-500" />
                                    <a href={`tel:${vendor.Contact_no}`} className="hover:text-blue-600">
                                        {vendor.Contact_no}
                                    </a>
                                </div>
                                
                                <div className="flex items-center text-gray-600">
                                    <Mail className="w-5 h-5 mr-2 text-blue-500" />
                                    <a href={`mailto:${vendor.Email}`} className="hover:text-blue-600 truncate">
                                        {vendor.Email}
                                    </a>
                                </div>
                                
                                <div className="flex items-start text-gray-600">
                                    <MapPin className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" />
                                    <span className="break-words">{vendor.Address}</span>
                                </div>
                            </div>

                            {vendor.services && (
                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <h4 className="text-sm font-semibold text-gray-500 mb-2">PROVIDED SERVICES</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {vendor.services.map((service) => (
                                            <span 
                                                key={service.Event_Service_ID}
                                                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                                            >
                                                {service.Event_Service_Name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {vendors.length === 0 && !loading && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🏢</div>
                    <p className="text-xl text-gray-600">No vendors assigned yet</p>
                </div>
            )}
        </div>
    );
};

export default ServiceVendor;