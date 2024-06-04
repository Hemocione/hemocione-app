const monthNames = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const weekdaysAbbreviation = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function getMinorDate(date: Date): string {
  const weekday = weekdaysAbbreviation[date.getDay()];
  return `${weekday}, ${date.getDate()} de ${monthNames[date.getMonth()]}`;
}
