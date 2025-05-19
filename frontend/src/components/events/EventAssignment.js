import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  getAssignmentOptions, 
  assignEmployeeToEvent,
  getAssignments,
  updateAssignment,
  deleteAssignment 
} from '../../services/EventService';

const assignmentSchema = Yup.object().shape({
  eventId: Yup.string().required('Event selection is required'),
  employeeId: Yup.string().required('Employee selection is required'),
  userRole: Yup.string()
    .required('Role is required')
    .oneOf(['owner', 'chef', 'waiter', 'security', 'decorators'], 'Invalid role selection')
});

const EventAssignment = () => {
  const [options, setOptions] = useState({ employees: [], events: [] });
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [optionsData, assignmentsData] = await Promise.all([
          getAssignmentOptions(),
          getAssignments()
        ]);
        
        setOptions({
          employees: optionsData?.employees || [],
          events: optionsData?.events || []
        });
        
        setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setError('');
      const selectedEvent = options.events.find(e => e?.id === values.eventId);
      
      if (!selectedEvent) {
        throw new Error('Selected event not found');
      }

      const result = await assignEmployeeToEvent(values);
      
      setAssignments(prev => [{
        ...result,
        employee: options.employees.find(e => e?.id === values.employeeId) || {},
        event: selectedEvent
      }, ...(Array.isArray(prev) ? prev : [])]);

      resetForm();
      setSuccess(`Assignment ${result?.assignmentId} created successfully`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create assignment');
    }
  };

  const handleDelete = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment(assignmentId);
        setAssignments(prev => 
          (Array.isArray(prev) ? prev : []).filter(a => a?.assignmentId !== assignmentId)
        );
        setSuccess('Assignment deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message || 'Failed to delete assignment');
      }
    }
  };

  const handleUpdate = async (values) => {
    try {
      const updated = await updateAssignment(editData?.assignmentId, values);
      setAssignments(prev => 
        (Array.isArray(prev) ? prev : []).map(a => 
          a?.assignmentId === updated?.assignmentId ? { ...a, ...updated } : a
        )
      );
      setEditData(null);
      setSuccess('Assignment updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update assignment');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Safe array access
  const safeEmployees = Array.isArray(options.employees) ? options.employees : [];
  const safeEvents = Array.isArray(options.events) ? options.events : [];
  const safeAssignments = Array.isArray(assignments) ? assignments : [];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Assignment Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🎯 Event Staff Assignment</h1>
          <p className="text-gray-500">Assign employees to upcoming events with role specifications</p>
        </header>

        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        )}

        <Formik
          initialValues={{ eventId: '', employeeId: '', userRole: '' }}
          validationSchema={assignmentSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Event Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Event</label>
                <Field
                  as="select"
                  name="eventId"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                >
                  <option value="">Select an event</option>
                  {safeEvents.map(event => (
                    <option key={event?.id} value={event?.id}>
                      {event?.label || 'Unknown Event'}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="eventId" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Employee Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Employee</label>
                <Field
                  as="select"
                  name="employeeId"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                >
                  <option value="">Select an employee</option>
                  {safeEmployees.map(employee => (
                    <option key={employee?.id} value={employee?.id}>
                      {employee?.label || 'Unknown Employee'}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="employeeId" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <Field
                  as="select"
                  name="userRole"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                >
                  <option value="">Select a role</option>
                  <option value="owner">Owner</option>
                  <option value="chef">Chef</option>
                  <option value="waiter">Waiter</option>
                  <option value="security">Security</option>
                  <option value="decorators">Decorator</option>
                </Field>
                <ErrorMessage name="userRole" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50"
                >
                  {isSubmitting ? 'Assigning...' : 'Create Assignment'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Edit Modal */}
      {editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Assignment</h3>
            <Formik
              initialValues={{ userRole: editData?.userRole || '' }}
              validationSchema={Yup.object({
                userRole: assignmentSchema.fields.userRole
              })}
              onSubmit={handleUpdate}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Role</label>
                    <Field
                      as="select"
                      name="userRole"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200"
                    >
                      <option value="owner">Owner</option>
                      <option value="chef">Chef</option>
                      <option value="waiter">Waiter</option>
                      <option value="security">Security</option>
                      <option value="decorators">Decorator</option>
                    </Field>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setEditData(null)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg"
                    >
                      Update
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Assignments List */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Active Assignments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeAssignments.map(assignment => (
            <div
              key={assignment?.assignmentId || Math.random()}
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group"
            >
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setEditData(assignment)}
                  className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(assignment?.assignmentId)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  🗑️
                </button>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-lg">
                      {assignment?.userRole?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {assignment?.employee?.name || 'Unknown Employee'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {assignment?.event?.label || 'Unknown Event'}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                      {assignment?.userRole || 'Unknown Role'}
                    </span>
                    <span className="text-gray-500">
                      {assignment?.eventDate ? new Date(assignment.eventDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric'
                      }) : 'No Date'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {safeAssignments.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-400">
              No assignments found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventAssignment;