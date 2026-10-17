// classApi.js - REST API Client connecting Frontend to Spring Boot & Database for Classes
const API_BASE_URL = 'http://localhost:8080/api/classes';

/**
 * Fetch all classes from the database via Spring Boot REST API.
 * @param {boolean} activeOnly - If true, filters for active classes only
 * @returns {Promise<Array|null>} Array of classes, or null if network error
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

    const data = await response.json();
    console.log(`🌐 Loaded ${data.length} class records from database (activeOnly: ${activeOnly}).`);
    return data;
  } catch (error) {
    console.warn('⚠️ Could not connect to backend database for classes.', error);
    return null;
  }
}

/**
 * Fetch a single class by ID from DB.
 * @param {number|string} id
 * @returns {Promise<Object>}
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

  return await response.json();
}

/**
 * Fetch all students enrolled in a specific class.
 * @param {number|string} classId
 * @returns {Promise<Array>} Array of Student objects
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

  return await response.json();
}

/**
 * Create a new class into the database via Spring Boot POST /api/classes.
 * @param {Object} classDto
 * @returns {Promise<Object>} The created ClassResponseDto entity
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

  const createdClass = await response.json();
  console.log('✅ Successfully created class in database:', createdClass);
  return createdClass;
}

/**
 * Update an existing class in the database via Spring Boot PUT /api/classes/{id}.
 * @param {number|string} id - Class ID
 * @param {Object} classDto - Updated class DTO payload
 * @returns {Promise<Object>} The updated ClassResponseDto entity
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

  const updatedClass = await response.json();
  console.log(`✅ Successfully updated class #${id} in database:`, updatedClass);
  return updatedClass;
}

/**
 * Delete or safely deactivate a class in the database via Spring Boot DELETE /api/classes/{id}.
 * @param {number|string} id - Class ID
 * @returns {Promise<Object>} Result object from backend
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
    const result = await response.json();
    console.log(`🗑️ Deleted or deactivated class #${id}:`, result);
    return result;
  } catch {
    return { success: true };
  }
}

/**
 * Assign or move a student to a class via Spring Boot POST /api/classes/{classId}/students/{studentId}.
 * @param {number|string} classId
 * @param {number|string} studentId
 * @returns {Promise<Object>} Updated student entity
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

  return await response.json();
}

/**
 * Remove student from a class via Spring Boot DELETE /api/classes/{classId}/students/{studentId}.
 * @param {number|string} classId
 * @param {number|string} studentId
 * @returns {Promise<Object>}
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

  return await response.json();
}
