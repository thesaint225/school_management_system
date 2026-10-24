import { validateStudent, validateStudentList } from '../utils/apiValidator.js';

// studentApi.js - REST API Client connecting Frontend to Spring Boot & Database
const API_BASE_URL = 'http://localhost:8080/api/students';

/**
 * Fetch all students from the database via Spring Boot REST API.
 * Validates the response shape before returning it to the application.
 * Returns array of validated students, or null if network error / validation failure / server offline.
 * @returns {Promise<Array<Object>|null>}
 */
export async function fetchStudentsFromDb() {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const rawData = await response.json();
    const validatedData = validateStudentList(rawData, 'GET /api/students');
    console.log(`🌐 Loaded & validated ${validatedData.length} student records from database.`);
    return validatedData;
  } catch (error) {
    console.warn('⚠️ Could not load valid student data from database. Running with local cache / seed data.', error);
    return null;
  }
}

/**
 * Register a new student into the database via Spring Boot POST /api/students.
 * @param {Object} studentRegistrationDto
 * @returns {Promise<Object>} The persisted Student entity returned from DB
 */
export async function registerStudentInDb(studentRegistrationDto) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(studentRegistrationDto),
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

  const createdRaw = await response.json();
  const createdStudent = validateStudent(createdRaw, 'POST /api/students');
  console.log('✅ Successfully persisted & validated student in database:', createdStudent);
  return createdStudent;
}

/**
 * Update an existing student record in the database via Spring Boot PUT /api/students/{id}.
 * @param {number|string} id - Student ID
 * @param {Object} studentRegistrationDto - Updated student DTO payload
 * @returns {Promise<Object>} The updated Student entity returned from DB
 */
export async function updateStudentInDb(id, studentRegistrationDto) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(studentRegistrationDto),
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

  const updatedRaw = await response.json();
  const updatedStudent = validateStudent(updatedRaw, `PUT /api/students/${id}`);
  console.log(`✅ Successfully updated & validated student #${id} in database:`, updatedStudent);
  return updatedStudent;
}

/**
 * Delete a student record from the database via Spring Boot DELETE /api/students/{id}.
 * @param {number|string} id - Student ID
 * @returns {Promise<boolean>}
 */
export async function deleteStudentFromDb(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to delete student #${id}: HTTP ${response.status}`);
  }

  console.log(`🗑️ Successfully deleted student #${id} from database.`);
  return true;
}

