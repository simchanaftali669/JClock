var preLbMin_man = 0;
var curr_hour_man;
function hebrewclock_man()
{
    let zmanit_hour = doit_man();       //get the 24 shaaotzmaniot
    
	let sunrise_yasterday_man = zmanit_hour[0];
	let sunrise_man = zmanit_hour[1];
	let sunrise_tommorow_man = zmanit_hour[2];
	let sunset_yasterday_man = zmanit_hour[3];
	sunset_man = zmanit_hour[4];
	let sunset_tommorow_man = zmanit_hour[5];
	
	let shaa_zmanit_night, shaa_zmanit_day;
    
    let date = new Date();

    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
	let milisec = date.getMilliseconds();

	curr_hour_man = milisec + (s*1000) + (m*60*1000) + ((h)*60*60*1000);
	
	curr_hour_man = curr_hour_man/(1000 * 3600);

	//console.log("sunset_man:" + " " + sunset_man);
	//console.log("sunrise_man:" + " " + sunrise_man);
	//console.log("curr_hour_man:" + " " + curr_hour_man);
	
	

	if(sunset_man > sunrise_man && curr_hour_man < sunset_man)
	{
		//console.log("1");
		let length = sunset_man - sunrise_man;
		let curr_hour_offset = curr_hour_man - sunrise_man;
		
		hour = Math.floor(12* (curr_hour_offset/length));
		minute = Math.floor(12 * 1080 * (curr_hour_offset / length)) - hour*1080;
		second = Math.floor(12 * 1080 * 76 * (curr_hour_offset / length)) - (hour * 1080 * 76) - (minute * 76);
	    
		lbHour_man = hour+12;
		//document.getElementById("Hour").value = hour;
		lbMinute_man = minute;
		//document.getElementById("Minute").value = lbMinute;
		lbSecond_man = second;
		//document.getElementById("Second").value = lbSecond;
	}
	//case 2:
	//moonrise at 06:57 and moonset at 17:17
	//curr_hour earlier.
	else if(sunset_man > sunrise_man && curr_hour_man < sunrise_man)
	{
		//console.log("2");
		let length = sunrise_man + 24-sunset_yasterday_man;
		let curr_hour_offset = curr_hour_man + 24-sunset_yasterday;
		
		hour = Math.floor(12* (curr_hour_offset/length));
		minute = Math.floor(12 * 1080 * (curr_hour_offset / length)) - hour*1080;
		second = Math.floor(12 * 1080 * 76 * (curr_hour_offset / length)) - (hour * 1080 * 76) - (minute * 76);
	    
		lbHour_man = hour;
		lbMinute_man = minute;
		lbSecond_man = second;
	}
	//case 3:
	//moonrise at 06:57 and moonset at 17:17
	//curr_hour after moonset.
	if(sunset_man > sunrise_man && curr_hour_man > sunset_man)
	{
		//console.log("3");
		let length = sunrise_tommorow_man + 24-sunset_man;
		let curr_hour_offset = curr_hour_man - sunset_man;
		
		hour = Math.floor(12* (curr_hour_offset/length));
		minute = Math.floor(12 * 1080 * (curr_hour_offset / length)) - hour*1080;
		second = Math.floor(12 * 1080 * 76 * (curr_hour_offset / length)) - (hour * 1080 * 76) - (minute * 76);
	    
		lbHour_man = hour;
		lbMinute_man = minute;
		lbSecond_man = second;
	}
	//month days 07-23	
	//moonrise at 13:05 and moonset at 00:00
	//curr_hour between them.
	if(sunset_man < sunrise_man  && curr_hour_man < sunrise_man)
	{
		let length = sunrise_man - sunset_man;
		let curr_hour_offset = curr_hour_man - sunset_man;
		
		hour = Math.floor(12* (curr_hour_offset/length));
		minute = Math.floor(12 * 1080 * (curr_hour_offset / length)) - hour*1080;
		second = Math.floor(12 * 1080 * 76 * (curr_hour_offset / length)) - (hour * 1080 * 76) - (minute * 76);
	    
		lbHour_man = hour;
		lbMinute_man = minute;
		lbSecond_man = second;
	}
	//case 2:
	//moonrise at 13:05 and moonset at 00:00
	//curr_hour earlier.
	if(sunset_man < sunrise_man && curr_hour_man < sunset_man)
	{
		let length = sunset_man + 24-sunrise_yasterday_man;
		let curr_hour_offset = curr_hour_man + 24-sunrise_yasterday_man;
		
		hour = Math.floor(12* (curr_hour_offset/length));
		minute = Math.floor(12 * 1080 * (curr_hour_offset / length)) - hour*1080;
		second = Math.floor(12 * 1080 * 76 * (curr_hour_offset / length)) - (hour * 1080 * 76) - (minute * 76);
	    
		lbHour_man = hour + 12;
		lbMinute_man = minute;
		lbSecond_man = second;
	}
	//case 3:
	//moonrise at 13:05 and moonset at 00:00
	//curr_hour after moonset.
	if(sunset_man < sunrise_man && curr_hour_man > sunrise_man)
	{
		let length = sunset_tommorow_man + 24-sunrise_man;
		let curr_hour_offset = curr_hour_man - sunrise_man;
		
		hour = Math.floor(12* (curr_hour_offset/length));
		minute = Math.floor(12 * 1080 * (curr_hour_offset / length)) - hour*1080;
		second = Math.floor(12 * 1080 * 76 * (curr_hour_offset / length)) - (hour * 1080 * 76) - (minute * 76);
	    
		lbHour_man = hour +12 ;
		lbMinute_man = minute;
		lbSecond_man = second;	
	}


	//if(preLbMin != lbMinute)
	//{		
		////console.log(lbMinute);
		//doit();
     //   setmazal();
		
	//	commercialFunction();
//		preLbMin = lbMinute;
//	}   
    //if(lbMinute == 0)
    //    sederLimud();
}


//---clock timer---
function oTimerclock() {
//    if (lbHour < 12)
        oTimer = setInterval(hebrewclock, 10);
//    else
//        oTimer = setInterval(hebrewclock, (shaa_zmanit_day) * 60 * 60 * 1000 / (1080*76));
}

function clock() {
    //adding one second
    lbSecond++;
    if (lbSecond == 76)
    {
        lbSecond = 0;
        lbMinute++;
        if(lbMinute == 270 || lbMinute == 540 || lbMinute == 720)
            sederLimud();
    }
    if (lbMinute == 1080)
    {
        lbMinute = 0;
        lbHour++;
        setmazal();
        setMasechet();
        setSefer();
        setParasha();
        sederLimud();

        clearInterval(oTimer);
        oTimerclock();
        //clearInterval(oTimer);
        //getLocation();
        //return;
    }
    else if (lbMinute > 1079)
    {
        lbMinute -= 1080;
        lbHour++;
        setmazal();
        setMasechet();
        setSefer();
        setParasha();

        clearInterval(oTimer);
        oTimerclock();
    }

    if (lbHour == 24)
        lbHour = 0;
    else if (lbHour > 23)
    {
        lbHour -= 24;
    }
}

function display_time()
{
	    //---dispaying the clock---
    if (lbSecond < 10)
        document.getElementById("Second").value = "0" + lbSecond;
    else
        document.getElementById("Second").value = lbSecond;

    //minute
    if (lbMinute < 10)
        document.getElementById("Minute").value = "000" + lbMinute;
    else if (lbMinute < 100)
        document.getElementById("Minute").value = "00" + lbMinute;
    else if (lbMinute < 1000)
        document.getElementById("Minute").value = "0" + lbMinute;
    else
        document.getElementById("Minute").value = lbMinute;

    //hour
//    if (lbHour < 12)
        lbHourClock = lbHour;
//    else
//        lbHourClock = lbHour - 12;
	
	//offset();

    if (document.getElementById("Hour").value < 10)
        document.getElementById("Hour").value = "0" + document.getElementById("Hour").value;
    else
        document.getElementById("Hour").value = document.getElementById("Hour").value;

}

function offset()
{
	if (lbHour < 22) // 0==>2, 1==>3, 2==>4, 3==>5, 4==>6, 5==>7, 6==>8, 7==>9, 8==>10, 9==>11
       lbHourClock = lbHour + 2;
    else // 22 ==> 0, 23==> 1, 24==>2
       lbHourClock = lbHour + 2 - 24;		
}

function markTime()
{	
	////console.log("curr_hour: " + curr_hour);
	////console.log("sunset: " + sunset);
	////console.log("misheyakir: " + misheyakir);

		return;
	if(curr_hour > tzeit  || 
	   curr_hour < misheyakir)
	{
		document.getElementById("Hour").style.color = "#878787";
		document.getElementById("Text2").style.color = "#878787";
		document.getElementById("Minute").style.color = "#878787";
		document.getElementById("Text4").style.color = "#878787";
		document.getElementById("Second").style.color = "#878787";
	}
	else if(curr_hour < sunset && 
			curr_hour > misheyakir/*curr_hour.toDouble() > sunrise_hour.toDouble()*/ )
	{
		document.getElementById("Hour").style.color = "#5DBCD2";
		document.getElementById("Text2").style.color = "#5DBCD2";
		document.getElementById("Minute").style.color = "#5DBCD2";
		document.getElementById("Text4").style.color = "#5DBCD2";
		document.getElementById("Second").style.color = "#5DBCD2";	
	}
}
