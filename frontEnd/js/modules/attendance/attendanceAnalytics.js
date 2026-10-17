// Attendance Analytics Calculations

export function calculateAttendanceRate(studentList) {
  const counts = studentList.reduce(
    (acc, student) => {
      let status = 'Unmarked';
      if (student.dailyAttendance) {
        status = student.dailyAttendance.status;
      }
      if (status === 'Present') {
        acc.present += 1;
      } else if (status === 'Late') {
        acc.late += 1;
      } else if (status === 'Absent') {
        acc.absent += 1;
      } else {
        acc.unmarked += 1;
      }
      return acc;
    },
    { present: 0, late: 0, absent: 0, unmarked: 0 },
  );

  const total = studentList.length;
  const weightedScore = counts.present + counts.late * 0.5;
  const rate = total > 0 ? ((weightedScore / total) * 100).toFixed(1) : '0.0';
  const presentPct =
    total > 0 ? ((counts.present / total) * 100).toFixed(1) : '0.0';
  const latePct = total > 0 ? ((counts.late / total) * 100).toFixed(1) : '0.0';
  const absentPct =
    total > 0 ? ((counts.absent / total) * 100).toFixed(1) : '0.0';

  return {
    present: counts.present,
    late: counts.late,
    absent: counts.absent,
    unmarked: counts.unmarked,
    total,
    rate,
    presentPct,
    latePct,
    absentPct,
  };
}
