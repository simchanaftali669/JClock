(function () {
  "use strict";

  var GOOGLE_CLIENT_ID = "PASTE_GOOGLE_OAUTH_CLIENT_ID_HERE";
  var CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.events";
  var REMINDER_MINUTES = [10080, 1440, 120, 20];
  var MAX_RENDERED_RESULTS = 120;
  var JERUSALEM_TIME_ZONE = "Asia/Jerusalem";
  var TEMPORARY_CLOCK_REFERENCE = {
    moladHour: 8,
    dayParts: ["day", "night"],
    tractate: "מסכת ראש השנה"
  };
  var moladRangeCache = {};

  var state = {
    accessToken: "",
    slots: [],
    selectedProduct: null
  };

  var form = document.getElementById("plannerForm");
  var productInput = document.getElementById("productInput");
  var timeZoneInput = document.getElementById("timeZoneInput");
  var regionInput = document.getElementById("regionInput");
  var audienceInput = document.getElementById("audienceInput");
  var audienceField = document.getElementById("audienceField");
  var startDateInput = document.getElementById("startDateInput");
  var rangeModeInput = document.getElementById("rangeModeInput");
  var daysInput = document.getElementById("daysInput");
  var monthsInput = document.getElementById("monthsInput");
  var durationInput = document.getElementById("durationInput");
  var periodStartOnlyInput = document.getElementById("periodStartOnlyInput");
  var workStartField = document.getElementById("workStartField");
  var workEndField = document.getElementById("workEndField");
  var workStartInput = document.getElementById("workStartInput");
  var workEndInput = document.getElementById("workEndInput");
  var slotCount = document.getElementById("slotCount");
  var rangeText = document.getElementById("rangeText");
  var calendarStatus = document.getElementById("calendarStatus");
  var resultsList = document.getElementById("resultsList");
  var productSuggestions = document.getElementById("productSuggestions");
  var googleConnectButton = document.getElementById("googleConnectButton");
  var createCalendarButton = document.getElementById("createCalendarButton");
  var downloadJsonButton = document.getElementById("downloadJsonButton");

  function init() {
    startDateInput.value = toInputDate(new Date());
    renderProductSuggestions();
    rangeModeInput.addEventListener("change", syncRangeControls);
    regionInput.addEventListener("change", syncAudienceControls);
    periodStartOnlyInput.addEventListener("change", syncPeriodStartOnlyControls);
    form.addEventListener("submit", handlePlanSubmit);
    googleConnectButton.addEventListener("click", connectGoogle);
    createCalendarButton.addEventListener("click", createCalendarEvents);
    downloadJsonButton.addEventListener("click", downloadJson);
    syncRangeControls();
    syncAudienceControls();
    syncPeriodStartOnlyControls();
    refreshActions();
  }

  function renderProductSuggestions() {
    productSuggestions.innerHTML = "";
    window.NeedMeProducts.forEach(function (product) {
      product.aliases.forEach(function (alias) {
        var option = document.createElement("option");
        option.value = alias;
        productSuggestions.appendChild(option);
      });
    });
  }

  function handlePlanSubmit(event) {
    event.preventDefault();
    var product = findProduct(productInput.value);
    state.selectedProduct = product;

    if (!product) {
      state.slots = [];
      renderResults("המוצר לא נמצא במאגר המקומי.");
      refreshActions();
      return;
    }

    var durationMinutes = getDurationMinutes(product);
    var requestedStart = startOfSelectedDate(startDateInput.value);
    var range = getSelectedRange(requestedStart, timeZoneInput.value);
    var clockModel = getSelectedClockModel();
    state.diagnostics = createDiagnostics();
    state.rangeLabel = range.label;

    state.slots = buildSchedule({
      product: product,
      start: range.start,
      end: range.end,
      rangeLabel: range.label,
      timeZone: timeZoneInput.value,
      durationMinutes: durationMinutes,
      workStart: workStartInput.value,
      workEnd: workEndInput.value,
      periodStartOnly: periodStartOnlyInput.checked,
      clockModel: clockModel,
      region: regionInput.value,
      audience: audienceInput.value,
      diagnostics: state.diagnostics
    });

    renderResults("");
    refreshActions();
  }

  function findProduct(rawName) {
    var name = normalizeText(rawName);
    return window.NeedMeProducts.find(function (product) {
      return product.aliases.some(function (alias) {
        return normalizeText(alias) === name;
      });
    });
  }

  function normalizeText(value) {
    return String(value || "").trim().toLowerCase();
  }

  function createDiagnostics() {
    return {
      candidateCount: 0,
      filteredByWorkHours: 0
    };
  }

  function getDurationMinutes(product) {
    if (getSchedulingMode(product) === "period-start" || getSchedulingMode(product) === "temporary-clock") {
      return Number(product.actionDurationMinutes || 60);
    }

    return Number(durationInput.value || 60);
  }

  function getSelectedRange(requestedStart, timeZone) {
    if (rangeModeInput.value === "days") {
      var days = Math.min(Number(daysInput.value || 1), 31);
      return {
        start: requestedStart,
        end: addDays(requestedStart, days),
        label: toInputDate(requestedStart) + " + " + days + " ימים"
      };
    }

    if (rangeModeInput.value === "shmita") {
      return getShmitaRange(requestedStart, timeZone);
    }

    if (rangeModeInput.value === "yovel") {
      return getYovelRange(requestedStart, timeZone);
    }

    var months = Math.min(Number(monthsInput.value || 6), 588);
    return {
      start: requestedStart,
      end: addMonths(requestedStart, months),
      label: toInputDate(requestedStart) + " + " + months + " חודשים"
    };
  }

  function getYovelRange(requestedStart, timeZone) {
    var hebrew = getHebrewDateForDate(requestedStart, timeZone);
    var yovelStartYear = hebrew.year - positiveModulo(hebrew.year - 1, 49);
    var yovelEndYear = yovelStartYear + 50;
    var rangeStart = findHebrewDateBoundary(yovelStartYear, 1, requestedStart, -1, timeZone);
    var rangeEnd = findHebrewDateBoundary(yovelEndYear, 1, requestedStart, 1, timeZone);
    var yovelCycle = Math.floor((yovelStartYear - 1) / 49) + 1;
    var yovelFiftiethYear = yovelEndYear - 1;

    return {
      start: rangeStart,
      end: rangeEnd,
      label: "יובל " + hebrewNumber(yovelCycle) + " · " + yovelStartYear + "-" + yovelFiftiethYear + " · שנה 50: " + yovelFiftiethYear + " · בלי שנות שמיטה"
    };
  }

  function getShmitaRange(requestedStart, timeZone) {
    var hebrew = getHebrewDateForDate(requestedStart, timeZone);
    var shmitaStartYear = hebrew.year - positiveModulo(hebrew.year - 1, 7);
    var shmitaEndYear = shmitaStartYear + 7;
    var rangeStart = findHebrewDateBoundary(shmitaStartYear, 1, requestedStart, -1, timeZone);
    var rangeEnd = findHebrewDateBoundary(shmitaEndYear, 1, requestedStart, 1, timeZone);
    var yovelStartYear = shmitaStartYear - positiveModulo(shmitaStartYear - 1, 49);
    var yovelCycle = Math.floor((yovelStartYear - 1) / 49) + 1;
    var weekInYovel = Math.floor((shmitaStartYear - yovelStartYear) / 7) + 1;

    return {
      start: rangeStart,
      end: rangeEnd,
      label: "שבוע " + hebrewWeekLetter(weekInYovel) + " בתוך יובל " + hebrewNumber(yovelCycle) + " · " + shmitaStartYear + "-" + (shmitaEndYear - 1) + " · בלי שנת שמיטה"
    };
  }

  function findHebrewDateBoundary(hebrewYear, hebrewMonth, anchorDate, direction, timeZone) {
    var cursor = getEstimatedHebrewYearBoundarySearchStart(hebrewYear, hebrewMonth, anchorDate, direction);
    var maxDays = 80;
    var step = hebrewMonth === 1 ? 1 : direction;

    for (var day = 0; day < maxDays; day += 1) {
      var hebrew = getHebrewDateForDate(cursor, timeZone);
      if (hebrew.year === hebrewYear && hebrew.month === hebrewMonth && hebrew.date === 1) {
        return cursor;
      }

      cursor = addDays(cursor, step);
    }

    return direction < 0 ? addMonths(anchorDate, -588) : addMonths(anchorDate, 588);
  }

  function getEstimatedHebrewYearBoundarySearchStart(hebrewYear, hebrewMonth, anchorDate, direction) {
    if (hebrewMonth === 1) {
      return new Date(Date.UTC(hebrewYear - 3761, 8, 1, 0, 0, 0));
    }

    return new Date(anchorDate.getTime());
  }

  function getHebrewDateForDate(date, timeZone) {
    var parts = window.NeedMeItAdapter.getZonedParts(date, timeZone);
    if (typeof window.hebrewDate === "function") {
      return window.hebrewDate(parts.year, parts.month, parts.day, "English");
    }

    var info = window.NeedMeItAdapter.computeItTimeInfo({ date: date, timeZone: timeZone });
    return {
      year: info.hebrew.year,
      month: info.hebrew.month,
      date: info.hebrew.day
    };
  }

  function buildSchedule(options) {
    if (getSchedulingMode(options.product) === "period-start") {
      return buildPeriodStartSchedule(options);
    }

    if (getSchedulingMode(options.product) === "temporary-clock") {
      return buildTemporaryClockSchedule(options);
    }

    var cursor = new Date(options.start.getTime());
    var slots = [];

    while (cursor < options.end) {
      var info = window.NeedMeItAdapter.computeItTimeInfo({
        date: cursor,
        timeZone: options.timeZone
      });

      if (isSkippedHebrewYear(info)) {
        cursor = addMinutes(cursor, 60);
        continue;
      }

      var allowedHour = isAllowedHour(options.product, info);
      var allowedDay = isAllowedDay(options.product, info);
      var allowedPeriod = isAllowedActivationSignal(options.product, info.period);
      var allowedTemporaryClock = isAllowedTemporaryClock(options.product, info);
      var confident = info.confidence >= options.product.minConfidence;

      if (allowedHour && allowedDay && allowedPeriod && allowedTemporaryClock && confident) {
        var slot = toSlot(options.product, cursor, options.timeZone, options.durationMinutes, info, options);
        if (slot.relevance !== "none") {
          slots.push(slot);
        }
      }

      cursor = addMinutes(cursor, 60);
    }

    return mergeConsecutiveSlots(slots);
  }

  function buildPeriodStartSchedule(options) {
    var molads = getCachedMoladStartsBetween(options.start, options.end, options.timeZone);
    var slots = [];

    molads.forEach(function (molad) {
      var info = molad.info;

      if (isSkippedHebrewYear(info)) {
        return;
      }

      if (!isAllowedActivationSignal(options.product, info.period) || info.confidence < options.product.minConfidence) {
        return;
      }

      var slot = toSlot(options.product, molad.date, options.timeZone, options.durationMinutes, info, options);
      if (slot.relevance !== "none") {
        slots.push(slot);
      }
    });

    return selectPeriodStartSlots(slots);
  }

  function buildTemporaryClockSchedule(options) {
    var reference = options.product.temporaryClock || TEMPORARY_CLOCK_REFERENCE;
    var molads = getCachedMoladStartsBetween(options.start, options.end, options.timeZone);
    var slots = [];

    molads.forEach(function (molad) {
      var info = molad.info;

      if (!isSkippedHebrewYear(info) && isAllowedTemporaryClock(options.product, info) && info.confidence >= options.product.minConfidence) {
        options.diagnostics.candidateCount += 1;
        var slot = toSlot(options.product, molad.date, options.timeZone, options.durationMinutes, info, options);
        if (slot.relevance !== "none") {
          slots.push(slot);
        } else {
          options.diagnostics.filteredByWorkHours += 1;
        }
      }
    });

    return mergeConsecutiveSlots(slots);
  }

  function getCachedMoladStartsBetween(start, end, timeZone) {
    var cacheKey = [start.getTime(), end.getTime(), timeZone].join("|");

    if (!moladRangeCache[cacheKey]) {
      moladRangeCache[cacheKey] = window.NeedMeItAdapter.getMoladStartsBetween(start, end, timeZone);
    }

    return moladRangeCache[cacheKey];
  }

  function getFirstTemporaryClockDate(start, timeZone, reference) {
    var parts = window.NeedMeItAdapter.getZonedParts(start, timeZone);
    var dateKey = [
      String(parts.year).padStart(4, "0"),
      String(parts.month).padStart(2, "0"),
      String(parts.day).padStart(2, "0")
    ].join("-");
    var civilTarget = getCivilClockFromHebrewClock(reference);
    var candidate = zonedLocalToUtc(dateKey, String(civilTarget.hour).padStart(2, "0") + ":00", timeZone);

    while (candidate < start || !isMatchingTemporaryClockDate(candidate, timeZone, reference)) {
      candidate = moveTemporaryClockDate(candidate, timeZone, reference, 1);
    }

    return candidate;
  }

  function moveTemporaryClockDate(date, timeZone, reference, days) {
    var parts = window.NeedMeItAdapter.getZonedParts(date, timeZone);
    var dateKey = [
      String(parts.year).padStart(4, "0"),
      String(parts.month).padStart(2, "0"),
      String(parts.day).padStart(2, "0")
    ].join("-");
    var nextDateKey = addDaysToDateKey(dateKey, days);
    var civilTarget = getCivilClockFromHebrewClock(reference);

    return zonedLocalToUtc(nextDateKey, String(civilTarget.hour).padStart(2, "0") + ":00", timeZone);
  }

  function toSlot(product, start, timeZone, durationMinutes, info, options) {
    var window = getAdvertisingWindow(product, start, timeZone, durationMinutes, info, options);
    var relevance = window.periodStartOnly
      ? { type: "period-start-only" }
      : getWorkWindowRelevance(window, timeZone, options.workStart, options.workEnd);

    return {
      productId: product.id,
      productLabel: product.label,
      startEpoch: window.start.getTime(),
      endEpoch: window.end.getTime(),
      startDateTime: toCalendarDateTime(window.start, timeZone),
      endDateTime: toCalendarDateTime(window.end, timeZone),
      timeZone: timeZone,
      durationMinutes: Math.round((window.end.getTime() - window.start.getTime()) / 60000),
      it: info,
      slotCount: 1,
      schedulingMode: getSchedulingMode(product),
      period: info.period,
      relevance: relevance.type,
      overlapStartDateTime: relevance.overlapStart ? toCalendarDateTime(relevance.overlapStart, timeZone) : "",
      overlapEndDateTime: relevance.overlapEnd ? toCalendarDateTime(relevance.overlapEnd, timeZone) : "",
      windowKind: window.kind,
      anchorSource: window.anchorSource || "",
      periodStartOnly: Boolean(window.periodStartOnly),
      region: options.region || "",
      audience: options.audience || "",
      temporaryClock: getTemporaryClockReference(),
      reminders: REMINDER_MINUTES.slice()
    };
  }

  function getAdvertisingWindow(product, moladDate, timeZone, durationMinutes, info, options) {
    if (getSchedulingMode(product) === "temporary-clock") {
      if (options.periodStartOnly) {
        return {
          start: moladDate,
          end: addMinutes(moladDate, durationMinutes),
          kind: "temporary-clock",
          anchorSource: "molad",
          periodStartOnly: true
        };
      }

      return {
        start: moladDate,
        end: addMinutes(moladDate, durationMinutes),
        kind: "temporary-clock"
      };
    }

    if (getSchedulingMode(product) !== "period-start") {
      return {
        start: moladDate,
        end: addMinutes(moladDate, durationMinutes),
        kind: "hourly"
      };
    }

    if (options.periodStartOnly) {
      return {
        start: moladDate,
        end: addMinutes(moladDate, durationMinutes),
        kind: "period-start-only",
        userTimeZone: timeZone,
        anchorSource: "molad",
        periodStartOnly: true
      };
    }

    return getMoladAdvertisingWindow(moladDate, timeZone, info.period, options.clockModel);
  }

  function getMoladAdvertisingWindow(moladDate, userTimeZone, period, clockModel) {
    var kind = getMoladWindowKind(period);
    var anchors = getJerusalemAnchorsForWindow(moladDate, clockModel);
    var range = getAnchorRange(kind, anchors);

    return {
      start: range.start,
      end: range.end,
      kind: kind,
      userTimeZone: userTimeZone,
      anchorSource: anchors.source
    };
  }

  function getJerusalemAnchorsForWindow(date, clockModel) {
    if (window.NeedMeCommercialTime && typeof window.NeedMeCommercialTime.getJerusalemAnchors === "function") {
      return window.NeedMeCommercialTime.getJerusalemAnchors(date, clockModel || "sun");
    }

    throw new Error("Need-Me commercial time anchors are not loaded");
  }

  function getSelectedClockModel() {
    var region = regionInput.value;

    if (region === "europe" || region === "africa") {
      return "moon";
    }

    if (isAudienceSpecificRegion(region)) {
      return audienceInput.value === "girls" ? "moon" : "sun";
    }

    return "sun";
  }

  function isAudienceSpecificRegion(region) {
    return region === "middle-east" || region === "ireland";
  }

  function getAnchorRange(kind, anchors) {
    if (kind === "tishrei") {
      return { start: anchors.noon, end: anchors.sunset };
    }

    if (kind === "yovel") {
      return { start: anchors.sunset, end: anchors.midnight };
    }

    if (kind === "nissan") {
      return { start: anchors.midnight, end: addDays(anchors.sunrise, anchors.sunrise < anchors.midnight ? 1 : 0) };
    }

    return { start: anchors.sunrise, end: anchors.noon };
  }

  function getMoladWindowKind(period) {
    if (period && period.type === "tishrei" && period.yovel && period.yovel.isYovelStart) {
      return "yovel";
    }

    if (period && period.type === "tishrei") {
      return "tishrei";
    }

    if (period && period.type === "nissan") {
      return "nissan";
    }

    return "month";
  }

  function getWorkWindowRelevance(slotWindow, timeZone, workStart, workEnd) {
    return getOverlapRelevance(slotWindow.start, slotWindow.end, timeZone, workStart, workEnd);
  }

  function getOverlapRelevance(start, end, timeZone, workStart, workEnd) {
    var localStart = window.NeedMeItAdapter.getZonedParts(start, timeZone);
    var dateKey = [
      localStart.year,
      String(localStart.month).padStart(2, "0"),
      String(localStart.day).padStart(2, "0")
    ].join("-");
    var workWindowStart = zonedLocalToUtc(dateKey, workStart, timeZone);
    var workWindowEnd = zonedLocalToUtc(dateKey, workEnd, timeZone);

    if (workWindowEnd <= workWindowStart) {
      workWindowEnd = addDays(workWindowEnd, 1);
    }

    var overlapStart = new Date(Math.max(start.getTime(), workWindowStart.getTime()));
    var overlapEnd = new Date(Math.min(end.getTime(), workWindowEnd.getTime()));

    if (overlapEnd <= overlapStart) {
      return { type: "none" };
    }

    if (overlapStart.getTime() === start.getTime() && overlapEnd.getTime() === end.getTime()) {
      return { type: "full", overlapStart: overlapStart, overlapEnd: overlapEnd };
    }

    return { type: "partial", overlapStart: overlapStart, overlapEnd: overlapEnd };
  }

  function isAllowedActivationSignal(product, period) {
    if (getSchedulingMode(product) !== "period-start") {
      return true;
    }

    if (!period || !period.isStart) {
      return false;
    }

    if (hasMoladSignatureRules(product)) {
      return isAllowedMoladSignature(product, period);
    }

    if (!product.allowedTimeTags || !product.allowedTimeTags.length) {
      return true;
    }

    var allowedTag = period.tags && period.tags.some(function (tag) {
      return product.allowedTimeTags.indexOf(tag) !== -1;
    });

    return allowedTag;
  }

  function hasMoladSignatureRules(product) {
    return Boolean((product.allowedMoladJewishDays && product.allowedMoladJewishDays.length) ||
      (product.allowedMoladPlanets && product.allowedMoladPlanets.length));
  }

  function isAllowedMoladSignature(product, period) {
    var allowedDays = product.allowedMoladJewishDays || [];
    var allowedPlanets = product.allowedMoladPlanets || [];

    if (!allowedDays.length && !allowedPlanets.length) {
      return true;
    }

    if (!period || !period.molad) {
      return false;
    }

    if (allowedDays.indexOf(period.molad.jewishDay) !== -1) {
      return true;
    }

    return allowedPlanets.indexOf(getMoladPlanet(period.molad)) !== -1;
  }

  function getMoladPlanet(molad) {
    var planetsByDay = {
      1: "sun",
      2: "moon",
      3: "mars",
      4: "mercury",
      5: "jupiter",
      6: "venus",
      7: "saturn"
    };

    return planetsByDay[molad.jewishDay] || "";
  }

  function isAllowedTemporaryClock(product, info) {
    if (getSchedulingMode(product) !== "temporary-clock") {
      return true;
    }

    var reference = product.temporaryClock || TEMPORARY_CLOCK_REFERENCE;
    var molad = info.period && info.period.molad;

    if (!molad) {
      return false;
    }

    var allowedParts = reference.dayParts || ["day", "night"];
    return molad.jewishHourOrdinal === Number(reference.moladHour || reference.hebrewHour) &&
      allowedParts.indexOf(molad.jewishDayPart) !== -1;
  }

  function getTemporaryClockSignature(info) {
    return getHebrewClockSignatureFromZonedParts(info.gregorian);
  }

  function getTemporaryClockSignatureFromDate(date, timeZone) {
    var parts = window.NeedMeItAdapter.getZonedParts(date, timeZone);
    return getHebrewClockSignatureFromZonedParts(parts);
  }

  function getHebrewClockSignatureFromZonedParts(parts) {
    var weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekdayName);
    var hebrewDay = weekday + 1;

    if (parts.hour >= 18) {
      hebrewDay = positiveModulo(hebrewDay, 7) + 1;
    }

    return {
      hebrewDay: hebrewDay,
      hebrewHour: positiveModulo(parts.hour + 6, 24) + 1
    };
  }

  function getCivilClockFromHebrewClock(reference) {
    var hebrewHour = positiveModulo(Number(reference.hebrewHour) - 1, 24);

    return {
      hour: positiveModulo(hebrewHour + 18, 24)
    };
  }

  function isMatchingTemporaryClockDate(date, timeZone, reference) {
    var signature = getTemporaryClockSignatureFromDate(date, timeZone);
    return signature.hebrewDay === Number(reference.hebrewDay) &&
      signature.hebrewHour === Number(reference.hebrewHour);
  }

  function isAllowedHour(product, info) {
    if (getSchedulingMode(product) === "period-start" || getSchedulingMode(product) === "temporary-clock") {
      return true;
    }

    return product.allowedHebrewHours.indexOf(info.hebrewHour) !== -1;
  }

  function isAllowedDay(product, info) {
    if (getSchedulingMode(product) === "period-start" || getSchedulingMode(product) === "temporary-clock") {
      return true;
    }

    return product.allowedWeekdays.indexOf(info.weekday) !== -1;
  }

  function isSkippedHebrewYear(info) {
    return info.hebrew && info.hebrew.year % 7 === 0;
  }

  function getSchedulingMode(product) {
    return product.schedulingMode || "hourly";
  }

  function selectPeriodStartSlots(slots) {
    var selectedByPeriod = {};

    slots.forEach(function (slot) {
      var period = slot.period || { key: "unknown" };

      if (period.isStart && (!selectedByPeriod[period.key] || isBetterPeriodStart(slot, selectedByPeriod[period.key]))) {
        selectedByPeriod[period.key] = clonePeriodStartSlot(slot);
      }
    });

    return Object.keys(selectedByPeriod).sort().map(function (periodKey) {
      return selectedByPeriod[periodKey];
    });
  }

  function isBetterPeriodStart(candidate, current) {
    if (candidate.period && candidate.period.isStart && !(current.period && current.period.isStart)) {
      return true;
    }

    if (!(candidate.period && candidate.period.isStart) && current.period && current.period.isStart) {
      return false;
    }

    return candidate.startEpoch < current.startEpoch;
  }

  function clonePeriodStartSlot(slot) {
    var cloned = cloneSlot(slot);
    cloned.slotCount = 1;
    cloned.durationMinutes = slot.durationMinutes;
    return cloned;
  }

  function mergeConsecutiveSlots(slots) {
    if (!slots.length) {
      return [];
    }

    return slots.reduce(function (merged, slot) {
      var previous = merged[merged.length - 1];

      if (previous && canMergeSlots(previous, slot)) {
        previous.endEpoch = slot.endEpoch;
        previous.endDateTime = slot.endDateTime;
        previous.durationMinutes += slot.durationMinutes;
        previous.slotCount += 1;
        previous.it = {
          source: previous.it.source,
          gregorian: previous.it.gregorian,
          weekday: previous.it.weekday,
          hebrewHour: previous.it.hebrewHour,
          timeCode: previous.it.timeCode + "-" + slot.it.timeCode,
          confidence: Math.min(previous.it.confidence, slot.it.confidence)
        };
        return merged;
      }

      merged.push(cloneSlot(slot));
      return merged;
    }, []);
  }

  function canMergeSlots(previous, slot) {
    return previous.productId === slot.productId &&
      previous.timeZone === slot.timeZone &&
      previous.endEpoch === slot.startEpoch;
  }

  function cloneSlot(slot) {
    return {
      productId: slot.productId,
      productLabel: slot.productLabel,
      startEpoch: slot.startEpoch,
      endEpoch: slot.endEpoch,
      startDateTime: slot.startDateTime,
      endDateTime: slot.endDateTime,
      timeZone: slot.timeZone,
      durationMinutes: slot.durationMinutes,
      it: slot.it,
      slotCount: slot.slotCount,
      schedulingMode: slot.schedulingMode,
      period: slot.period,
      relevance: slot.relevance,
      overlapStartDateTime: slot.overlapStartDateTime,
      overlapEndDateTime: slot.overlapEndDateTime,
      windowKind: slot.windowKind,
      anchorSource: slot.anchorSource,
      periodStartOnly: slot.periodStartOnly,
      region: slot.region,
      audience: slot.audience,
      temporaryClock: slot.temporaryClock,
      reminders: slot.reminders.slice()
    };
  }

  function toCalendarDateTime(date, timeZone) {
    var parts = window.NeedMeItAdapter.getZonedParts(date, timeZone);
    return [
      String(parts.year).padStart(4, "0"),
      "-",
      String(parts.month).padStart(2, "0"),
      "-",
      String(parts.day).padStart(2, "0"),
      "T",
      String(parts.hour).padStart(2, "0"),
      ":",
      String(parts.minute).padStart(2, "0"),
      ":00"
    ].join("");
  }

  function renderResults(message) {
    slotCount.textContent = String(state.slots.length);
    rangeText.textContent = state.rangeLabel || "-";
    resultsList.innerHTML = "";

    if (message) {
      appendMessage(message, "slot-warning");
      return;
    }

    if (!state.slots.length) {
      if (state.diagnostics && state.diagnostics.filteredByWorkHours > 0) {
        appendMessage("נמצאו " + state.diagnostics.filteredByWorkHours + " חתימות זמן, אבל כולן מחוץ לשעות העבודה שנבחרו.", "slot-warning");
        return;
      }

      appendMessage("לא נמצאו חלונות פרסום בטווח שנבחר.", "slot-warning");
      return;
    }

    state.slots.slice(0, MAX_RENDERED_RESULTS).forEach(function (slot) {
      var item = document.createElement("li");
      item.className = "result-item";
      item.innerHTML =
        "<span class=\"slot-time\">" + escapeHtml(formatSlotTime(slot)) + "</span>" +
        "<span class=\"slot-detail\">" + escapeHtml(formatSlotDetail(slot)) + "</span>" +
        "<span class=\"slot-ok\">" + escapeHtml(formatRelevance(slot)) + "</span>";
      resultsList.appendChild(item);
    });

    if (state.slots.length > MAX_RENDERED_RESULTS) {
      appendMessage("מוצגות " + MAX_RENDERED_RESULTS + " תוצאות ראשונות מתוך " + state.slots.length + ".", "slot-detail");
    }
  }

  function appendMessage(text, className) {
    var item = document.createElement("li");
    item.className = "result-item";
    item.innerHTML = "<span class=\"" + className + "\">" + escapeHtml(text) + "</span>";
    resultsList.appendChild(item);
  }

  function formatSlotTime(slot) {
    if (slot.periodStartOnly) {
      return "תחילת תקופה: " + slot.startDateTime.replace("T", " ");
    }

    return "תקופה: " + slot.startDateTime.replace("T", " ") + " - " + slot.endDateTime.slice(11, 16);
  }

  function formatSlotDetail(slot) {
    var parts = [slot.productLabel, slot.timeZone];
    if (slot.schedulingMode === "temporary-clock") {
      parts.push(formatTemporaryClock(slot.temporaryClock));
      parts.push(formatMolad(slot.period));
      parts.push(formatWindowKind(slot.windowKind));
      parts.push(formatAudienceContext(slot.region, slot.audience));
      return parts.join(" · ");
    }

    if (slot.schedulingMode === "period-start") {
      parts.push(formatPeriodContext(slot.period));
      parts.push(formatMolad(slot.period));
      var sourceMaterial = formatSourceMaterial(slot.productId);
      if (sourceMaterial) {
        parts.push(sourceMaterial);
      }
      parts.push(formatWindowKind(slot.windowKind));
      parts.push(formatAnchorSource(slot.anchorSource));
      parts.push(formatAudienceContext(slot.region, slot.audience));
      parts.push(formatTemporaryClock(slot.temporaryClock));
      parts.push(formatTimeTags(slot.period));
      parts.push("נקודת כניסה לשימוש");
      return parts.join(" · ");
    }

    if (slot.slotCount > 1) {
      parts.push(slot.slotCount + " שעות רצופות");
    }
    return parts.join(" · ");
  }

  function formatRelevance(slot) {
    if (slot.periodStartOnly) {
      return "תחילת תקופה";
    }

    if (slot.relevance === "full") {
      return "לעמוד בחנות: כל החלון";
    }

    if (slot.relevance === "partial") {
      return "לעמוד בחנות: " + slot.overlapStartDateTime.slice(11, 16) + "-" + slot.overlapEndDateTime.slice(11, 16);
    }

    return "לא מתאים";
  }

  function formatWindowKind(kind) {
    var names = {
      month: "מולד חודש: זריחה עד חצות",
      tishrei: "חלון מולד תשרי: חצות עד שקיעה",
      yovel: "חלון מולד תשרי של יובל: שקיעה עד חצות לילה",
      nissan: "מולד ניסן: חצות לילה עד זריחה",
      "period-start-only": "תחילת תקופה בלבד",
      "temporary-clock": "חלון שעון זמני",
      hourly: "חלון שעתי"
    };
    return names[kind] || "חלון מכירה";
  }

  function formatAnchorSource(source) {
    if (source === "molad") {
      return "נקודת המולד";
    }

    if (source === "moon") {
      return "שעון לבנה ירושלים";
    }

    if (source === "sun") {
      return "שעון חמה ירושלים";
    }

    return "שעון ירושלים";
  }

  function formatAudienceContext(region, audience) {
    if (isAudienceSpecificRegion(region)) {
      return audience === "girls" ? "קהל: בנות" : "קהל: בנים";
    }

    return formatRegion(region);
  }

  function getTemporaryClockReference() {
    var reference = {
      moladHour: TEMPORARY_CLOCK_REFERENCE.moladHour,
      dayParts: TEMPORARY_CLOCK_REFERENCE.dayParts,
      tractate: TEMPORARY_CLOCK_REFERENCE.tractate
    };

    return reference;
  }

  function formatTemporaryClock(reference) {
    if (!reference) {
      return "שעון זמני";
    }

    var parts = [
      "שעון זמני",
      "מולד שעה " + (reference.moladHour || reference.hebrewHour),
      "יום או לילה",
      reference.tractate
    ];

    return parts.join(" / ");
  }

  function getHebrewDayName(day) {
    var names = {
      1: "ראשון",
      2: "שני",
      3: "שלישי",
      4: "רביעי",
      5: "חמישי",
      6: "שישי",
      7: "שבת"
    };

    return names[day] || String(day);
  }

  function formatRegion(region) {
    var names = {
      "middle-east": "מזרח תיכון",
      ireland: "אירלנד",
      europe: "אירופה",
      africa: "אפריקה",
      asia: "אסיה",
      "north-america": "צפון אמריקה",
      "south-america": "דרום אמריקה",
      oceania: "אוקיאניה"
    };

    return names[region] || "אזור";
  }

  function formatPeriod(period) {
    if (!period) {
      return "תקופה";
    }

    var names = {
      nissan: "ניסן",
      tishrei: "תשרי",
      regularMonth: "חודש רגיל"
    };
    return names[period.type] || period.type || "תקופה";
  }

  function formatPeriodContext(period) {
    if (!period) {
      return "פרסום חודשי";
    }

    if (period.type === "tishrei" && period.yovel && period.yovel.isYovelStart) {
      return "מולד תשרי של יובל " + period.yovel.cycle;
    }

    if (period.type === "tishrei") {
      return "מולד שנתי: תשרי";
    }

    if (period.type === "nissan") {
      return "מולד ניסן";
    }

    return "מולד חודשי";
  }

  function formatMolad(period) {
    if (!period || !period.molad) {
      return "מולד";
    }

    var partName = period.molad.jewishDayPart === "night" ? "ליל" : "יום";
    return "מולד: שעה " + numberToHebrewOrdinal(period.molad.jewishHourOrdinal) + " של " + partName + " " + period.molad.jewishDayName;
  }

  function formatSourceMaterial(productId) {
    var product = window.NeedMeProducts.find(function (item) {
      return item.id === productId;
    });

    if (!product || !product.sourceMaterial) {
      return "";
    }

    return "מקור: " + product.sourceMaterial;
  }

  function numberToHebrewOrdinal(value) {
    var names = {
      1: "ראשונה",
      2: "שניה",
      3: "שלישית",
      4: "רביעית",
      5: "חמישית",
      6: "שישית",
      7: "שביעית",
      8: "שמינית",
      9: "תשיעית",
      10: "עשירית",
      11: "אחת עשרה",
      12: "שתים עשרה",
      13: "שלוש עשרה",
      14: "ארבע עשרה",
      15: "חמש עשרה",
      16: "שש עשרה",
      17: "שבע עשרה",
      18: "שמונה עשרה",
      19: "תשע עשרה",
      20: "עשרים",
      21: "עשרים ואחת",
      22: "עשרים ושתיים",
      23: "עשרים ושלוש",
      24: "עשרים וארבע"
    };
    return names[value] || String(value);
  }

  function formatTimeTags(period) {
    if (!period || !period.tags || !period.tags.length) {
      return "חתימת זמן";
    }

    var names = {
      "daily-routine": "שגרה",
      feast: "סעודה",
      gathering: "התכנסות",
      "season-start": "פתיחת תקופה"
    };

    return period.tags.map(function (tag) {
      return names[tag] || tag;
    }).join(", ");
  }

  function connectGoogle() {
    if (GOOGLE_CLIENT_ID.indexOf("PASTE_") === 0) {
      calendarStatus.textContent = "חסר Client ID";
      return;
    }

    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      calendarStatus.textContent = "Google עדיין נטען";
      return;
    }

    var tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: CALENDAR_SCOPE,
      callback: function (response) {
        if (response && response.access_token) {
          state.accessToken = response.access_token;
          calendarStatus.textContent = "מחובר";
          refreshActions();
        }
      }
    });

    tokenClient.requestAccessToken({ prompt: "consent" });
  }

  function createCalendarEvents() {
    if (!state.accessToken || !state.slots.length) {
      refreshActions();
      return;
    }

    createCalendarButton.disabled = true;
    createCalendarButton.textContent = "יוצר אירועים...";

    var queue = state.slots.slice();
    var created = 0;

    runSequentially(queue, function (slot) {
      return insertCalendarEvent(slot).then(function () {
        created += 1;
        calendarStatus.textContent = "נוצרו " + created + "/" + state.slots.length;
      });
    }).then(function () {
      calendarStatus.textContent = "האירועים נוצרו";
    }).catch(function () {
      calendarStatus.textContent = "שגיאה ביצירת אירוע";
    }).finally(function () {
      createCalendarButton.textContent = "צור אירועים ביומן";
      refreshActions();
    });
  }

  function insertCalendarEvent(slot) {
    var event = {
      summary: "לפרסם: " + slot.productLabel,
      description: buildEventDescription(slot),
      start: {
        dateTime: slot.startDateTime,
        timeZone: slot.timeZone
      },
      end: {
        dateTime: slot.endDateTime,
        timeZone: slot.timeZone
      },
      reminders: {
        useDefault: false,
        overrides: slot.reminders.map(function (minutes) {
          return { method: "popup", minutes: minutes };
        })
      }
    };

    return fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + state.accessToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(event)
    }).then(function (response) {
      if (!response.ok) {
        throw new Error("Calendar insert failed");
      }
      return response.json();
    });
  }

  function buildEventDescription(slot) {
    if (slot.schedulingMode === "period-start") {
      return "Need-Me · " + formatPeriodContext(slot.period) + ". " + formatMolad(slot.period) + ". פעולה נקודתית סביב המולד. חתימת זמן: " + formatTimeTags(slot.period) + ".";
    }

    return "Need-Me · להעלות פרסום בתחילת האירוע ולהוריד בסוף.";
  }

  function runSequentially(items, worker) {
    return items.reduce(function (promise, item) {
      return promise.then(function () {
        return worker(item);
      });
    }, Promise.resolve());
  }

  function downloadJson() {
    var payload = JSON.stringify(state.slots, null, 2);
    var blob = new Blob([payload], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "need-me-schedule.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function refreshActions() {
    createCalendarButton.disabled = !state.accessToken || !state.slots.length;
    downloadJsonButton.disabled = !state.slots.length;
  }

  function syncRangeControls() {
    var isFixedCycle = rangeModeInput.value === "shmita" || rangeModeInput.value === "yovel";
    var isDaysRange = rangeModeInput.value === "days";
    daysInput.disabled = !isDaysRange;
    monthsInput.disabled = isFixedCycle || isDaysRange;
  }

  function syncAudienceControls() {
    var needsAudience = isAudienceSpecificRegion(regionInput.value);
    audienceInput.disabled = !needsAudience;
    audienceField.classList.toggle("is-muted", !needsAudience);
  }

  function syncPeriodStartOnlyControls() {
    var hideWorkHours = periodStartOnlyInput.checked;
    workStartField.hidden = hideWorkHours;
    workEndField.hidden = hideWorkHours;
    workStartInput.required = !hideWorkHours;
    workEndInput.required = !hideWorkHours;
  }

  function startOfSelectedDate(value) {
    var parts = String(value).split("-").map(Number);
    return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 0, 0, 0));
  }

  function toInputDate(date) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
  }

  function addMonths(date, months) {
    var next = new Date(date.getTime());
    next.setUTCMonth(next.getUTCMonth() + months);
    return next;
  }

  function addDays(date, days) {
    return new Date(date.getTime() + days * 86400000);
  }

  function addDaysToDateKey(dateKey, days) {
    var parts = dateKey.split("-").map(Number);
    var date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 0, 0, 0));
    return toInputDate(addDays(date, days));
  }

  function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }

  function zonedLocalToUtc(dateKey, timeValue, timeZone) {
    var dateParts = dateKey.split("-").map(Number);
    var timeParts = timeValue.split(":").map(Number);
    var guess = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1] || 0, 0));

    for (var i = 0; i < 3; i += 1) {
      var zoned = window.NeedMeItAdapter.getZonedParts(guess, timeZone);
      var wantedMinutes = Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1] || 0, 0) / 60000;
      var actualMinutes = Date.UTC(zoned.year, zoned.month - 1, zoned.day, zoned.hour, zoned.minute, 0) / 60000;
      guess = new Date(guess.getTime() + (wantedMinutes - actualMinutes) * 60000);
    }

    return guess;
  }

  function positiveModulo(value, divisor) {
    return ((value % divisor) + divisor) % divisor;
  }

  function hebrewWeekLetter(value) {
    var letters = ["א", "ב", "ג", "ד", "ה", "ו", "ז"];
    return letters[value - 1] || String(value);
  }

  function hebrewNumber(value) {
    var hundreds = ["", "ק", "ר", "ש", "ת"];
    var tens = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
    var ones = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
    var remaining = Number(value);
    var result = "";

    while (remaining >= 400) {
      result += "ת";
      remaining -= 400;
    }

    result += hundreds[Math.floor(remaining / 100)] || "";
    remaining %= 100;

    if (remaining === 15) {
      result += "טו";
    } else if (remaining === 16) {
      result += "טז";
    } else {
      result += tens[Math.floor(remaining / 10)] || "";
      result += ones[remaining % 10] || "";
    }

    return addHebrewNumberPunctuation(result);
  }

  function addHebrewNumberPunctuation(value) {
    if (value.length <= 1) {
      return value + "'";
    }

    return value.slice(0, -1) + "\"" + value.slice(-1);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;"
      }[char];
    });
  }

  init();
}());
