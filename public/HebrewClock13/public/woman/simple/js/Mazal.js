//mazal of the hour
function setmazal() 
{
	
	var date = new Date();
	var userLang = navigator.language || navigator.userLanguage;	
	
	if (userLang.includes("he")) 
	{
		var hebrew_month_name = hebrewDate(date.getYear()+1900, date.getMonth()+1, date.getDate(), "Hebrew");
		document.getElementById('Mazal').innerText = hebrew_month_name['date'] + " ב" + hebrew_month_name['month_name'];
	}
	else
	{
		var hebrew_month_name = hebrewDate(date.getYear()+1900, date.getMonth()+1, date.getDate(),"English");
		document.getElementById('Mazal').innerText = hebrew_month_name['date'] + " at " + hebrew_month_name['month_name'];
	}
		
	document.body.style.backgroundImage = "url('pic/7.jpg')";
	
	//return;

    var date = new Date();

    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();



    var day = date.getDay() + 1;
    var clockHour = lbHour;
    if (clockHour == 24)
        clockHour = 0;

    if ((h == sunsetH && m == sunsetM && s >= sunsetS) ||    // אחרי שקיעה
        (h == sunsetH && m > sunsetM) ||
        (h > sunsetH)
       )
        if ((h == 23 && m == 23 && s <= 59) ||    // לפני חצות
            (h == 23 && m < 59) ||
            (h < 23)
           )
            day = day + 1;


    //document.getElementById("test").value = h > sunsetH;

    if (day == 8)
        day = 1;

    hebrewday = day;
	hebrewday += hebrewDayOffset();
	
	if(hebrewday == 0)
		hebrewday = 7;

	//console.log("hebrewday: " + hebrewday);
	//console.log("clockHour: " + clockHour);

    var day_mida = ["חסד", "גבורה", "תפארת", "נצח", "הוד", "יסוד", "מלכות"];
    var x = 0;
    if (hebrewday == 1)
        x = (5 + clockHour) % 7;
    if (hebrewday == 2)
        x = (1 + clockHour) % 7;
    if (hebrewday == 3)
        x = (4 + clockHour) % 7;
    if (hebrewday == 4)
        x = (0 + clockHour) % 7;
    if (hebrewday == 5)
        x = (3 + clockHour) % 7;
    if (hebrewday == 6)
        x = (6 + clockHour) % 7;
    if (hebrewday == 7)
        x = (2 + clockHour) % 7;


	switch (x) 
	{
		case (1):
			//document.getElementById("Mazal").setAttribute("ondblclick" ,"window.open('tel:+972527401735')");
			//document.getElementById("Mazal").innerText = day_mida[day - 1];
			paintText("#5DBCD2");
			//document.body.style.backgroundImage = "url('pic/1.jpg')";
			//omer = ((day - 1) * 7) + 1;
			break;
		case (2):
			//document.getElementById("Mazal").setAttribute("href","tel:+972587401735");
			//document.getElementById("Mazal").innerText = day_mida[day - 1];
			paintText("#A6230E");
			//document.body.style.backgroundImage = "url('pic/2.jpg')";
			//omer = ((day - 1) * 7) + 2;
			break;
		case (3):
			//document.getElementById("Mazal").setAttribute("ondblclick" ,"window.open('tel:+972527401735')");
			//document.getElementById("Mazal").setAttribute("href","tel:+972548887390");
			//document.getElementById("Mazal").innerText = day_mida[day - 1];
			paintText("#815AA8")
			//document.body.style.backgroundImage = "url('pic/3.jpg')";
			//omer = ((day - 1) * 7) + 3;
			break;
		case (0):
			//document.getElementById("Mazal").setAttribute("href","tel:+972587401735");
			//document.getElementById("Mazal").innerText = day_mida[day - 1];
			paintText("#84C45E");
			//document.body.style.backgroundImage = "url('pic/4.jpg')";
			//omer = ((day - 1) * 7) + 4;
			break;
		case (4):
			//document.getElementById("Mazal").setAttribute("href","tel:+972524295486");
			//document.getElementById("Mazal").innerText = day_mida[day - 1];
			paintText("#BA8D1A");
			//document.body.style.backgroundImage = "url('pic/5.jpg')";
			//omer = ((day - 1) * 7) + 5;
			break;
		case (5):
			//document.getElementById("Mazal").setAttribute("href","tel:+972587401735");
			//document.getElementById("Mazal").innerText = day_mida[day - 1];
			paintText("#B45D02");
			//document.body.style.backgroundImage = "url('pic/6.jpg')";
			//omer = ((day - 1) * 7) + 6;
			break;
		case (6):
			//document.getElementById("Mazal").setAttribute("href","tel:+972526071874");
			//document.getElementById("Mazal").innerText = day_mida[day - 1];
			paintText("#808080");
			//document.body.style.backgroundImage = "url('pic/7.jpg')";
			//omer = ((day - 1) * 7) + 7;
			break;
		default:
			break;
	}
}

function paintText(p_color)
{
	var clockInputs = document.getElementsByClassName("clock");
	for(var i=0 ; i< clockInputs.length ; i++)
		clockInputs[i].style.color = p_color;
}


