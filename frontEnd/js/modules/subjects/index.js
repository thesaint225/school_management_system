// Subject Domain Namespace
import {
  getSubjects,
  setSubjects,
  addSubjectToStore,
  removeSubjectById,
  setSubjectCache,
  getActiveSubjects,
  invalidateSubjectCache,
  populateSubjectCheckboxes,
} from './subjectUtils.js';
import {
  fetchSubjectsFromDb,
  fetchSubjectByIdFromDb,
  createSubjectInDb,
  updateSubjectInDb,
  deleteOrDeactivateSubjectInDb,
} from '../../api/subjectApi.js';
import { initSubjectModal, openSubjectModal } from './subjectModal.js';
import { initSubjectRoster } from './subjectRoster.js';
import { initSubjectForm } from './subjectForm.js';

export const Subject = Object.freeze({
  // Encapsulated Store & Cache Operations
  getAll: getSubjects,
  setAll: setSubjects,
  add: addSubjectToStore,
  removeById: removeSubjectById,
  setCache: setSubjectCache,
  getActive: getActiveSubjects,
  invalidateCache: invalidateSubjectCache,

  // Backend API Operations
  fetchAllFromDb: fetchSubjectsFromDb,
  fetchByIdFromDb: fetchSubjectByIdFromDb,
  createInDb: createSubjectInDb,
  updateInDb: updateSubjectInDb,
  deleteOrDeactivateInDb: deleteOrDeactivateSubjectInDb,

  // UI Controllers & Form Helpers
  initModal: initSubjectModal,
  openModal: openSubjectModal,
  initRoster: initSubjectRoster,
  initForm: initSubjectForm,
  populateCheckboxes: populateSubjectCheckboxes,
});

