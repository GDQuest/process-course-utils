const monthsEnglish = [
  ["January", "Jan"],
  ["February", "Feb"],
  ["March", "Mar"],
  ["April", "Apr"],
  ["May", "May"],
  ["June", "Jun"],
  ["July", "Jul"],
  ["August", "Aug"],
  ["September", "Sep"],
  ["October", "Oct"],
  ["November", "Nov"],
  ["December", "Dec"],
];

const daysEnglish = [
  ["Sunday", "Sun"],
  ["Monday", "Mon"],
  ["Tuesday", "Tue"],
  ["Wednesday", "Wed"],
  ["Thursday", "Thu"],
  ["Friday", "Fri"],
  ["Saturday", "Sat"],
];

/**
 * Ensures an object representing a d
 * @param date
 * @returns
 */
export const getParsedDate = (date: string | Date | undefined) => {
  date =
    typeof date === "string"
      ? new Date(date)
      : typeof date === "undefined"
      ? new Date()
      : date;
  const monthIndex = date.getMonth();
  const month = monthsEnglish[monthIndex][0];
  const monthShort = monthsEnglish[monthIndex][1];
  const monthNumber = date.getMonth() + 1;
  const dayIndex = date.getDay();
  const dayName = daysEnglish[dayIndex][0];
  const dayShort = daysEnglish[dayIndex][1];
  const dayOfMonth = date.getDate();
  const dayOrdinal = getDayOrdinal(dayOfMonth);
  const year = date.getFullYear();
  const dateDMY = [dayOfMonth, monthNumber, year];
  const dateMDY = [monthNumber, dayOfMonth, year];
  const dateDDMMYYYY = dateDMY.map((n) => n.toString().padStart(2, "0"));
  const dateMMDDYYYY = dateMDY.map((n) => n.toString().padStart(2, "0"));
  return {
    year,
    month,
    monthShort,
    monthNumber,
    dayOfMonth,
    dayName,
    dayShort,
    dayOrdinal,
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    date,
    dateDMY,
    dateMDY,
    dateDDMMYYYY,
    dateMMDDYYYY,
  };
};

export type Ordinal = ReturnType<typeof getDayOrdinal>;
export type ParsedDate = ReturnType<typeof getParsedDate>;

/**
 * Only supports English and days from 1 to 31
 */
export const getDayOrdinal = (dayNumber: number) => {
  if (dayNumber > 3 && dayNumber < 21) return "th";
  switch (dayNumber % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
  }
  return "th";
};
