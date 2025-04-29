import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/Authcontext";
import { getEventServices, saveSelectedServices } from "../../services/EventService";
import { CheckCircle, XCircle, PartyPopper, Check, ShoppingCart } from "lucide-react";

const EventServiceSelector = () => {
    const { user } = useContext(AuthContext);
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const customerID = sessionStorage.getItem("id");
        if (!customerID) {
            setError("Customer ID not found in session.");
            setLoading(false);
            return;
        }

        getEventServices()
            .then(data => {
                // Validate and transform API response
                if (!data || !Array.isArray(data)) {
                    throw new Error("Invalid services data format");
                }
                
                const validatedServices = data.map(service => ({
                    id: service.Event_Service_ID,
                    name: service.Event_Service_Name
                }));

                setServices(validatedServices);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Service fetch error:", error);
                setError(error.message || "Failed to load services");
                setLoading(false);
            });
    }, [user]);

    const toggleService = (serviceId) => {
        setSelectedServices(prev => 
            prev.includes(serviceId)
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const customerID = sessionStorage.getItem("id");
            await saveSelectedServices(customerID, selectedServices);
            
            setSuccessMessage("Services saved successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
            setSelectedServices([]);
        } catch (error) {
            console.error("Save error:", error);
            setError("Failed to save selections. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="text-center p-8">
            <p className="text-xl text-gray-600">Loading services...</p>
        </div>
    );

    if (error) return (
        <div className="text-center p-8">
            <p className="text-red-600 text-xl">{error}</p>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Select Event Services
            </h2>

            {successMessage && (
                <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg animate-fade-in">
                    <Check className="inline mr-2" />{successMessage}
                </div>
            )}

            {services.length === 0 ? (
                <div className="text-center py-12">
                    <PartyPopper className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">No services available at the moment.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {services.map((service) => (
                            <div 
                                key={service.id}
                                onClick={() => toggleService(service.id)}
                                className={`relative cursor-pointer bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
                                    selectedServices.includes(service.id)
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-transparent hover:border-blue-200"
                                }`}
                            >
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {service.name}
                                        </h3>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                            selectedServices.includes(service.id)
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200"
                                        }`}>
                                            {selectedServices.includes(service.id) && <Check className="w-4 h-4" />}
                                        </div>
                                    </div>
                                    
                                    <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <ShoppingCart className="w-12 h-12 text-gray-400" />
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        {selectedServices.includes(service.id) ? (
                                            <>
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span className="text-green-600">Selected</span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-4 h-4 text-red-500" />
                                                <span className="text-red-600">Not Selected</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || selectedServices.length === 0}
                            className={`px-8 py-3 rounded-lg text-white font-medium transition-all ${
                                submitting || selectedServices.length === 0
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {submitting ? (
                                "Saving..."
                            ) : (
                                `Save Selected Services (${selectedServices.length})`
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default EventServiceSelector;