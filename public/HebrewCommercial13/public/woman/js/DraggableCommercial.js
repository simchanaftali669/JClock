(function() {
    var commercial = document.getElementById("commercial");
    if (!commercial) {
        return;
    }

    var storageKey = "jclock-commercial-position-" + window.location.pathname;
    var drag = {
        active: false,
        startX: 0,
        startY: 0,
        left: 0,
        top: 0
    };

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function getPoint(event) {
        if (event.touches && event.touches.length) {
            return event.touches[0];
        }

        if (event.changedTouches && event.changedTouches.length) {
            return event.changedTouches[0];
        }

        return event;
    }

    function getBounds() {
        return {
            maxLeft: Math.max(0, window.innerWidth - commercial.offsetWidth),
            maxTop: Math.max(0, window.innerHeight - commercial.offsetHeight)
        };
    }

    function applyPosition(left, top) {
        var bounds = getBounds();
        commercial.style.left = clamp(left, 0, bounds.maxLeft) + "px";
        commercial.style.top = clamp(top, 0, bounds.maxTop) + "px";
    }

    function savePosition() {
        localStorage.setItem(storageKey, JSON.stringify({
            left: commercial.offsetLeft,
            top: commercial.offsetTop
        }));
    }

    function restorePosition() {
        var saved = localStorage.getItem(storageKey);
        var rect = commercial.getBoundingClientRect();

        commercial.style.position = "fixed";
        commercial.style.right = "auto";
        commercial.style.margin = "0";
        commercial.style.zIndex = "20";
        commercial.style.cursor = "move";
        commercial.style.touchAction = "none";
        commercial.style.userSelect = "none";

        if (saved) {
            try {
                var position = JSON.parse(saved);
                applyPosition(Number(position.left) || rect.left, Number(position.top) || rect.top);
                return;
            } catch (error) {
                localStorage.removeItem(storageKey);
            }
        }

        applyPosition(rect.left, rect.top);
    }

    function startDrag(event) {
        var point = getPoint(event);
        var rect = commercial.getBoundingClientRect();

        drag.active = true;
        drag.startX = point.clientX;
        drag.startY = point.clientY;
        drag.left = rect.left;
        drag.top = rect.top;

        event.preventDefault();
        event.stopPropagation();
    }

    function moveDrag(event) {
        if (!drag.active) {
            return;
        }

        var point = getPoint(event);
        applyPosition(
            drag.left + point.clientX - drag.startX,
            drag.top + point.clientY - drag.startY
        );

        event.preventDefault();
    }

    function endDrag() {
        if (!drag.active) {
            return;
        }

        drag.active = false;
        savePosition();
    }

    restorePosition();
    window.addEventListener("load", restorePosition);
    window.setTimeout(restorePosition, 500);
    window.setTimeout(restorePosition, 1500);
    commercial.addEventListener("mousedown", startDrag);
    commercial.addEventListener("touchstart", startDrag, { passive: false });
    window.addEventListener("mousemove", moveDrag);
    window.addEventListener("touchmove", moveDrag, { passive: false });
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchend", endDrag);
    window.addEventListener("resize", function() {
        applyPosition(commercial.offsetLeft, commercial.offsetTop);
    });
})();
