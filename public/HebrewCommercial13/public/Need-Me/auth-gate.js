(function () {
  "use strict";

  var OWNER_EMAIL = "naftali126@gmail.com";
  var OWNER_PHONE = "+972527401735";
  var UMID_PATTERN = /^[0-9A-F]{24}$/;
  var UMID_STORAGE_KEY = "birthCalculatorUmid";
  var EMAIL_STORAGE_KEY = "needMeEmailForSignIn";
  var firebaseConfig = {
    projectId: "jclock126",
    appId: "1:988439843048:web:756e186a57572af2e5795d",
    storageBucket: "jclock126.firebasestorage.app",
    apiKey: "AIzaSyC_WvQBdIlM4muFZLNS_XysfJfUfJYojaY",
    authDomain: "jclock126.firebaseapp.com",
    messagingSenderId: "988439843048",
    measurementId: "G-9FTT73KY8P"
  };

  var authGate = document.getElementById("authGate");
  var umidInput = document.getElementById("authUmidInput");
  var emailButton = document.getElementById("authEmailButton");
  var smsButton = document.getElementById("authSmsButton");
  var smsCodeArea = document.getElementById("authSmsCodeArea");
  var smsCodeInput = document.getElementById("authSmsCodeInput");
  var smsConfirmButton = document.getElementById("authSmsConfirmButton");
  var statusElement = document.getElementById("authStatus");
  var confirmationResult = null;
  var recaptchaVerifier = null;

  if (!window.firebase) {
    setStatus("שירות האימות לא נטען. נא לרענן את הדף.", true);
    return;
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  var auth = firebase.auth();
  var db = firebase.firestore();
  auth.languageCode = "he";
  loadInitialUmid();

  emailButton.addEventListener("click", sendEmailLink);
  smsButton.addEventListener("click", sendSmsCode);
  smsConfirmButton.addEventListener("click", confirmSmsCode);

  completeEmailLink().finally(function () {
    auth.onAuthStateChanged(function (user) {
      if (!user) {
        return;
      }
      authorizeCurrentUmid(user);
    });
  });

  function normalizeUmid(value) {
    var normalized = String(value || "").trim().toUpperCase();
    return UMID_PATTERN.test(normalized) ? normalized : "";
  }

  function loadInitialUmid() {
    var params = new URLSearchParams(window.location.search);
    var value = normalizeUmid(params.get("umid"));
    try {
      value = value || normalizeUmid(localStorage.getItem(UMID_STORAGE_KEY));
    } catch (error) {
      // Storage can be unavailable in privacy-restricted browsers.
    }
    umidInput.value = value;
  }

  function requireUmid() {
    var umid = normalizeUmid(umidInput.value);
    if (!umid) {
      setStatus("יש להזין UMID תקין בן 24 תווי HEX.", true);
      throw new Error("invalid-umid");
    }
    umidInput.value = umid;
    try {
      localStorage.setItem(UMID_STORAGE_KEY, umid);
    } catch (error) {
      // The authenticated session can continue without local storage.
    }
    return umid;
  }

  function sendEmailLink() {
    try {
      requireUmid();
    } catch (error) {
      return;
    }
    setBusy(true);
    auth.sendSignInLinkToEmail(OWNER_EMAIL, {
      url: window.location.origin + window.location.pathname,
      handleCodeInApp: true
    }).then(function () {
      localStorage.setItem(EMAIL_STORAGE_KEY, OWNER_EMAIL);
      setStatus("קישור כניסה נשלח אל " + OWNER_EMAIL + ".");
    }).catch(showAuthError).finally(function () {
      setBusy(false);
    });
  }

  function completeEmailLink() {
    if (!auth.isSignInWithEmailLink(window.location.href)) {
      return Promise.resolve();
    }
    var email = localStorage.getItem(EMAIL_STORAGE_KEY) || OWNER_EMAIL;
    setStatus("מאמת את קישור ה־Gmail...");
    return auth.signInWithEmailLink(email, window.location.href).then(function () {
      localStorage.removeItem(EMAIL_STORAGE_KEY);
      window.history.replaceState({}, document.title, window.location.pathname);
    }).catch(showAuthError);
  }

  function getRecaptchaVerifier() {
    if (!recaptchaVerifier) {
      recaptchaVerifier = new firebase.auth.RecaptchaVerifier("authRecaptcha", {
        size: "normal"
      });
    }
    return recaptchaVerifier;
  }

  function sendSmsCode() {
    try {
      requireUmid();
    } catch (error) {
      return;
    }
    setBusy(true);
    auth.signInWithPhoneNumber(OWNER_PHONE, getRecaptchaVerifier()).then(function (result) {
      confirmationResult = result;
      smsCodeArea.hidden = false;
      smsCodeInput.focus();
      setStatus("קוד אימות נשלח למספר המסתיים ב־1735.");
    }).catch(function (error) {
      resetRecaptcha();
      showAuthError(error);
    }).finally(function () {
      setBusy(false);
    });
  }

  function confirmSmsCode() {
    if (!confirmationResult) {
      setStatus("יש לשלוח קוד SMS תחילה.", true);
      return;
    }
    var code = String(smsCodeInput.value || "").trim();
    if (!/^\d{6}$/.test(code)) {
      setStatus("יש להזין קוד בן 6 ספרות.", true);
      return;
    }
    setBusy(true);
    confirmationResult.confirm(code).catch(showAuthError).finally(function () {
      setBusy(false);
    });
  }

  function authorizeCurrentUmid(user) {
    var umid;
    try {
      umid = requireUmid();
    } catch (error) {
      auth.signOut();
      return;
    }

    var verifiedByEmail = user.email === OWNER_EMAIL && user.emailVerified;
    var verifiedByPhone = user.phoneNumber === OWNER_PHONE;
    if (!verifiedByEmail && !verifiedByPhone) {
      setStatus("החשבון או מספר הטלפון אינם מורשים לרשומה זו.", true);
      auth.signOut();
      return;
    }

    var ref = db.collection("umids").doc(umid);
    ref.set({
        umid: umid,
        gmail: OWNER_EMAIL,
        phoneE164: OWNER_PHONE,
        ownerUid: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        verifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
        verifiedBy: verifiedByEmail ? "gmail" : "sms"
      }, { merge: true }).then(function () {
      return ref.get();
    }).then(function (snapshot) {
      var record = snapshot.data();
      var emailMatches = verifiedByEmail && record.gmail === OWNER_EMAIL;
      var phoneMatches = verifiedByPhone && record.phoneE164 === OWNER_PHONE;
      if (!emailMatches && !phoneMatches) {
        throw new Error("record-owner-mismatch");
      }
      try {
        sessionStorage.setItem("needMeAuthorizedUmid", umid);
      } catch (error) {
        // Session storage is only a convenience; Firestore remains authoritative.
      }
      document.body.classList.remove("auth-pending");
      document.body.classList.add("auth-authorized");
      authGate.hidden = true;
    }).catch(function (error) {
      if (error.message === "record-owner-mismatch") {
        setStatus("רשומת ה־UMID משויכת לזהות אחרת.", true);
      } else {
        showAuthError(error);
      }
      auth.signOut();
    });
  }

  function resetRecaptcha() {
    if (!recaptchaVerifier) {
      return;
    }
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }

  function setBusy(busy) {
    emailButton.disabled = busy;
    smsButton.disabled = busy;
    smsConfirmButton.disabled = busy;
  }

  function setStatus(message, isError) {
    statusElement.textContent = message;
    statusElement.classList.toggle("is-error", Boolean(isError));
  }

  function showAuthError(error) {
    var messages = {
      "auth/invalid-action-code": "קישור האימות אינו תקף או שכבר נוצל.",
      "auth/invalid-verification-code": "קוד ה־SMS שגוי.",
      "auth/too-many-requests": "בוצעו יותר מדי ניסיונות. נא לנסות שוב מאוחר יותר.",
      "auth/quota-exceeded": "מכסת הודעות ה־SMS הסתיימה.",
      "auth/unauthorized-domain": "הדומיין אינו מורשה לאימות."
    };
    setStatus(messages[error.code] || "האימות נכשל. נא לנסות שוב.", true);
  }
}());
