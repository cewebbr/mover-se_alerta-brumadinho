// Function to format the message related to the denunciation post
export const timeSince = (date) => {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = seconds / 31536000;

  if (interval > 1) {
    return "há " + Math.floor(interval) + " anos";
  }

  interval = seconds / 2592000;
  if (interval > 1) {
    return "há " + Math.floor(interval) + " meses";
  }

  interval = seconds / 86400;
  if (interval > 1) {
    return "há " + Math.floor(interval) + " dias";
  }

  interval = seconds / 3600;
  if (interval > 1) {
    return "há " + Math.floor(interval) + " horas";
  }

  interval = seconds / 60;
  if (interval > 1) {
    return "há " + Math.floor(interval) + " minutos";
  }

  return "há " + Math.floor(seconds + 1) + " segundos";
};
