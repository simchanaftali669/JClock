﻿var isStartPray = false;
var curr_hour;
var moonRise;
function hebrewclock()
{

    var zmanit_hour = doit();       //get the 24 shaaotzmaniot
    
	var sunset_yasterdate = zmanit_hour[0];
	var sunrise = zmanit_hour[1];
	moonRise  = sunrise;
	sunset = zmanit_hour[2];
	var sunrise_tommorow = zmanit_hour[3];
	
	var shaa_zmanit_night, shaa_zmanit_day;
    
    var date = new Date();

	var h,m,s,milisec;
	if(birthHour == null)
    {
		var h = date.getHours();
		var m = date.getMinutes();
		var s = date.getSeconds();
		var milisec = date.getMilliseconds();
	}
	else
	{
		var h = birthHour;
		var m = birthMin;
		var s = 0;
		var milisec = 0;		
	}
	curr_hour = milisec + (s*1000) + (m*60*1000) + ((h)*60*60*1000);
	
	curr_hour = curr_hour/(1000 * 3600);

	//console.log("sunset: " + sunset);
	//console.log("sunrise: " + sunrise);
	//console.log("curr_hour: " + curr_hour);

	var hour;// = Math.floor(12* (curr_hour_offset/length));
	var minute;// = Math.floor(12 * 1080 * (curr_hour_offset / length)) - hour*1080;
	var second;// = Math.floor(12 * 1080 * 76 * (curr_hour_offset / length)) - (hour * 1080 * 76) - (minute * 76);
	
	var isNight = true;
	
	//if(sunset < 12)
	//	sunset+=24;
	
	//day
	if(curr_hour > sunrise && curr_hour < sunset)
	{
		var length = sunset - sunrise;
		var curr_hour_offset = curr_hour - sunrise;
		
		hour = Math.floor(12* (curr_hour_offset/length));
		minute = Math.floor(12 * 1080 * (curr_hour_offset / length)) - hour*1080;
		second = Math.floor(12 * 1080 * 76 * (curr_hour_offset / length)) - (hour * 1080 * 76) - (minute * 76);
	    
		lbHour = hour +12 ;
		document.getElementById("Hour").value = hour;
		lbMinute = minute;
		document.getElementById("Minute").value = lbMinute;
		lbSecond = second;
		document.getElementById("Second").value = lbSecond;
		
		isNight = false;
	}
	//night before 00:00
	else if( curr_hour > sunset)
	{
		length = sunrise_tommorow + 24 - sunset;
		curr_hour_offset = curr_hour - sunset;
		
		hour = Math.floor(12* (curr_hour_offset/length));
		minute = Math.floor(12 * 1080 * (curr_hour_offset / length)) - hour*1080;
		second = Math.floor(12 * 1080 * 76 * (curr_hour_offset / length)) - (hour * 1080 * 76) - (minute * 76);

		lbHour = hour;
		document.getElementById("Hour").value = lbHour;
		lbMinute = minute;
		document.getElementById("Minute").value = lbMinute;
		lbSecond = second;
		document.getElementById("Second").value = lbSecond;
		
		isNight = true;
	}
	//day after 00:00 before sunset
	else if(curr_hour < sunrise && curr_hour < sunset)
	{
		var length = sunrise - sunset_yasterdate;
		var curr_hour_offset = curr_hour + 24 - sunrise;
		
		hour = Math.floor(12* (curr_hour_offset/length));
		minute = Math.floor(12 * 1080 * (curr_hour_offset / length)) - hour*1080;
		second = Math.floor(12 * 1080 * 76 * (curr_hour_offset / length)) - (hour * 1080 * 76) - (minute * 76);
		
		lbHour = hour;
		document.getElementById("Hour").value = lbHour;
		lbMinute = minute;
		document.getElementById("Minute").value = lbMinute;
		lbSecond = second;
		document.getElementById("Second").value = lbSecond;
		
		isNight = false;
	}
	//night after 00:00 after sunset
	else if(curr_hour < sunrise && curr_hour > sunset)
	{
		var length = sunrise + 24 - sunset_yasterdate;
		var curr_hour_offset = curr_hour + 24 - sunset_yasterdate;
		
		hour = Math.floor(12* (curr_hour_offset/length));
		minute = Math.floor(12 * 1080 * (curr_hour_offset / length)) - hour*1080;
		second = Math.floor(12 * 1080 * 76 * (curr_hour_offset / length)) - (hour * 1080 * 76) - (minute * 76);
		
		lbHour = hour;
		document.getElementById("Hour").value = lbHour;
		lbMinute = minute;
		document.getElementById("Minute").value = lbMinute;
		lbSecond = second;
		document.getElementById("Second").value = lbSecond;
		
		isNight = false;
	}


	
	display_time();
	setmazal();	
	markTime(isNight);
	
	if(lbMinute == 0)
    {
		//document.getElementsByClassName("tefilaTool").display = "none";
		//document.getElementById("tefilaTool").style.display = "none";
		doit();
		setmazal();	
	}
	
	if(curr_hour >= sunrise-1 &&  curr_hour < sunrise)
		window.location.href = "https://digitalchazan.web.app/woman";
	
	//else if(parseInt(document.getElementById("Hour").value) == 11)
	//{
		/*
		if(Math.random()*10>5)
			lbHour = 13;
		else
			lbHour = 11;
		document.getElementById("Hour").value = lbHour;
		lbMinute = 1080 - minute;
		document.getElementById("Minute").value = lbMinute;
		lbSecond = 76 - second;
		document.getElementById("Second").value = lbSecond;
		display_time();
		*/
	//	if(!isStartPray && (curr_hour > birkutHashahar)  && Math.abs(curr_hour - birkutHashahar) < 0.1)
	//	{
	//		Tefila();
	//		isStartPray = true;			
	//	}
	//		
	//}
		
	//if(lbHour == 6)
	//	isStartPray = false;
	
	//Tefila();
	sunalert(curr_hour,lbHour,lbMinute,lbSecond);
    //if(lbMinute == 0 || lbMinute == 360 || lbMinute == 720)
    //    tick_sound();
}


//---clock timer---
function oTimerclock() 
{
	oTimer = setInterval(hebrewclock, 10);
}


function display_time()
{
	//---displaying the clock---
	//second
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
    if (document.getElementById("Hour").value < 10)
        document.getElementById("Hour").value = "0" + document.getElementById("Hour").value;
    else
        document.getElementById("Hour").value = document.getElementById("Hour").value;

	
	var date = new Date();

	var h,m,s
	if(birthHour == null)
    {
		var h = date.getHours();
		var m = date.getMinutes();
		var s = date.getSeconds();
	}
	else
	{
		var h = birthHour;
		var m = birthMin;
		var s = 0;
	}
	document.getElementById("ChirstianHour").value = h<10? "0" + h : h;
	document.getElementById("ChirstianMinute").value = m<10? "0" + m : m ;
	document.getElementById("ChirstianSecond").value = s<10? "0" + s : s;

	
}

function markTime(moonSleep)
{
	//console.log(moonSleep);
	
	if(moonSleep)
	{
		document.getElementById("Hour").style.color = "#878787";
		document.getElementById("HebrewText2").style.color = "#878787";
		document.getElementById("Minute").style.color = "#878787";
		document.getElementById("HebrewText4").style.color = "#878787";
		document.getElementById("Second").style.color = "#878787";
	}
	else
	{
		document.getElementById("Hour").style.color = "#CA2C92";
		document.getElementById("HebrewText2").style.color = "#CA2C92";
		document.getElementById("Minute").style.color = "#CA2C92";
		document.getElementById("HebrewText4").style.color = "#CA2C92";
		document.getElementById("Second").style.color = "#CA2C92";
	}
	
	
}
