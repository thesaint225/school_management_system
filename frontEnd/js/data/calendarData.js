const academicTerms = [
  {
    id: 'term-1-2026',
    name: 'Term 1 (Harmattan Term)',
    academicYear: '2026/2027',
    startDate: '2026-09-01',
    endDate: '2026-12-18',
    status: 'Active',
    totalWeeks: 15,
  },
  {
    id: 'term-2-2027',
    name: 'Term 2',
    academicYear: '2026/2027',
    startDate: '2027-01-12',
    endDate: '2027-04-16',
    status: 'Upcoming',
    totalWeeks: 14,
  },
  {
    id: 'term-3-2027',
    name: 'Term 3',
    academicYear: '2026/2027',
    startDate: '2027-05-04',
    endDate: '2027-07-23',
    status: 'Upcoming',
    totalWeeks: 12,
  },
];

const calendarItems = [
  // 1. ACADEMIC TERMS
  {
    id: 'cal-001',
    category: 'term',
    title: 'Term 1 Resumption Day',
    date: '2026-09-01',
    time: '08:00 GMT',
    location: 'Campus Wide',
    description: 'First day of academic year 2026/2027 for all enrolled students.',
    targetAudience: 'All Students & Staff',
    badge: 'Term Milestone',
  },
  {
    id: 'cal-002',
    category: 'term',
    title: 'Term 1 Vacation & Speech Day',
    date: '2026-12-18',
    time: '11:00 GMT',
    location: 'Assembly Hall',
    description: 'Official closing ceremony and report card distribution for Term 1.',
    targetAudience: 'All Students & Parents',
    badge: 'Term Milestone',
  },

  // 2. SCHOOL EVENTS
  {
    id: 'cal-003',
    category: 'event',
    title: 'Freshers Orientation & Campus Tour',
    date: '2026-09-08',
    time: '09:00 - 12:00 GMT',
    location: 'Auditorium',
    description: 'Welcome program and library tour for newly admitted Form 1 students.',
    targetAudience: 'Form 1 Students',
    badge: 'Orientation',
  },
  {
    id: 'cal-004',
    category: 'event',
    title: 'PTA General Assembly Meeting',
    date: '2026-10-21',
    time: '14:00 - 16:30 GMT',
    location: 'School Auditorium',
    description: 'Parent-Teacher meeting on academic progress, development projects, and welfare.',
    targetAudience: 'Parents & Teachers',
    badge: 'PTA Meeting',
  },
  {
    id: 'cal-005',
    category: 'event',
    title: 'Inter-Houses Athletics Championship',
    date: '2026-11-12',
    time: '08:30 - 16:00 GMT',
    location: 'Sports Complex',
    description: 'Annual track & field competitions between Aggrey, Gbewaa, and Tweneboa houses.',
    targetAudience: 'All Students & Staff',
    badge: 'Sports',
  },
  {
    id: 'cal-006',
    category: 'event',
    title: 'Science & ICT Innovation Exhibition',
    date: '2026-11-27',
    time: '10:00 - 15:00 GMT',
    location: 'Science Complex',
    description: 'Student science projects, robotics display, and software demonstrations.',
    targetAudience: 'All Classes',
    badge: 'Exhibition',
  },

  // 3. EXAMS
  {
    id: 'cal-007',
    category: 'exam',
    title: 'Mid-Term Assessment: Core Subjects',
    date: '2026-10-14',
    time: '08:30 - 13:00 GMT',
    location: 'Classrooms / Exam Hall',
    description: 'Mathematics, English Language, and Integrated Science midterm assessment.',
    targetAudience: 'Form 1, 2, 3',
    badge: 'Mid-Term Exam',
  },
  {
    id: 'cal-008',
    category: 'exam',
    title: 'Mid-Term Assessment: Elective Subjects',
    date: '2026-10-15',
    time: '09:00 - 14:00 GMT',
    location: 'Designated Exam Rooms',
    description: 'Physics, Chemistry, Accounting, Geography, Literature, and Technical Drawing.',
    targetAudience: 'Form 2 & 3',
    badge: 'Mid-Term Exam',
  },
  {
    id: 'cal-009',
    category: 'exam',
    title: 'End of Term 1 Final Examinations Begin',
    date: '2026-12-01',
    time: '08:30 GMT',
    location: 'Main Examination Halls',
    description: 'Start of comprehensive end-of-term examinations across all subjects.',
    targetAudience: 'All Classes',
    badge: 'Final Exam',
  },
  {
    id: 'cal-010',
    category: 'exam',
    title: 'Form 3 Mock WAEC Practical Exams',
    date: '2026-12-08',
    time: '08:00 - 15:30 GMT',
    location: 'Science & Computer Labs',
    description: 'Practical lab assessments for final-year candidates.',
    targetAudience: 'Form 3 Students',
    badge: 'Mock Exam',
  },

  // 4. HOLIDAYS & BREAKS
  {
    id: 'cal-011',
    category: 'holiday',
    title: 'Kwame Nkrumah Memorial Day',
    date: '2026-09-21',
    time: 'All Day',
    location: 'National Statutory Holiday',
    description: 'Ghana national public holiday celebrating the birthday of Dr. Kwame Nkrumah. School closed.',
    targetAudience: 'General Public',
    badge: 'Public Holiday',
  },
  {
    id: 'cal-012',
    category: 'holiday',
    title: 'Term 1 Mid-Term Break',
    date: '2026-10-24',
    time: 'All Day',
    location: 'Campus Wide',
    description: 'Mid-term break for students and staff. Normal classes resume on Monday, Oct 26.',
    targetAudience: 'Students & Staff',
    badge: 'School Break',
  },
  {
    id: 'cal-013',
    category: 'holiday',
    title: "National Farmers' Day",
    date: '2026-12-04',
    time: 'All Day',
    location: 'National Statutory Holiday',
    description: 'Ghana national public holiday honoring farmers and fishers. No academic work.',
    targetAudience: 'General Public',
    badge: 'Public Holiday',
  },
  {
    id: 'cal-014',
    category: 'holiday',
    title: 'Christmas Day',
    date: '2026-12-25',
    time: 'All Day',
    location: 'National Statutory Holiday',
    description: 'Christmas Day celebrations.',
    targetAudience: 'General Public',
    badge: 'Public Holiday',
  },

  // 5. DEADLINES
  {
    id: 'cal-015',
    category: 'deadline',
    title: 'Term 1 Course & Club Registration Deadline',
    date: '2026-09-18',
    time: '17:00 GMT',
    location: 'Academic Affairs Office',
    description: 'Final cutoff to register or change elective subjects and school club memberships.',
    targetAudience: 'All Students',
    badge: 'Registration Due',
  },
  {
    id: 'cal-016',
    category: 'deadline',
    title: 'Tuition Fees 2nd Installment Cutoff',
    date: '2026-10-14',
    time: '17:00 GMT',
    location: 'Accounts & Finance Portal',
    description: 'Due date for 50% tuition installment to avoid clearance hold during exams.',
    targetAudience: 'Guardians & Accounts',
    badge: 'Payment Due',
  },
  {
    id: 'cal-017',
    category: 'deadline',
    title: 'Form 3 Project & SBA Portfolio Submission',
    date: '2026-11-20',
    time: '16:00 GMT',
    location: 'Departmental Heads',
    description: 'Submission of continuous assessment project work and practical art portfolios.',
    targetAudience: 'Form 3 Candidates',
    badge: 'Project Due',
  },
  {
    id: 'cal-018',
    category: 'deadline',
    title: 'Continuous Assessment (SBA) Score Entry Cutoff',
    date: '2026-11-25',
    time: '23:59 GMT',
    location: 'Teacher Portal',
    description: 'Final deadline for subject teachers to enter class scores into EduManage.',
    targetAudience: 'Teachers & Staff',
    badge: 'Grades Due',
  },
];

/**
 * Returns a defensive deep clone of all calendar event items so callers
 * cannot mutate internal calendar data.
 * @returns {Array<Object>}
 */
export function getCalendarItems() {
  return structuredClone(calendarItems);
}

/**
 * Returns a defensive deep clone of all academic terms so callers
 * cannot mutate internal term data.
 * @returns {Array<Object>}
 */
export function getAcademicTerms() {
  return structuredClone(academicTerms);
}

/**
 * Updates in-memory calendarItems array with validated, deep-cloned records.
 * @param {Array<Object>} newItems
 */
export function updateCalendarItems(newItems) {
  if (!Array.isArray(newItems)) {
    throw new TypeError(`Expected an array for updateCalendarItems, received ${typeof newItems}.`);
  }
  if (newItems.length === 0) {
    throw new RangeError('updateCalendarItems requires a non-empty array of calendar items.');
  }
  newItems.forEach((item, idx) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new TypeError(`Calendar item at index ${idx} must be a non-null object.`);
    }
    if (typeof item.title !== 'string' || item.title.trim().length === 0) {
      throw new TypeError(`Calendar item at index ${idx} must have a non-empty string "title".`);
    }
    if (typeof item.date !== 'string' || Number.isNaN(Date.parse(item.date))) {
      throw new RangeError(`Calendar item at index ${idx} must have a valid date string.`);
    }
  });

  const cloned = structuredClone(newItems);
  calendarItems.length = 0;
  calendarItems.push(...cloned);
}

/**
 * Updates in-memory academicTerms array with validated, deep-cloned records.
 * @param {Array<Object>} newTerms
 */
export function updateAcademicTerms(newTerms) {
  if (!Array.isArray(newTerms)) {
    throw new TypeError(`Expected an array for updateAcademicTerms, received ${typeof newTerms}.`);
  }
  if (newTerms.length === 0) {
    throw new RangeError('updateAcademicTerms requires a non-empty array of academic terms.');
  }
  newTerms.forEach((term, idx) => {
    if (!term || typeof term !== 'object' || Array.isArray(term)) {
      throw new TypeError(`Academic term at index ${idx} must be a non-null object.`);
    }
    if (typeof term.name !== 'string' || term.name.trim().length === 0) {
      throw new TypeError(`Academic term at index ${idx} must have a non-empty string "name".`);
    }
    if (typeof term.startDate !== 'string' || Number.isNaN(Date.parse(term.startDate))) {
      throw new RangeError(`Academic term at index ${idx} must have a valid "startDate".`);
    }
    if (typeof term.endDate !== 'string' || Number.isNaN(Date.parse(term.endDate))) {
      throw new RangeError(`Academic term at index ${idx} must have a valid "endDate".`);
    }
  });

  const cloned = structuredClone(newTerms);
  academicTerms.length = 0;
  academicTerms.push(...cloned);
}

