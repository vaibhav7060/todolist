

module.exports = getDate;

function getDate() {
  let day = "";
  let today = new Date();
  let currentDay = today.getDay();

  let options = {
    weekday:"long",
    day:"numeric",
    month:"long"
  };

  day = today.toLocaleDateString("en-us",options);
  return day
}
