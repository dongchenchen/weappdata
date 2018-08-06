const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formateDate = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day].map(formatNumber).join('-'); 
}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getTimeStamp = day => {
  let dayTimeStamp = new Date(day) / 1000;
  return dayTimeStamp;
}

const twoWeekBeforeTimeStamp = timeStamp => { 
  let dayBeforeStamp = timeStamp - 60*60*24*14 + 1;
  return dayBeforeStamp;
}

const dayBeforeTimeStamp = (timeStamp, day) => {
  let dayBeforeStamp = timeStamp - 60*60*24*day;
  return dayBeforeStamp;
}

const yesterdayTimeStamp = () => {
  let timeStamp = new Date(new Date().setHours(0,0,0,0)) / 1000 ;
  return timeStamp -1 ;
}

const formatDouble = val => {
  var result = parseFloat(val);
   result = Math.round(val * 100) / 100;
   return result;
}

const formatToZh = val => {
  let result = '';
  if (val >= 1000 && val <=9999) {
    val = val/1000;
    val = formatDouble(val);
    result = val + '千';
  } else if (val >=10000 && val <= 9999999) {
    val = val/10000;
    val = formatDouble(val);
    result = val + '万';
  } else if (val >= 100000000) {
    val = val/100000000;
    val = formatDouble(val);
    result = val + '亿';
  } else {
    result = val;
  }
  return result;
}

const getXCoordinates = timeStamp => {
  let XCoordinates = [];
  let beforeTime = 0;
  let d;
  for(let i = 13; i >= 0; i--) {
    beforeTime = dayBeforeTimeStamp(timeStamp, i);
    d = new Date(beforeTime*1000);
    XCoordinates.push(d.getDate() + '日');
  }
  return XCoordinates;
}

module.exports = {
  formatTime: formatTime,
  getTimeStamp: getTimeStamp,
  twoWeekBeforeTimeStamp: twoWeekBeforeTimeStamp,
  formateDate: formateDate,
  yesterdayTimeStamp: yesterdayTimeStamp,
  formatDouble: formatDouble,
  getXCoordinates: getXCoordinates,
  formatToZh: formatToZh
}
