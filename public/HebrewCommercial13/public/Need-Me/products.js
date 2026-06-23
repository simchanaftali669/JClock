(function () {
  "use strict";

  window.NeedMeProducts = [
    {
      id: "cordykos",
      label: "תרופה לשיגעון",
      labelEn: "Medicine for Madness",
      aliases: ["תרופה לשיגעון", "קורדייקוס", "קורדיקוס", "cordykos", "kordykos", "madness medicine", "medicine for madness", "insanity medicine", "גיטין", "מסכת גיטין"],
      category: "health",
      sourceMaterial: "מסכת גיטין",
      sourceMaterialEn: "Tractate Gittin",
      schedulingMode: "temporary-clock",
      actionDurationMinutes: 60,
      temporaryClock: {
        hebrewDay: 3,
        moladHours: [6, 12, 18, 24],
        dayParts: ["day", "night"],
        tractate: "מסכת גיטין"
      },
      minConfidence: 0.75
    },
    {
      id: "resurrection",
      label: "תחיית המתים",
      labelEn: "Resurrection of the Dead",
      aliases: ["תחיית המתים", "תחית המתים", "resurrection", "revival of the dead", "שבת", "מסכת שבת"],
      category: "health",
      sourceMaterial: "מסכת שבת, פרק ראשון",
      sourceMaterialEn: "Tractate Shabbat, Chapter One",
      schedulingMode: "temporary-clock",
      actionDurationMinutes: 60,
      temporaryClock: {
        moladHour: 1,
        hebrewDay: 7,
        dayParts: ["night"],
        tractate: "מסכת שבת",
        chapter: "פרק ראשון"
      },
      minConfidence: 0.75
    },
    {
      id: "cancer-medicine",
      label: "תרופה לסרטן",
      labelEn: "Cancer Medicine",
      aliases: ["תרופה לסרטן", "סרטן", "cancer medicine", "cancer treatment", "נגעים", "מסכת נגעים", "משלי", "ספר משלי", "לך לך", "פרשת לך לך"],
      category: "health",
      sourceMaterial: "מסכת נגעים, ספר משלי, פרשת לך לך",
      sourceMaterialEn: "Tractate Negaim, Book of Proverbs, Parashat Lech Lecha",
      schedulingMode: "temporary-clock",
      actionDurationMinutes: 60,
      temporaryClock: {
        moladHour: 15,
        hebrewDay: 6,
        dayParts: ["day"],
        tractate: "מסכת נגעים",
        book: "ספר משלי",
        parasha: "פרשת לך לך"
      },
      minConfidence: 0.75
    }
  ];
}());
