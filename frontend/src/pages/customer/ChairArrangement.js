import React from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { decryptBookingId } from '../../utills/encryptionUtils';
import { createOrUpdateArrangement } from '../../services/EventService';

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
    const [error, setError] = React.useState('');
    const decryptedBookingId = decryptBookingId(encryptedBookingId);

    const initialValues = {
        headPax: 10,
        topClothColor: 'white',
        tableClothColor: 'black',
        bowColor: 'red',
        chairCoverColor: 'black'
    };

    const handleSubmit = async (values) => {
        try {
            await createOrUpdateArrangement(decryptedBookingId, values);
            setError('');
            alert('Arrangement saved successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">✨ Table Arrangement Setup</h2>
                <p className="text-gray-500">Customize your table settings and decorations</p>
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={arrangementSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Head Table Capacity</label>
                            <Field
                                type="number"
                                name="headPax"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                            />
                            <ErrorMessage name="headPax" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {[
                            { label: 'Table Cloth', name: 'tableClothColor' },
                            { label: 'Chair Cover', name: 'chairCoverColor' },
                            { label: 'Bow', name: 'bowColor' },
                            { label: 'Top Cloth', name: 'topClothColor' },
                        ].map(({ label, name }) => (
                            <div key={name}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{label} Color</label>
                                <Field
                                    as="select"
                                    name={name}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                                >
                                    {colorOptions[name].map(color => (
                                        <option key={color} value={color}>
                                            {color.charAt(0).toUpperCase() + color.slice(1)}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                        ))}

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Arrangement'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ChairArrangement;