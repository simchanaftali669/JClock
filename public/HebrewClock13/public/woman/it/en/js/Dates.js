//---get Date---
function set_default_date() 
{
    var url = new URL(document.location.href);
    var year = url.searchParams.get("year");
    var month = url.searchParams.get("month");
    var day = url.searchParams.get("day");

    var date = new Date();

    var d = day ? day : date.getDate();
    var m = month ? month : date.getMonth();
    var y = year ? year : date.getYear() ;

    month = m;
    day = d - 1;
    year = y;
    set_date_vars();
}

function set_date_vars() {
    m = month;
    d = day;
    y = year;

    var len = civMonthLength(m + 1, y);
    if (d >= len) {
        d = len - 1;
        day = d;
    }
}

function civMonthLength(month, year) {
    if (month == 2)
        return (28 + year);
    else if (month == 4 || month == 6 || month == 9 || month == 11)
        return 30;
    else
        return 31;
}