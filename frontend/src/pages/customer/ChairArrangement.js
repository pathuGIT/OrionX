import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { decryptBookingId } from '../../utills/encryptionUtils';
import { 
    createOrUpdateArrangement,
    getArrangementsByBooking 
} from '../../services/EventService';
import { FiCheckCircle, FiAlertCircle, FiLoader, FiUsers, FiCoffee } from 'react-icons/fi';

const colorOptions = {
    topClothColor: ['white', 'red', 'Gold', 'Chinese gold'],
    tableClothColor: ['black', 'white'],
    bowColor: ['red', 'Gold', 'white'],
    chairCoverColor: ['black', 'white']
};

const arrangementSchema = Yup.object().shape({
    headPax: Yup.number().required('Required').min(1, 'Minimum 1 guest'),
    topClothColor: Yup.string().required('Required').oneOf(colorOptions.topClothColor),
    tableClothColor: Yup.string().required('Required').oneOf(colorOptions.tableClothColor),
    bowColor: Yup.string().required('Required').oneOf(colorOptions.bowColor),
    chairCoverColor: Yup.string().required('Required').oneOf(colorOptions.chairCoverColor)
});

const ChairArrangement = () => {
    const { bookingId: encryptedBookingId } = useParams();
    const [error, setError] = useState('');
    const [existingData, setExistingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const decryptedBookingId = decryptBookingId(encryptedBookingId);

    useEffect(() => {
    const fetchData = async () => {
        try {
            const arrangements = await getArrangementsByBooking(decryptedBookingId);
            if (arrangements?.length > 0) {
                const mainArrangement = arrangements[0];
                setExistingData({
                    headPax: mainArrangement.Head_Table_Pax || 10,
                    topClothColor: mainArrangement.Colors?.Top || 'white',
                    tableClothColor: mainArrangement.Colors?.Table || 'black',
                    bowColor: mainArrangement.Colors?.Bow || 'red',
                    chairCoverColor: mainArrangement.Colors?.Chair || 'black',
                    lastUpdated: new Date(
                        mainArrangement.UpdatedAt || Date.now()
                    ).toLocaleDateString(),
                    reservations: mainArrangement.Reservations || []
                });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (decryptedBookingId) fetchData();
}, [decryptedBookingId, success]);

    const handleSubmit = async (values) => {
        try {
            setError('');
            await createOrUpdateArrangement(decryptedBookingId, values);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            const updatedData = await getArrangementsByBooking(decryptedBookingId);
            if (updatedData?.length > 0) {
                setExistingData({
                    ...updatedData[0],
                    reservations: updatedData[0].Reservations || []
                });
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const StatusIndicator = ({ type, message }) => (
        <div className={`p-4 rounded-xl mb-6 flex items-center space-x-3
            ${type === 'error' ? 'bg-red-50 border-red-200' : 
            type === 'success' ? 'bg-green-50 border-green-200' : ''}`}>
            {type === 'error' ? (
                <FiAlertCircle className="text-red-600 text-xl" />
            ) : (
                <FiCheckCircle className="text-green-600 text-xl" />
            )}
            <span className={`font-medium ${type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                {message}
            </span>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center animate-pulse">
                    <FiLoader className="text-4xl text-indigo-600 animate-spin mx-auto" />
                    <p className="mt-4 text-gray-600">Loading arrangement details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                            <FiCoffee className="text-indigo-600" />
                            Table Arrangement Designer
                        </h1>
                        <p className="text-gray-500">
                            {existingData ? 'Edit existing' : 'Create new'} table configuration
                        </p>
                    </div>

                    {error && <StatusIndicator type="error" message={error} />}
                    {success && <StatusIndicator type="success" message="Arrangement saved successfully!" />}

                    {existingData && (
                        <div className="mb-6 bg-blue-50/50 p-4 rounded-xl border border-blue-200">
                            <div className="flex items-center space-x-3 text-blue-600">
                                <FiCheckCircle className="text-xl" />
                                <div>
                                    <h3 className="font-semibold">Existing Configuration Found</h3>
                                    <p className="text-sm">Last updated: {existingData.lastUpdated}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <Formik
                        initialValues={existingData || {
                            headPax: 10,
                            topClothColor: 'white',
                            tableClothColor: 'black',
                            bowColor: 'red',
                            chairCoverColor: 'black'
                        }}
                        enableReinitialize
                        validationSchema={arrangementSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, values }) => (
                            <Form className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Form Fields */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Head Table Capacity
                                        </label>
                                        <Field
                                            name="headPax"
                                            type="number"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                                        />
                                        <ErrorMessage name="headPax" component="div" className="text-red-500 text-sm" />
                                    </div>

                                    {/* Color Selectors */}
                                    {[
                                        { label: 'Table Cloth', name: 'tableClothColor' },
                                        { label: 'Chair Cover', name: 'chairCoverColor' },
                                        { label: 'Bow', name: 'bowColor' },
                                        { label: 'Top Cloth', name: 'topClothColor' },
                                    ].map(({ label, name }) => (
                                        <div key={name} className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                {label} Color
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    as="select"
                                                    name={name}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 appearance-none transition-all"
                                                >
                                                    {colorOptions[name].map(color => (
                                                        <option key={color} value={color}>
                                                            {color.charAt(0).toUpperCase() + color.slice(1)}
                                                        </option>
                                                    ))}
                                                </Field>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <FiLoader className="animate-spin" />
                                            <span>Saving Changes...</span>
                                        </div>
                                    ) : existingData ? 'Update Arrangement' : 'Save Arrangement'}
                                </button>
                            </Form>
                        )}
                    </Formik>

                    {/* Reservations Section */}
                    {existingData?.reservations?.length > 0 && (
                        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FiUsers className="text-indigo-600" />
                                Table Reservations
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {existingData.reservations.map((reservation, index) => (
                                    <div 
                                        key={index}
                                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-indigo-100 p-2 rounded-lg">
                                                <FiCoffee className="text-indigo-600 text-xl" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Table #{reservation.Table_Number}
                                                </p>
                                                <p className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                                    {reservation.Reserve_Name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChairArrangement;