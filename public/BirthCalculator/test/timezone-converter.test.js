const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const preview = require("../public/shared/hebrew-clock-preview.js");
const tzlookup = require("../public/shared/tz-lookup.js");
const time = require("../public/shared/timezone-converter.js");
const ROOT = path.resolve(__dirname, "..");

function loadSunCalc() {
  const code = fs.readFileSync(path.join(ROOT, "..", "HebrewClock13", "public", "woman", "simple", "js", "suncalc.js"), "utf8");
  const context = { Date, Math };
  vm.createContext(context);
  vm.runInContext(code, context);
  return context.SunCalc;
}

test("New York birth time on 1987-03-04 13:45 is 20:45 in Jerusalem", () => {
  const result = time.convertLocalTimeToJerusalem({
    latitude: 40.7128,
    longitude: -74.006,
    year: 1987,
    month: 3,
    day: 4,
    hour: 13,
    minute: 45,
    lookupTimeZone: tzlookup
  });

  assert.equal(result.timeZone, "America/New_York");
  assert.equal(result.sourceGmt, -5);
  assert.equal(result.jerusalemGmt, 2);
  assert.deepEqual(result.jerusalem, {
    year: 1987,
    month: 3,
    day: 4,
    hour: 20,
    minute: 45,
    second: 0
  });
  assert.equal(time.formatJerusalemDateTime(result.jerusalem), "1987-03-04 20:45");
});

test("Jerusalem summer date keeps Israeli daylight saving GMT", () => {
  const result = time.convertLocalTimeToJerusalem({
    latitude: 31.7768514,
    longitude: 35.2331664,
    year: 1990,
    month: 7,
    day: 1,
    hour: 12,
    minute: 0,
    lookupTimeZone: tzlookup
  });

  assert.equal(result.timeZone, "Asia/Jerusalem");
  assert.equal(result.jerusalemGmt, 3);
  assert.equal(time.formatGmtOffset(result.jerusalemGmt), "GMT+03:00");
});

test("color preview matches the simple moon clock for the known Jerusalem example", () => {
  const result = preview.predict({
    latitude: 31.7768514,
    longitude: 35.2331664,
    year: 1987,
    month: 3,
    day: 4,
    hour: 20,
    minute: 45,
    gmt: 2,
    sunCalc: loadSunCalc()
  });

  assert.equal(result.sun.hebrewDay, 5);
  assert.equal(result.sun.hebrewHour, 4);
  assert.equal(result.sun.mazalHour, 7);
  assert.equal(result.sun.color, "#808080");
  assert.equal(result.moon.hebrewDay, 4);
  assert.equal(result.moon.hebrewHour, 23);
  assert.equal(result.moon.mazalHour, 1);
  assert.equal(result.moon.mazalTextHe, "צדק שבשבתאי");
  assert.equal(result.moon.color, "#2D8DA1");
});

test("calculator sends Jerusalem coordinates onward to JClock", () => {
  ["he", "en"].forEach((language) => {
    const html = fs.readFileSync(path.join(ROOT, "public", language, "index.html"), "utf8");

    assert.match(html, /var JERUSALEM_LATITUDE = 31\.7768514;/);
    assert.match(html, /var JERUSALEM_LONGITUDE = 35\.2331664;/);
    assert.match(html, /var clockLatitude = JERUSALEM_LATITUDE;/);
    assert.match(html, /var clockLongitude = JERUSALEM_LONGITUDE;/);
    assert.match(html, /\?latitude=" \+ clockLatitude/);
    assert.match(html, /"&longitude=" \+ clockLongitude/);
    assert.doesNotMatch(html, /\?latitude=" \+ latitude/);
    assert.doesNotMatch(html, /"&longitude=" \+ longitude/);
    assert.match(html, /jclock\.net\/HebrewClock13\/public\/woman\/simple\/js\/suncalc\.js\?v=20260707-final-hebrew-day/);
    assert.match(html, /shared\/hebrew-clock-preview\.js\?v=20260707-color-preview-db-share/);
    assert.match(html, /id="color-preview"/);
    assert.match(html, /id="sun-color-swatch"/);
    assert.match(html, /id="moon-color-swatch"/);
    assert.match(html, /id="whatsapp-db-button"/);
    assert.match(html, /id="child-name-he"/);
    assert.match(html, /id="child-name-en"/);
    assert.match(html, /document\.getElementById\('child-name-he'\)/);
    assert.match(html, /document\.getElementById\('child-name-en'\)/);
    assert.doesNotMatch(html, /id="db-name-he"/);
    assert.doesNotMatch(html, /id="db-name-en"/);
    assert.match(html, /id="db-phone"/);
    assert.match(html, /WHATSAPP_DB_PHONE = "972587401735"/);
    assert.match(html, /buildWhatsappDbMessage/);
    assert.match(html, /buildWhatsappIntro/);
    assert.match(html, /שמי /);
    assert.match(html, /I would like you to add me to the website/);
    assert.doesNotMatch(html, /add me to the site/);
    assert.match(html, /wa\.me/);
    assert.match(html, /updateColorPreview\(timeInfo\)/);

    if (language === "he") {
      assert.match(html, /שליחה להוספה לאתר/);
      assert.match(html, /שלח וואטסאפ להוספה לאתר/);
      assert.doesNotMatch(html, /להוספה ל-DB/);
    } else {
      assert.match(html, /Send to add to website/);
      assert.match(html, /Send WhatsApp to add to website/);
      assert.doesNotMatch(html, /add to site/);
      assert.doesNotMatch(html, /add to DB/);
    }
  });
});
