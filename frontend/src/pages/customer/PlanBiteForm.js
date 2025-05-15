import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PlanBiteMenu, getBiteMenu, UpdateBiteMenu, deleteBiteMenu, getBiteMenuItems } from '../../services/EventService';
import { decryptBookingId } from '../../utills/encryptionUtils';
import { ShoppingCartIcon, TrashIcon, PlusCircleIcon, PencilSquareIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';

const PlanBiteForm = () => {
    const { bookingId: encryptedBookingId } = useParams();
    const [menuItems, setMenuItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const [existingPlan, setExistingPlan] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const decryptedBookingId = decryptBookingId(encryptedBookingId);

    useEffect(() => {
        const initializeData = async () => {
            try {
                // Fetch available menu items
                const items = await getBiteMenuItems();
                setMenuItems(items || []);

                // Check for existing plan
                const existing = await getBiteMenu(decryptedBookingId);
                if (existing?.biteItems?.length > 0) {
                    setExistingPlan(existing);
                    const initialSelected = {};
                    existing.biteItems.forEach(item => {
                        initialSelected[item.menu_type_id] = item.Quantity;
                    });
                    setSelectedItems(initialSelected);
                }
            } catch (error) {
                console.error('Initialization error:', error);
                setMenuItems([]);
                setExistingPlan(null);
            }
        };
        initializeData();
    }, [decryptedBookingId]);

    const handleQuantityChange = (menuTypeId, quantity) => {
        setSelectedItems(prev => ({
            ...prev,
            [menuTypeId]: Math.max(0, Number(quantity))
        }));
    };

    const calculateTotal = () => {
        return menuItems.reduce((total, item) => {
            const price = typeof item.price === 'number' ? item.price : 0;
            const qty = selectedItems[item.menu_type_id] || 0;
            return total + (qty * price);
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const biteItems = Object.entries(selectedItems)
            .filter(([_, qty]) => qty > 0)
            .map(([menu_type_id, quantity]) => ({
                menu_type_id,
                quantity: Number(quantity)
            }));

        if (biteItems.length === 0) {
            setError('Please select at least one menu item');
            return;
        }

        try {
            let result;
            if (existingPlan) {
                result = await UpdateBiteMenu(decryptedBookingId, biteItems);
            } else {
                result = await PlanBiteMenu(decryptedBookingId, biteItems);
            }
            setSuccess(result.message);
            setExistingPlan(result);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this bite plan?')) {
            try {
                await deleteBiteMenu(decryptedBookingId);
                setSuccess('Bite plan deleted successfully!');
                setExistingPlan(null);
                setSelectedItems({});
            } catch (error) {
                setError(error.message);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl mt-8 border border-orange-100">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-orange-100 rounded-lg">
                    <ShoppingCartIcon className="w-8 h-8 text-orange-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">
                    {existingPlan ? 'Manage Bite Menu' : 'Plan Your Bite Menu'}
                </h2>
            </div>

            {/* Status Messages */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{success}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {menuItems.map(item => (
                        <div key={item.menu_type_id} className="p-4 bg-white rounded-xl border border-orange-100 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {item.menu_type_name}
                                </h3>
                                <div className="flex items-center gap-2 text-orange-600">
                                    <CurrencyRupeeIcon className="w-5 h-5" />
                                    <span className="font-medium">{item.price.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(item.menu_type_id, (selectedItems[item.menu_type_id] || 0) - 1)}
                                    className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={selectedItems[item.menu_type_id] || 0}
                                    onChange={(e) => handleQuantityChange(
                                        item.menu_type_id,
                                        parseInt(e.target.value) || 0
                                    )}
                                    className="w-20 text-center border-2 border-orange-100 rounded-lg py-1"
                                    min="0"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(item.menu_type_id, (selectedItems[item.menu_type_id] || 0) + 1)}
                                    className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-6 bg-white rounded-xl border border-orange-100 shadow-sm">
                    <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-gray-800">
                            Total Price:
                            <span className="ml-2 text-orange-600">
                                <CurrencyRupeeIcon className="inline w-6 h-6" />
                                {calculateTotal().toFixed(2)}
                            </span>
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02]"
                            >
                                {existingPlan ? (
                                    <>
                                        <PencilSquareIcon className="w-5 h-5" />
                                        Update Plan
                                    </>
                                ) : (
                                    <>
                                        <PlusCircleIcon className="w-5 h-5" />
                                        Create Plan
                                    </>
                                )}
                            </button>

                            {existingPlan && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02]"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                    Delete Plan
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </form>

            {existingPlan && (
                <div className="mt-10 p-6 bg-white rounded-xl border border-orange-100 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <ShoppingCartIcon className="w-6 h-6 text-orange-500" />
                        Current Bite Plan
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {existingPlan.biteItems.map(item => (
                            <div key={item.Bite_ID} className="p-4 bg-orange-50 rounded-lg flex justify-between items-center">
                                <div>
                                    <h4 className="font-medium text-gray-800">{item.menu_type_name}</h4>
                                    <p className="text-sm text-gray-600">Quantity: {item.Quantity}</p>
                                </div>
                                <div className="text-orange-600 font-medium">
                                    <CurrencyRupeeIcon className="inline w-5 h-5" />
                                    {(item.Quantity * item.price).toFixed(2)}
                                </div>
                            </div>
                        ))}
                        <div className="mt-4 pt-4 border-t border-orange-100">
                            <div className="flex justify-between items-center text-xl font-bold text-orange-800">
                                <span>Grand Total:</span>
                                <span>
                                    <CurrencyRupeeIcon className="inline w-6 h-6" />
                                    {existingPlan.totalPrice.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanBiteForm;