// Results & Academic Report Cards Domain Namespace
import {
  saveScoreToDb,
  fetchStudentReportFromDb,
  fetchAllReportsFromDb,
  downloadReportPdfFromDb,
} from '../../api/resultApi.js';
import { initResultsModule } from './resultsMain.js';

export const Results = Object.freeze({
  init: initResultsModule,
  saveScoreInDb: saveScoreToDb,
  fetchStudentReportFromDb,
  fetchAllReportsFromDb,
  downloadReportPdfFromDb,
});

