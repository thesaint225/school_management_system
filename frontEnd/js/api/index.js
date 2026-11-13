// Unified API Namespace Barrel
import { StudentApi } from './studentApi.js';
import { TeacherApi } from './teacherApi.js';
import { ClassApi } from './classApi.js';
import { SubjectApi } from './subjectApi.js';
import { ResultApi } from './resultApi.js';
import { CalendarApi } from './calendarApi.js';

export {
  StudentApi,
  TeacherApi,
  ClassApi,
  SubjectApi,
  ResultApi,
  CalendarApi,
};

export const Api = Object.freeze({
  students: StudentApi,
  teachers: TeacherApi,
  classes: ClassApi,
  subjects: SubjectApi,
  results: ResultApi,
  calendar: CalendarApi,
});

