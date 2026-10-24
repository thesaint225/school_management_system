import {
  validateClassResponse,
  validateClassResponseList,
  validateStudent,
  validateStudentList,
  validateDeleteClassResult,
} from '../utils/apiValidator.js';

// classApi.js - REST API Client connecting Frontend to Spring Boot & Database for Classes
const API_BASE_URL = 'http://localhost:8080/api/classes';

/**
 * Fetch all classes from the database via Spring Boot REST API.
 * Validates the response array against the ClassResponseDto contract.
 * @param {boolean} activeOnly - If true, filters for active classes only
 * @returns {Promise<Array|null>} Array of validated classes, or null if network error / validation failure
 */
export async function fetchClassesFromDb(activeOnly = false) {
  try {
    const url = activeOnly ? `${API_BASE_URL}?activeOnly=true` : API_BASE_URL;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const rawData = await response.json();
    const validatedData = validateClassResponseList(rawData, 'GET /api/classes');
    console.log(`🌐 Loaded & validated ${validatedData.length} class records from database (activeOnly: ${activeOnly}).`);
    return validatedData;
  } catch (error) {
    console.warn('⚠️ Could not load valid class data from database.', error);
    return null;
  }
}

/**
 * Fetch a single class by ID from DB.
 * @param {number|string} id
 * @returns {Promise<Object>} Validated ClassResponseDto
 */
export async function fetchClassByIdFromDb(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load class #${id}: HTTP ${response.status}`);
  }

  const raw = await response.json();
  return validateClassResponse(raw, `GET /api/classes/${id}`);
}

/**
 * Fetch all students enrolled in a specific class.
 * @param {number|string} classId
 * @returns {Promise<Array>} Array of validated Student objects
 */
export async function fetchClassStudentsFromDb(classId) {
  const response = await fetch(`${API_BASE_URL}/${classId}/students`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load students for class #${classId}: HTTP ${response.status}`);
  }

  const raw = await response.json();
  return validateStudentList(raw, `GET /api/classes/${classId}/students`);
}

/**
 * Create a new class into the database via Spring Boot POST /api/classes.
 * @param {Object} classDto
 * @returns {Promise<Object>} The created & validated ClassResponseDto entity
 */
export async function createClassInDb(classDto) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(classDto),
  });

  if (!response.ok) {
    let errorDetails = `HTTP ${response.status}`;
    try {
      const errorJson = await response.json();
      errorDetails = errorJson.message || JSON.stringify(errorJson);
    } catch {
      const text = await response.text();
      if (text) errorDetails = text;
    }
    throw new Error(errorDetails);
  }

  const raw = await response.json();
  const createdClass = validateClassResponse(raw, 'POST /api/classes');
  console.log('✅ Successfully created & validated class in database:', createdClass);
  return createdClass;
}

/**
 * Update an existing class in the database via Spring Boot PUT /api/classes/{id}.
 * @param {number|string} id - Class ID
 * @param {Object} classDto - Updated class DTO payload
 * @returns {Promise<Object>} The updated & validated ClassResponseDto entity
 */
export async function updateClassInDb(id, classDto) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(classDto),
  });

  if (!response.ok) {
    let errorDetails = `HTTP ${response.status}`;
    try {
      const errorJson = await response.json();
      errorDetails = errorJson.message || JSON.stringify(errorJson);
    } catch {
      const text = await response.text();
      if (text) errorDetails = text;
    }
    throw new Error(errorDetails);
  }

  const raw = await response.json();
  const updatedClass = validateClassResponse(raw, `PUT /api/classes/${id}`);
  console.log(`✅ Successfully updated & validated class #${id} in database:`, updatedClass);
  return updatedClass;
}

/**
 * Delete or safely deactivate a class in the database via Spring Boot DELETE /api/classes/{id}.
 * @param {number|string} id - Class ID
 * @returns {Promise<Object>} Validated result object from backend
 */
export async function deleteOrDeactivateClassInDb(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok && response.status !== 204) {
    let errorDetails = `HTTP ${response.status}`;
    try {
      const errorJson = await response.json();
      errorDetails = errorJson.message || JSON.stringify(errorJson);
    } catch {
      const text = await response.text();
      if (text) errorDetails = text;
    }
    throw new Error(errorDetails);
  }

  try {
    const rawResult = await response.json();
    const result = validateDeleteClassResult(rawResult, `DELETE /api/classes/${id}`);
    console.log(`🗑️ Deleted or deactivated & validated class #${id}:`, result);
    return result;
  } catch {
    return { success: true, message: `Class #${id} processed.`, status: 'DELETED', action: 'DELETED' };
  }
}

/**
 * Assign or move a student to a class via Spring Boot POST /api/classes/{classId}/students/{studentId}.
 * @param {number|string} classId
 * @param {number|string} studentId
 * @returns {Promise<Object>} Updated & validated student entity
 */
export async function assignStudentToClassInDb(classId, studentId) {
  const response = await fetch(`${API_BASE_URL}/${classId}/students/${studentId}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    let errorDetails = `HTTP ${response.status}`;
    try {
      const errorJson = await response.json();
      errorDetails = errorJson.message || JSON.stringify(errorJson);
    } catch {
      const text = await response.text();
      if (text) errorDetails = text;
    }
    throw new Error(errorDetails);
  }

  const raw = await response.json();
  return validateStudent(raw, `POST /api/classes/${classId}/students/${studentId}`);
}

/**
 * Remove student from a class via Spring Boot DELETE /api/classes/{classId}/students/{studentId}.
 * @param {number|string} classId
 * @param {number|string} studentId
 * @returns {Promise<Object>} Updated & validated student entity
 */
export async function removeStudentFromClassInDb(classId, studentId) {
  const response = await fetch(`${API_BASE_URL}/${classId}/students/${studentId}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    let errorDetails = `HTTP ${response.status}`;
    try {
      const errorJson = await response.json();
      errorDetails = errorJson.message || JSON.stringify(errorJson);
    } catch {
      const text = await response.text();
      if (text) errorDetails = text;
    }
    throw new Error(errorDetails);
  }

  const raw = await response.json();
  return validateStudent(raw, `DELETE /api/classes/${classId}/students/${studentId}`);
}
