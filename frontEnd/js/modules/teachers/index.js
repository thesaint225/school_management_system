// Teacher Domain Namespace
import {
  getTeachers,
  getTeacherById,
  setTeachers,
  addTeacher,
  updateTeacherInStore,
  removeTeacherById,
} from '../../data/teachersData.js';
import {
  fetchTeachersFromDb,
  registerTeacherInDb,
  updateTeacherInDb,
  deleteTeacherFromDb,
} from '../../api/teacherApi.js';
import { initTeacherModal, openTeacherModal } from './teacherModal.js';
import { initTeacherRoster } from './teacherRoster.js';
import { initTeacherForm } from './teacherForm.js';

export const Teacher = Object.freeze({
  // Encapsulated Store Accessors & Mutators
  getAll: getTeachers,
  getById: getTeacherById,
  setAll: setTeachers,
  add: addTeacher,
  updateInStore: updateTeacherInStore,
  removeById: removeTeacherById,

  // Backend API Operations
  fetchAllFromDb: fetchTeachersFromDb,
  registerInDb: registerTeacherInDb,
  updateInDb: updateTeacherInDb,
  deleteFromDb: deleteTeacherFromDb,

  // UI Controllers
  initModal: initTeacherModal,
  openModal: openTeacherModal,
  initRoster: initTeacherRoster,
  initForm: initTeacherForm,
});

