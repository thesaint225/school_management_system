// ClassRoom Domain Namespace
import {
  getClasses,
  setClasses,
  addClassToStore,
  removeClassById,
  setClassCache,
  getActiveClasses,
  invalidateClassCache,
  populateClassSelectOptions,
  populateClassCheckboxes,
} from './classUtils.js';
import {
  fetchClassesFromDb,
  fetchClassByIdFromDb,
  fetchClassStudentsFromDb,
  createClassInDb,
  updateClassInDb,
  deleteOrDeactivateClassInDb,
  assignStudentToClassInDb,
  removeStudentFromClassInDb,
} from '../../api/classApi.js';
import { initClassModal, openClassModal } from './classModal.js';
import { initClassRoster } from './classRoster.js';
import { initClassForm } from './classForm.js';

export const ClassRoom = Object.freeze({
  // Encapsulated Store & Cache Operations
  getAll: getClasses,
  setAll: setClasses,
  add: addClassToStore,
  removeById: removeClassById,
  setCache: setClassCache,
  getActive: getActiveClasses,
  invalidateCache: invalidateClassCache,

  // Backend API Operations
  fetchAllFromDb: fetchClassesFromDb,
  fetchByIdFromDb: fetchClassByIdFromDb,
  fetchStudentsFromDb: fetchClassStudentsFromDb,
  createInDb: createClassInDb,
  updateInDb: updateClassInDb,
  deleteOrDeactivateInDb: deleteOrDeactivateClassInDb,
  assignStudentInDb: assignStudentToClassInDb,
  removeStudentInDb: removeStudentFromClassInDb,

  // UI Controllers & Form Helpers
  initModal: initClassModal,
  openModal: openClassModal,
  initRoster: initClassRoster,
  initForm: initClassForm,
  populateSelectOptions: populateClassSelectOptions,
  populateCheckboxes: populateClassCheckboxes,
});

