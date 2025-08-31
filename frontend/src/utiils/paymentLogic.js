export const calculateMonthlyDues = (fee, studentAdmitDate, payments) => {
  // Convert admission date to Date object
  const admitDate = new Date(studentAdmitDate);
  const currentDate = new Date();

  const calculateMonthDifference = (currentDate.getFullYear() - admitDate.getFullYear()) * 12 + currentDate.getMonth() - admitDate.getMonth() + 1;

  const PaidMonths = payments.length;
  const DueMonths = calculateMonthDifference - payments.length;
  const TotalPaid = payments.reduce((total, payment) => total + Number(payment.amount), 0);
  const TotalDue = DueMonths * fee;

  return {
    PaidMonths,
    DueMonths,
    TotalPaid,
    TotalDue
  };
}


const CalculateMonthlyDues = (fee, studentAdmitDate, payments = []) => {
  const now = new Date();

  const admit = new Date(studentAdmitDate);
  if (isNaN(admit)) throw new Error('Invalid studentAdmitDate');

  // Use UTC to avoid timezone edge cases
  const monthIndex = (y, m) => y * 12 + m;
  const admitIdx = monthIndex(admit.getUTCFullYear(), admit.getUTCMonth());
  const nowIdx = monthIndex(now.getUTCFullYear(), now.getUTCMonth());

  const totalMonths = nowIdx >= admitIdx ? (nowIdx - admitIdx + 1) : 0;

  // Aggregate payments by (year,month)
  const monthlySum = new Map(); // key: monthIndex, value: total amount paid for that month
  for (const p of payments) {
    if (typeof p?.year !== 'number' || typeof p?.month !== 'number') continue;
    const idx = monthIndex(p.year, p.month);
    monthlySum.set(idx, (monthlySum.get(idx) || 0) + (Number(p.amount) || 0));
  }

  // Sum payments only within the due window [admitIdx, nowIdx]
  let fullyPaidMonths = 0;
  let totalPaid = 0;
  if (totalMonths > 0) {
    for (let idx = admitIdx; idx <= nowIdx; idx++) {
      const amt = monthlySum.get(idx) || 0;
      totalPaid += amt;
      if (amt >= fee) fullyPaidMonths += 1;
    }
  }

  const dueMonths = Math.max(0, totalMonths - fullyPaidMonths);
  const totalDue = Math.max(0, totalMonths * fee - totalPaid);

  return {
    totalMonths,
    DueMonths: dueMonths,
    TotalPaid: totalPaid,
    TotalDue: totalDue,
  };
}