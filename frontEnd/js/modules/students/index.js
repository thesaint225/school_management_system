// Student Domain Namespace
import {
  getStudents,
  getStudentById,
  setStudents,
  addStudent,
  updateStudentInStore,
  updateStudentDailyAttendance,
  removeStudentById,
} from '../../data/studentsData.js';
import {
  fetchStudentsFromDb,
  registerStudentInDb,
  updateStudentInDb,
  deleteStudentFromDb,
} from '../../api/studentApi.js';
import { initStudentModal, openStudentModal } from './studentModal.js';
import { initStudentRoster } from './studentRoster.js';
import { initStudentForm } from './studentForm.js';
import { initTopAchievers } from './topAchievers.js';

export const Student = Object.freeze({
  // Encapsulated Store Accessors & Mutators
  getAll: getStudents,
  getById: getStudentById,
  setAll: setStudents,
  add: addStudent,
  updateInStore: updateStudentInStore,
  updateAttendance: updateStudentDailyAttendance,
  removeById: removeStudentById,

  // Backend API Operations
  fetchAllFromDb: fetchStudentsFromDb,
  registerInDb: registerStudentInDb,
  updateInDb: updateStudentInDb,
  deleteFromDb: deleteStudentFromDb,

  // UI Controllers
  initModal: initStudentModal,
  openModal: openStudentModal,
  initRoster: initStudentRoster,
  initForm: initStudentForm,
  initTopAchievers,
});

