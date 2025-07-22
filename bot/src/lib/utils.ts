export const moneyFormatToIDR = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })
    .format(price)
    .replaceAll('Rp', '')
    .trimStart();
};

export const getCurrentTimeAndDate = (date: Date) => {
  const currentTime = date
    .toLocaleTimeString('id-ID', {
      timeZoneName: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace('.', ':');

  const currentDate = date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return {
    currentTime,
    currentDate,
  };
};
