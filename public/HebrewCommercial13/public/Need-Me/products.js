(function () {
  "use strict";

  window.NeedMeProducts = [
    {
      id: "beer",
      label: "בירה",
      aliases: ["בירה", "beer", "ale", "lager"],
      category: "food",
      sourceMaterial: "שעורה",
      schedulingMode: "period-start",
      actionDurationMinutes: 60,
      allowedTimeTags: ["feast", "gathering"],
      allowedMoladJewishDays: [2],
      allowedMoladPlanets: ["mars"],
      allowedHebrewHours: [5, 6, 7, 8, 9],
      allowedWeekdays: [0, 1, 2, 3, 4, 5],
      minConfidence: 0.72
    },
    {
      id: "coffee",
      label: "קפה",
      aliases: ["קפה", "coffee", "espresso"],
      category: "food",
      schedulingMode: "period-start",
      actionDurationMinutes: 60,
      allowedTimeTags: ["daily-routine"],
      allowedHebrewHours: [1, 2, 3, 4, 5],
      allowedWeekdays: [0, 1, 2, 3, 4, 5, 6],
      minConfidence: 0.7
    },
    {
      id: "clothing",
      label: "בגדים",
      aliases: ["בגדים", "clothing", "fashion", "אופנה"],
      schedulingMode: "hourly",
      allowedHebrewHours: [3, 4, 5, 6, 7, 8],
      allowedWeekdays: [0, 1, 2, 3, 4],
      minConfidence: 0.68
    },
    {
      id: "jewelry",
      label: "תכשיטים",
      aliases: ["תכשיטים", "jewelry", "jewellery", "jewel"],
      schedulingMode: "hourly",
      allowedHebrewHours: [6, 7, 8, 9, 10],
      allowedWeekdays: [0, 1, 2, 3, 4],
      minConfidence: 0.7
    },
    {
      id: "temporary-clock",
      label: "שעון זמני",
      aliases: ["שעון זמני", "שעון זמני ראש השנה", "מסכת ראש השנה", "temporary clock"],
      category: "time",
      schedulingMode: "temporary-clock",
      actionDurationMinutes: 60,
      temporaryClock: {
        moladHour: 8,
        dayParts: ["day", "night"],
        tractate: "מסכת ראש השנה"
      },
      minConfidence: 0.75
    }
  ];
}());
