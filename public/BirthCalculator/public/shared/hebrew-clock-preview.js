(function(root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(root);
  } else {
    root.BirthCalculatorHebrewPreview = factory(root);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function(root) {
  "use strict";

  var MON_COUNT = [13, 1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
  var HOUR_MIDA_HE = ["שבתאי", "צדק", "מאדים", "חמה", "נוגה", "כוכב", "לבנה"];
  var DAY_MIDA_HE = ["צדק", "מאדים", "חמה", "שבתאי", "נוגה", "כוכב", "לבנה"];
  var HOUR_MIDA_EN = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"];
  var DAY_MIDA_EN = ["Jupiter", "Mars", "Sun", "Saturn", "Venus", "Mercury", "Moon"];

  var WOMAN_SIMPLE_COLORS_BY_INDEX = [
    "#84C45E",
    "#2D8DA1",
    "#A6230E",
    "#815AA8",
    "#BA8D1A",
    "#B45D02",
    "#808080"
  ];
  var COMMERCIAL_MAZAL_BY_INDEX = [4, 1, 2, 3, 5, 6, 7];

  function normalizeHebrewDay(dayNumber) {
    while (dayNumber < 1) {
      dayNumber += 7;
    }

    while (dayNumber > 7) {
      dayNumber -= 7;
    }

    return dayNumber;
  }

  function getDateParts(input) {
    return {
      year: Number(input.year),
      month: Number(input.month),
      day: Number(input.day),
      hour: Number(input.hour),
      minute: Number(input.minute || 0),
      second: Number(input.second || 0),
      millisecond: Number(input.millisecond || 0)
    };
  }

  function validateDateParts(parts) {
    if (![parts.year, parts.month, parts.day, parts.hour, parts.minute, parts.second, parts.millisecond].every(Number.isFinite)) {
      throw new TypeError("Invalid Jerusalem date or time.");
    }
  }

  function makeLocalDate(parts, dayOffset) {
    return new Date(parts.year, parts.month - 1, parts.day + (dayOffset || 0));
  }

  function getDayOfWeekNumber(parts) {
    return makeLocalDate(parts, 0).getDay() + 1;
  }

  function getLocation(latitude, longitude) {
    latitude = Number(latitude);
    longitude = Number(longitude);
    if (![latitude, longitude].every(Number.isFinite)) {
      throw new TypeError("Invalid clock location.");
    }

    var ns = latitude > 0 ? "N" : "S";
    var latd = Math.floor(latitude);
    var latm = (latitude - latd) * 60;
    var lngd = Math.floor(longitude);
    var lngm = (longitude - lngd) * 60;

    return {
      latd: latd,
      latm: latm,
      lngd: lngd,
      lngm: lngm,
      nsi: ns !== "N" ? 1 : 0,
      ewi: ns !== "W" ? 1 : 0
    };
  }

  function leap(year) {
    return (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0);
  }

  function doy(day, month, year) {
    var num = (month > 2 && leap(year)) ? 1 : 0;
    return MON_COUNT[month] + day + num;
  }

  function suntime(day, month, yearMinus1900, sundeg, sunmin, londeg, lonmin, ew, latdeg, latmin, ns, timezone) {
    var year = yearMinus1900 - 100 + 2000;
    var ret = [0, 0, 0, 0];
    var invalid = 0;
    var longitude = (londeg + lonmin / 60.0) * ((ew === 0) ? -1 : 1);
    var latitude = (latdeg + latmin / 60.0) * ((ns === 0) ? 1 : -1);
    var yday = doy(day, month, year);
    var A = 1.5708;
    var B = 3.14159;
    var C = 4.71239;
    var D = 6.28319;
    var E = 0.0174533 * latitude;
    var F = 0.0174533 * longitude;
    var G = 0.261799 * timezone;
    var R = Math.cos(0.01745 * (sundeg + sunmin / 60.0));
    var sr = 0;
    var ss = 0;

    for (var i = 0; i < 2; i += 1) {
      var J = i === 0 ? A : C;
      var K = yday + ((J - F) / D);
      var L = (K * 0.017202) - 0.0574039;
      var M = L + 0.0334405 * Math.sin(L);
      M += 4.93289 + (3.49066E-04) * Math.sin(2 * L);

      if (D === 0) {
        return ret;
      }

      while (M < 0) {
        M += D;
      }

      while (M >= D) {
        M -= D;
      }

      if ((M / A) - Math.floor(M / A) === 0) {
        M += 4.84814E-06;
      }

      var P = Math.atan2(0.91746 * (Math.sin(M) / Math.cos(M)), 1);
      if (M > C) {
        P += D;
      } else if (M > A) {
        P += B;
      }

      var Q = 0.39782 * Math.sin(M);
      Q = Q / Math.sqrt(-Q * Q + 1);
      Q = Math.atan2(Q, 1);

      var S = R - (Math.sin(Q) * Math.sin(E));
      S = S / (Math.cos(Q) * Math.cos(E));
      if (Math.abs(S) > 1) {
        invalid = 1;
      }

      S = S / Math.sqrt(-S * S + 1);
      S = A - Math.atan2(S, 1);
      if (i === 0) {
        S = D - S;
      }

      var T = S + P - 0.0172028 * K - 1.73364;
      var U = T - F;
      var V = U + G;

      while (V < 0) {
        V += D;
      }

      while (V >= D) {
        V -= D;
      }

      V = V * 3.81972;
      if (i === 0) {
        sr = V;
      } else {
        ss = V;
      }
    }

    ret[1] = invalid;
    ret[2] = sr;
    ret[3] = ss;
    return ret;
  }

  function getSolarTimes(parts, latitude, longitude, gmt) {
    var location = getLocation(latitude, longitude);
    var yesterday = makeLocalDate(parts, -1);
    var today = makeLocalDate(parts, 0);
    var tomorrow = makeLocalDate(parts, 1);
    var timezone = Number(gmt);
    if (!Number.isFinite(timezone)) {
      throw new TypeError("Invalid Jerusalem GMT offset.");
    }

    var yesterdayTime = suntime(yesterday.getDate(), yesterday.getMonth() + 1, yesterday.getYear(), 90, 50, location.lngd, location.lngm, location.ewi, location.latd, location.latm, location.nsi, timezone);
    var todayTime = suntime(today.getDate(), today.getMonth() + 1, today.getYear(), 90, 50, location.lngd, location.lngm, location.ewi, location.latd, location.latm, location.nsi, timezone);
    var tomorrowTime = suntime(tomorrow.getDate(), tomorrow.getMonth() + 1, tomorrow.getYear(), 90, 50, location.lngd, location.lngm, location.ewi, location.latd, location.latm, location.nsi, timezone);

    return {
      sunriseYesterday: yesterdayTime[2],
      sunrise: todayTime[2],
      sunriseTomorrow: tomorrowTime[2],
      sunsetYesterday: yesterdayTime[3],
      sunset: todayTime[3],
      sunsetTomorrow: tomorrowTime[3]
    };
  }

  function getCurrentHour(parts) {
    return ((parts.millisecond || 0) + ((parts.second || 0) * 1000) + (parts.minute * 60 * 1000) + (parts.hour * 60 * 60 * 1000)) / (1000 * 3600);
  }

  function getClockSegmentHour(length, offset) {
    return Math.floor(12 * (offset / length));
  }

  function getSunClockHour(parts, latitude, longitude, gmt) {
    var times = getSolarTimes(parts, latitude, longitude, gmt);
    var currHour = getCurrentHour(parts);
    var clockHour = null;

    if (times.sunset > times.sunrise && currHour < times.sunset) {
      clockHour = getClockSegmentHour(times.sunset - times.sunrise, currHour - times.sunrise) + 12;
    }

    if (times.sunset > times.sunrise && currHour < times.sunrise) {
      clockHour = getClockSegmentHour(times.sunrise + 24 - times.sunsetYesterday, currHour + 24 - times.sunsetYesterday);
    }

    if (times.sunset > times.sunrise && currHour > times.sunset) {
      clockHour = getClockSegmentHour(times.sunriseTomorrow + 24 - times.sunset, currHour - times.sunset);
    }

    if (times.sunset < times.sunrise && currHour < times.sunrise) {
      clockHour = getClockSegmentHour(times.sunrise - times.sunset, currHour - times.sunset);
    }

    if (times.sunset < times.sunrise && currHour < times.sunset) {
      clockHour = getClockSegmentHour(times.sunset + 24 - times.sunriseYesterday, currHour + 24 - times.sunriseYesterday) + 12;
    }

    if (times.sunset < times.sunrise && currHour > times.sunrise) {
      clockHour = getClockSegmentHour(times.sunsetTomorrow + 24 - times.sunrise, currHour - times.sunrise) + 12;
    }

    if (!Number.isFinite(clockHour)) {
      clockHour = 0;
    }

    return {
      clockHour: clockHour,
      sunset: times.sunset
    };
  }

  function getTimeParts(time) {
    var hour = Math.floor(time);
    var minute = Math.floor((time - hour) * 60.0);
    var second = Math.floor((((time - hour) * 60.0) - minute) * 60.0);

    if (second >= 60) {
      minute += 1;
      second -= 60;
    }

    if (minute >= 60) {
      hour += 1;
      minute -= 60;
    }

    if (hour < 0) {
      hour += 24;
    }

    if (hour > 23) {
      hour -= 24;
    }

    return {
      hour: hour,
      minute: minute,
      second: second
    };
  }

  function isAfterSunset(parts, sunset) {
    var sunsetParts = getTimeParts(sunset);
    return (parts.hour === sunsetParts.hour && parts.minute === sunsetParts.minute && parts.second >= sunsetParts.second) ||
      (parts.hour === sunsetParts.hour && parts.minute > sunsetParts.minute) ||
      (parts.hour > sunsetParts.hour);
  }

  function getSunHebrewDay(parts, solarClock) {
    var day = getDayOfWeekNumber(parts);
    if (isAfterSunset(parts, solarClock.sunset)) {
      day += 1;
    }

    return normalizeHebrewDay(day);
  }

  function getSunCalc(sunCalc) {
    if (sunCalc && typeof sunCalc.getMoonTimes === "function") {
      return sunCalc;
    }

    if (root && root.SunCalc && typeof root.SunCalc.getMoonTimes === "function") {
      return root.SunCalc;
    }

    throw new Error("SunCalc is unavailable.");
  }

  function convertDateTimeToFloat(date) {
    if (!date) {
      return NaN;
    }

    return (date.getMilliseconds() + (date.getSeconds() * 1000) + (date.getMinutes() * 60 * 1000) + (date.getHours() * 60 * 60 * 1000)) / (1000 * 3600);
  }

  function getMoonTimes(parts, latitude, longitude, sunCalc) {
    var calc = getSunCalc(sunCalc);
    var yesterday = makeLocalDate(parts, -1);
    var today = makeLocalDate(parts, 0);
    var tomorrow = makeLocalDate(parts, 1);
    var yesterdayMoon = calc.getMoonTimes(yesterday, latitude, longitude);
    var todayMoon = calc.getMoonTimes(today, latitude, longitude);
    var tomorrowMoon = calc.getMoonTimes(tomorrow, latitude, longitude);

    return {
      riseYesterday: convertDateTimeToFloat(yesterdayMoon.rise),
      rise: convertDateTimeToFloat(todayMoon.rise),
      riseTomorrow: convertDateTimeToFloat(tomorrowMoon.rise),
      setYesterday: convertDateTimeToFloat(yesterdayMoon.set),
      set: convertDateTimeToFloat(todayMoon.set),
      setTomorrow: convertDateTimeToFloat(tomorrowMoon.set)
    };
  }

  function getMoonClockHour(parts, latitude, longitude, sunCalc) {
    var times = getMoonTimes(parts, latitude, longitude, sunCalc);
    var currHour = getCurrentHour(parts);
    var clockHour = null;

    if (times.set > times.rise && currHour < times.set) {
      clockHour = getClockSegmentHour(times.set - times.rise, currHour - times.rise) + 12;
    }

    if (times.set > times.rise && currHour < times.rise) {
      clockHour = getClockSegmentHour(times.rise + 24 - times.setYesterday, currHour + 24 - times.setYesterday);
    }

    if (times.set > times.rise && currHour > times.set) {
      clockHour = getClockSegmentHour(times.riseTomorrow + 24 - times.set, currHour - times.set);
    }

    if (times.set < times.rise && currHour < times.rise) {
      clockHour = getClockSegmentHour(times.rise - times.set, currHour - times.set);
    }

    if (times.set < times.rise && currHour < times.set) {
      clockHour = getClockSegmentHour(times.set + 24 - times.riseYesterday, currHour + 24 - times.riseYesterday) + 12;
    }

    if (times.set < times.rise && currHour > times.rise) {
      clockHour = getClockSegmentHour(times.setTomorrow + 24 - times.rise, currHour - times.rise) + 12;
    }

    if (!Number.isFinite(clockHour)) {
      clockHour = 0;
    }

    return clockHour;
  }

  function getMazalIndex(hebrewDay, clockHour) {
    if (clockHour === 24) {
      clockHour = 0;
    }

    var offsetsByDay = [0, 5, 1, 4, 0, 3, 6, 2];
    return (offsetsByDay[hebrewDay] + clockHour) % 7;
  }

  function getResult(kind, hebrewDay, clockHour) {
    var index = getMazalIndex(hebrewDay, clockHour);
    return {
      kind: kind,
      hebrewDay: hebrewDay,
      hebrewHour: clockHour + 1,
      clockHour: clockHour,
      mazalIndex: index,
      mazalHour: COMMERCIAL_MAZAL_BY_INDEX[index],
      color: WOMAN_SIMPLE_COLORS_BY_INDEX[index],
      mazalTextHe: HOUR_MIDA_HE[index] + " שב" + DAY_MIDA_HE[hebrewDay - 1],
      mazalTextEn: HOUR_MIDA_EN[index] + " in " + DAY_MIDA_EN[hebrewDay - 1]
    };
  }

  function predict(input, options) {
    options = options || {};
    var parts = getDateParts(input);
    validateDateParts(parts);

    var latitude = Number(input.latitude);
    var longitude = Number(input.longitude);
    var gmt = Number(input.gmt);
    var solarClock = getSunClockHour(parts, latitude, longitude, gmt);
    var sunDay = getSunHebrewDay(parts, solarClock);
    var moonDay = normalizeHebrewDay(sunDay - 1);
    var moonClockHour = getMoonClockHour(parts, latitude, longitude, options.sunCalc || input.sunCalc);

    return {
      sun: getResult("sun", sunDay, solarClock.clockHour),
      moon: getResult("moon", moonDay, moonClockHour)
    };
  }

  return {
    COMMERCIAL_MAZAL_BY_INDEX: COMMERCIAL_MAZAL_BY_INDEX,
    WOMAN_SIMPLE_COLORS_BY_INDEX: WOMAN_SIMPLE_COLORS_BY_INDEX,
    getMazalIndex: getMazalIndex,
    normalizeHebrewDay: normalizeHebrewDay,
    predict: predict
  };
});
