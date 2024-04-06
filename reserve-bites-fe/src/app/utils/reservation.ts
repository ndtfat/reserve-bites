export const validReservation = (
  size: number,
  date: Date,
  time: Date,
  openTime: Date | string,
  closeTime: Date | string,
  maxSize: number,
  openDay: string[],
) => {
  const today = new Date().getTime();
  const reserveTime = new Date(date).getTime();

  const reserveHour = new Date(time).getHours();
  const reserveMinute = new Date(time).getMinutes();

  const openHour = new Date(openTime).getHours();
  const closeHour = new Date(closeTime).getHours();
  const openMinute = new Date(openTime).getMinutes();
  const closeMinute = new Date(closeTime).getMinutes();

  // console.table({ openHour, openMinute });

  const isHourInRange =
    reserveHour > openHour || (reserveHour === openHour && reserveMinute >= openMinute);
  const isMinuteInRange =
    reserveHour < closeHour || (reserveHour === closeHour && reserveMinute <= closeMinute);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
  const reserveDay = daysOfWeek[new Date(date).getDay()];

  // console.log(
  //   reserveDay,
  //   this.restaurant.operationTime.openDay.includes(reserveDay),
  // );

  if (size > maxSize) {
    return `Max party size is ${maxSize}`;
  }
  if (today - reserveTime > 0) {
    return `Selected date must the day after today`;
  }
  if (!openDay.includes(reserveDay)) {
    return `Restaurant not open on selected day`;
  }
  if (!(isHourInRange && isMinuteInRange)) {
    return `Restaurant not open on selected time`;
  }
  return '';
};
