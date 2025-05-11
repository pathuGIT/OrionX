import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createPlanBar, getPlanBar, updatePlanBar, deletePlanBar } from '../../services/EventService';
import { decryptBookingId } from '../../utills/encryptionUtils';

const PlanBarForm = () => {
    const { bookingId: encryptedBookingId } = useParams();
    const [formData, setFormData] = useState({
        LiquorTimeFrom: '',
        LiquorTimeTo: '',
        BarPax: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [existingPlan, setExistingPlan] = useState(null);
    const decryptedBookingId = decryptBookingId(encryptedBookingId);

    useEffect(() => {
        const fetchExistingPlan = async () => {
            try {
                const plan = await getPlanBar(decryptedBookingId);
                if (plan) {
                    setExistingPlan(plan);
                    setFormData({
                        LiquorTimeFrom: plan.LiquorTimeFrom?.slice(0,5) || '',
                        LiquorTimeTo: plan.LiquorTimeTo?.slice(0,5) || '',
                        BarPax: plan.BarPax
                    });
                }
            } catch (error) {
                console.error('Error fetching bar plan:', error);
            }
        };
        fetchExistingPlan();
    }, [decryptedBookingId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.LiquorTimeFrom || !formData.LiquorTimeTo || !formData.BarPax) {
            setError('All fields are required');
            return;
        }

        try {
            let result;
            if (existingPlan) {
                result = await updatePlanBar(decryptedBookingId, formData);
                setSuccess('Bar plan updated successfully!');
            } else {
                result = await createPlanBar(decryptedBookingId, formData);
                setSuccess('Bar plan created successfully!');
            }
            setExistingPlan(result);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this bar plan?')) {
            try {
                await deletePlanBar(decryptedBookingId);
                setSuccess('Bar plan deleted successfully!');
                setExistingPlan(null);
                setFormData({
                    LiquorTimeFrom: '',
                    LiquorTimeTo: '',
                    BarPax: ''
                });
            } catch (error) {
                setError(error.message);
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {existingPlan ? 'Manage Bar Plan' : 'Bar Plan'}
            </h2>

            {/* Status Messages */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Service Start Time
                        </label>
                        <input
                            type="time"
                            name="LiquorTimeFrom"
                            value={formData.LiquorTimeFrom}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Service End Time
                        </label>
                        <input
                            type="time"
                            name="LiquorTimeTo"
                            value={formData.LiquorTimeTo}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Number of Guests
                    </label>
                    <input
                        type="number"
                        name="BarPax"
                        value={formData.BarPax}
                        onChange={handleChange}
                        min="1"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter number of guests"
                        required
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        {existingPlan ? 'Update Plan' : 'Create Plan'}
                    </button>
                    
                    {existingPlan && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                        >
                            Delete Plan
                        </button>
                    )}
                </div>
            </form>

            {existingPlan && (
                <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <h3 className="text-xl font-semibold text-blue-800 mb-4">
                        Current Bar Plan Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-gray-700">
                        <div>
                            <p className="text-sm font-medium">Start Time</p>
                            <p className="text-lg font-semibold">
                                {existingPlan.LiquorTimeFrom?.slice(0,5) || '--:--'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">End Time</p>
                            <p className="text-lg font-semibold">
                                {existingPlan.LiquorTimeTo?.slice(0,5) || '--:--'}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm font-medium">Guests Expected</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {existingPlan.BarPax}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanBarForm;