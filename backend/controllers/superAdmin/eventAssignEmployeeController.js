// assignedEmployeeController.js
import AssignedEmployee from '../../models/superAdmin/eventAssignEmployee.js';

export const assignEmployeeToEvent = async (req, res) => {
    try {
        const requiredFields = ['employeeId', 'userRole', 'eventId'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        const result = await AssignedEmployee.assignEmployeeToEvent(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Employee assigned successfully',
            data: {
                assignmentId: result.employeeAssignId,
                eventId: result.eventId,
            }
        });

    } catch (error) {
        const statusCode = error.message.includes('not found') ? 404 : 
                          error.message.includes('Duplicate') ? 409 : 
                          error.message.includes('Invalid') ? 400 : 500;

        res.status(statusCode).json({
            success: false,
            message: error.message || 'Assignment failed'
        });
    }
};

// export const getAssignmentOptions = async (req, res) => {
//     try {
//         const options = await AssignedEmployee.getAssignmentOptions();
        
//         res.status(200).json({
//             success: true,
//             message: 'Assignment options fetched successfully',
//             data: {
//                 employees: options.employees,
//                 events: options.events
//             }
//         });

//     } catch (error) {
//         console.error("Error fetching options:", error);
//         res.status(500).json({
//             success: false,
//             message: error.message || "Failed to load assignment options"
//         });
//     }
// };


export const getAssignments = async (req, res) => {
  try {
    const assignments = await AssignedEmployee.getAssignments();
    res.status(200).json({ 
      success: true, 
      data: assignments || [] 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to load assignments" 
    });
  }
};

export const getAssignmentOptions = async (req, res) => {
  try {
    const options = await AssignedEmployee.getAssignmentOptions();
    res.status(200).json({
      success: true,
      data: {
        employees: options?.employees || [],
        events: options?.events || []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to load options"
    });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const result = await AssignedEmployee.updateAssignment(
      req.params.id,
      req.body
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    await AssignedEmployee.deleteAssignment(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};