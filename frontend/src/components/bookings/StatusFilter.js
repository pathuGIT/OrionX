import React from 'react';

export const StatusFilter = ({ currentStatus, onChange }) => {
    const statuses = ['all', 'pending', 'confirmed', 'done', 'cancelled'];

    return (
        <div className="flex space-x-4 mb-4">
            {statuses.map((status) => (
                <button
                    key={status}
                    className={`px-4 py-2 rounded-lg ${
                        currentStatus === status ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    }`}
                    onClick={() => onChange(status)}
                >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
            ))}
        </div>
    );
};
