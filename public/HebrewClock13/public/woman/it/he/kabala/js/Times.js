//set the moonset and moonrise
function doit() {
    var url = new URL(document.location.href);
    var yearParam = url.searchParams.get("year");
    var monthParam = url.searchParams.get("month");
    var dayParam = url.searchParams.get("day");
    var hourParam = url.searchParams.get("hour");
    var minParam = url.searchParams.get("min");

    var now = new Date();
    var h = hourParam == null ? now.getHours() : Number(hourParam);
    var minute = minParam == null ? now.getMinutes() : Number(minParam);
    var s = hourParam == null ? now.getSeconds() : 0;
    var m = hourParam == null ? now.getMilliseconds() : 0;
    var today = yearParam ? new Date(Number(yearParam), Number(monthParam) - 1, Number(dayParam), h, minute, s, m) : now;
    var yesterday = addDays(today, -1);
    var tomorrow = addDays(today, 1);

    var time_yasterday = getMoonTimePair(yesterday);
    var time_today = getMoonTimePair(today);
    var time_tommorow = getMoonTimePair(tomorrow);

    var sunrise_yasterday = time_yasterday[2];
    var sunrise = time_today[2];
    var sunrise_tommorow = time_tommorow[2];
    var sunset_yasterdate = time_yasterday[3];
    var sunset = time_today[3];
    var sunset_tommorow = time_tommorow[3];

    var hour = [];
    hour[0] = sunset_yasterdate;
    hour[1] = sunrise;
    hour[2] = sunrise_tommorow;
    hour[3] = sunset_yasterdate;
    hour[4] = sunset;
    hour[5] = sunset_tommorow;

    var mazal_ordered = ["לבנה", "שבתאי", "צדק", "מאדים", "חמה", "נוגה", "כוכב"];
    var mazal_night_01 = [6, 2, 5, 1, 4, 7, 3];
    var mazal_day_01 = [4, 7, 3, 6, 2, 5, 1];
    var baseDate = new Date(today.getTime());
    baseDate.setHours(0, 0, 0, 0);
    var currentHour = hoursFromBase(today, baseDate);
    var scheduleSegments = getScheduleSegments(today, baseDate, currentHour);

    ensureScheduleHourRows(36);

    for (var segmentIndex = 0; segmentIndex < scheduleSegments.length; segmentIndex++) {
        renderScheduleSegment(
            (segmentIndex * 12) + 1,
            scheduleSegments[segmentIndex],
            mazal_ordered,
            mazal_day_01,
            mazal_night_01
        );
    }

    return hour;
}

function getMoonTimePair(date) {
    var moonTimes = SunCalc.getMoonTimes(date, latitude, longitude);
    var rise = moonTimes.rise ? convertDateTimeToFloat(moonTimes.rise) : 0;
    var set = moonTimes.set ? convertDateTimeToFloat(moonTimes.set) : 0;
    return [0, 0, rise, set];
}

function getScheduleSegments(today, baseDate, currentHour) {
    var events = [];

    for (var offset = -3; offset <= 4; offset++) {
        var moonDate = addDays(today, offset);
        var moonTimes = SunCalc.getMoonTimes(moonDate, latitude, longitude);

        if (moonTimes.rise) {
            events.push({
                type: "rise",
                hour: hoursFromBase(moonTimes.rise, baseDate),
                date: moonTimes.rise
            });
        }

        if (moonTimes.set) {
            events.push({
                type: "set",
                hour: hoursFromBase(moonTimes.set, baseDate),
                date: moonTimes.set
            });
        }
    }

    events.sort(function (a, b) {
        return a.hour - b.hour;
    });

    var intervals = [];
    for (var i = 0; i < events.length - 1; i++) {
        if (events[i].type === events[i + 1].type) {
            continue;
        }

        var isDay = events[i].type === "rise";
        var titleDate = isDay ? events[i].date : events[i + 1].date;
        intervals.push({
            start: events[i].hour,
            end: events[i + 1].hour,
            hourLength: (events[i + 1].hour - events[i].hour) / 12,
            isDay: isDay,
            hebrewDay: normalizeHebrewDay(titleDate.getDay() + 1),
            date: titleDate
        });
    }

    var currentIndex = 0;
    for (var j = 0; j < intervals.length; j++) {
        if (currentHour >= intervals[j].start && currentHour < intervals[j].end) {
            currentIndex = j;
            break;
        }

        if (intervals[j].start <= currentHour) {
            currentIndex = j;
        }
    }

    var firstIndex = Math.max(0, currentIndex - 1);
    var selected = intervals.slice(firstIndex, firstIndex + 3);
    while (selected.length < 3 && firstIndex > 0) {
        firstIndex--;
        selected = intervals.slice(firstIndex, firstIndex + 3);
    }

    return selected;
}

function hoursFromBase(date, baseDate) {
    return (date.getTime() - baseDate.getTime()) / (60 * 60 * 1000);
}

function normalizeDisplayHour(hourValue) {
    return ((hourValue % 24) + 24) % 24;
}

function ensureScheduleHourRows(totalHours) {
    for (var i = 13; i <= totalHours; i++) {
        if (document.getElementById("hour_" + i + "__value")) {
            continue;
        }

        var previousIndex = document.getElementById("hour_" + (i - 1) + "_idx");
        if (!previousIndex || !previousIndex.parentNode) {
            return;
        }

        var row = document.createElement("div");
        row.style.textAlign = "center";

        var indexInput = document.createElement("input");
        indexInput.id = "hour_" + i + "_idx";
        indexInput.className = "zmanim_index";
        indexInput.type = "text";

        var labelInput = document.createElement("input");
        labelInput.id = "hour_" + i + "__label";
        labelInput.className = "zmanim_text";
        labelInput.type = "text";

        var valueInput = document.createElement("input");
        valueInput.id = "hour_" + i + "__value";
        valueInput.className = "zmanim_hour";
        valueInput.type = "text";

        row.appendChild(indexInput);
        row.appendChild(labelInput);
        row.appendChild(valueInput);
        previousIndex.parentNode.insertAdjacentElement("afterend", row);
    }
}

function renderScheduleSegment(startRow, segment, mazalOrdered, mazalDay, mazalNight) {
    var mazalStart = segment.isDay ? mazalDay[segment.hebrewDay - 1] : mazalNight[segment.hebrewDay - 1];
    renderHebrewDateTitle(startRow, segment.date, segment.isDay);

    for (var i = 0; i < 12; i++) {
        var rowNumber = startRow + i;
        var hourLabel = document.getElementById("hour_" + rowNumber + "__label");
        var hourValue = document.getElementById("hour_" + rowNumber + "__value");
        var hourIndex = document.getElementById("hour_" + rowNumber + "_idx");

        if (!hourLabel || !hourValue) {
            continue;
        }

        hourLabel.value = "תפילת " + mazalOrdered[(mazalStart + i) % 7];
        hourValue.value = timeadj(normalizeDisplayHour(segment.start + (segment.hourLength * i)), ampm);
        if (hourIndex) {
            hourIndex.value = "(" + (i + 1) + ")";
        }
    }
}

function renderHebrewDateTitle(startRow, date, isDay) {
    var firstHour = document.getElementById("hour_" + startRow + "__value");
    if (!firstHour || !firstHour.parentNode) {
        return;
    }

    var titleId = "hebrew_date_title_" + startRow;
    var title = document.getElementById(titleId);

    if (!title) {
        var row = document.createElement("div");
        row.style.textAlign = "center";

        title = document.createElement("input");
        title.id = titleId;
        title.className = "zmanim_text";
        title.type = "text";
        title.readOnly = true;
        title.style.width = "650px";

        row.appendChild(title);
        firstHour.parentNode.insertAdjacentElement("beforebegin", row);
    }

    title.value = (isDay ? "יום " : "ליל ") + getHebrewDateTitle(date);
}

function getHebrewDateTitle(date) {
    if (typeof hebrewDate === "function") {
        if (typeof tzeit === "undefined") {
            tzeit = 25;
        }

        var originalTzeit = tzeit;
        tzeit = 25;
        var hebrew = hebrewDate(date.getFullYear(), date.getMonth() + 1, date.getDate(), "Hebrew");
        tzeit = originalTzeit;
        return hebrew["date"] + " ב" + hebrew["month_name"];
    }

    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}

function addDays(date, days) {
    var result = new Date(date.getTime());
    result.setDate(result.getDate() + days);
    return result;
}

function normalizeHebrewDay(day) {
    return ((day - 1) % 7 + 7) % 7 + 1;
}
