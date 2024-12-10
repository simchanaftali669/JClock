//set the sunset and sunrise
function doit() {

    var nsi, ewi;
    var i;


    if (ns != "N")
        nsi = 1;
    else
        nsi = 0;

    if (ns != "W")
        ewi = 1;
    else
        ewi = 0;

    var adj = -(12 - tz);
    adj += dst;

    var sunrise = 0, sunset, sunrise_tommorow, sunset_yasterdate;
    var shaa_zmanit = 0;
    var hour = []; //29

    var yasterday = new Date();
    var today = new Date();
    var tomorrow = new Date();

    yasterday.setDate(today.getDate() - 1);
    tomorrow.setDate(today.getDate() + 1);


    //the time of yasterday
    var time_yasterday = [0, 0, 0, 0];
    time_yasterday = suntime(yasterday.getDate(), yasterday.getMonth() +1, yasterday.getYear(), 90, 50, lngd, lngm, ewi, latd, latm, nsi, adj);

    //the time of the current day
    var time_today = [0, 0, 0, 0];
    time_today = suntime(today.getDate(), today.getMonth() +1, today.getYear(), 90, 50, lngd, lngm, ewi, latd, latm, nsi, adj);

    //the time of the next day
    var time_tommorow = [0, 0, 0, 0];
    time_tommorow = suntime(tomorrow.getDate(), tomorrow.getMonth() +1, tomorrow.getYear(), 90, 50, lngd, lngm, ewi, latd, latm, nsi, adj);



    if (time_today[1] == 0) {
        //sunrise_yasterdate = time_yasterday[2];
        sunrise = time_today[2];
        sunrise_tommorow = time_tommorow[2];
        sunset_yasterdate = time_yasterday[3];
        sunset = time_today[3];
        sunset_tommorow = time_tommorow[3];

        shaa_zmanit = (sunset - sunrise) / 12;

		hour[0] = sunset_yasterdate;
		hour[1] = sunrise;
		hour[2] = sunset;
		hour[3] = sunrise_tommorow;


        //using current time in the computer to adjust the right secdule...
        //get the time right now
        var date = new Date();

        var h = date.getHours();
        var minute = date.getMinutes();
        var s = date.getSeconds();
		var m = date.getMilliseconds();
        var curr_hour = m + (s*1000) + (minute*60*1000) + (h*60*60*1000); 

        var str = timeadj1(sunset);
        var sunsetArray = str.split(":");
        sunsetH = sunsetArray[0];
        sunsetM = sunsetArray[1];
        sunsetS = sunsetArray[2];
		sunsetMili = sunsetArray[3];
        var sunset_hour =  parseInt(sunsetMili) + parseInt((sunsetS*1000)) + parseInt((sunsetM*60*1000)) + parseInt((sunsetH*60*60*1000));
		//-----------------------------------------------------------------

        //document.getElementById("Masechet").value = shaa_zmanit_night;
        var state_of_day = 0; // 0 == curr_hour < sunset_hour 
        //legnth of the shaa zmanit - night
        //if (h > sunsetH || (h == sunsetH && minute > sunsetM) || (h == sunsetH && minute == sunsetM && s > sunsetS))
	    if(curr_hour > sunset_hour)
			state_of_day = 1;
		
		if(curr_hour > sunset_hour)
			shaa_zmanit_night = (sunrise_tommorow + (24 - sunset)) / 12;
        else
            shaa_zmanit_night = (sunrise + (24 - sunset_yasterdate)) / 12;
//        hour[25] = shaa_zmanit_night;

		shaa_zmanit_next_night = (sunrise_tommorow + (24 - sunset)) / 12;

        //legnth of the shaa zmanit - day
        if(curr_hour > sunset_hour)
			shaa_zmanit_day = (sunset_tommorow - sunrise_tommorow) / 12;
        else
			shaa_zmanit_day = (sunset - sunrise) / 12;
//		hour[26] = shaa_zmanit_day;


        //seconds of shaa zmanit
//        hour[27] = Math.floor(shaa_zmanit_night * 3600.0 + 0.5);   //night
//        hour[28] = Math.floor(shaa_zmanit_day * 3600.0 + 0.5);      //day
        //----------------------
		
		//mili seconds of shaa zmanit
//		hour[29] = Math.floor(shaa_zmanit_night * 3600.0 * 1000);   //night
//		hour[30] = Math.floor(shaa_zmanit_day * 3600.0 * 1000);      //day

        //insert an array of shaot_zmaniot
        var s1, s2,s3,s4,shaa_zmanit;
        if (curr_hour > sunset_hour) 
				{
            s1 = sunset;
            s2 = sunrise_tommorow;
						s3 = sunset_tommorow;
						s4 = sunset;
						shaa_zmanit = shaa_zmanit_night;
        }
        else 
				{
            s1 = sunset_yasterdate;
            s2 = sunrise;
						s3 = sunset;
						s4 = sunset; 
						shaa_zmanit = shaa_zmanit_day;
        }

		

/*
        for (i = 0,s4=s1; i <= 11; i++, s4 += shaa_zmanit_night) 
		{
            hour[i] = timeadj1(s4);
        }
		
		for (i = 12,s4=s2; i <= 23; i++, s4 += shaa_zmanit_day) 
		{

            hour[i] = timeadj1(s4);
        }
        //------------------------------
*/
//		if(gender == genders.MALE)
//		{
			document.getElementById("hour_10_idx").value = timeadj(s2 - shaa_zmanit_night*2, ampm);
			document.getElementById("hour_11_idx").value = timeadj(s2 - shaa_zmanit_night*1, ampm);
			
			document.getElementById("hour_12_idx").value = timeadj(s2, ampm);
			document.getElementById("hour_13_idx").value = timeadj(s2 + shaa_zmanit_day, ampm);
			document.getElementById("hour_14_idx").value = timeadj(s2 + 2*shaa_zmanit_day, ampm);
			
			document.getElementById("hour_15_idx").value = timeadj(s2 + 3*shaa_zmanit_day, ampm);
			document.getElementById("hour_16_idx").value = timeadj(s2 + 4*shaa_zmanit_day, ampm);
			document.getElementById("hour_17_idx").value = timeadj(s2 + 5*shaa_zmanit_day , ampm);
			
			document.getElementById("hour_18_idx").value = timeadj(s2 + 6*shaa_zmanit_day , ampm);
			document.getElementById("hour_18-30_idx").value = timeadj(s2 + 6*shaa_zmanit_day + 0.5 , ampm);
			document.getElementById("hour_19_idx").value = timeadj(s2 + 7*shaa_zmanit_day , ampm);
			document.getElementById("hour_20_idx").value = timeadj(s2 + 8*shaa_zmanit_day , ampm);
			
			document.getElementById("hour_21_idx").value = timeadj(s2 + 9*shaa_zmanit_day , ampm);
			document.getElementById("hour_22_idx").value = timeadj(s2 + 10*shaa_zmanit_day , ampm);
			document.getElementById("hour_23_idx").value = timeadj(s2 + 11*shaa_zmanit_day , ampm);
			
			document.getElementById("hour_00_idx").value = timeadj(s3 , ampm);
			document.getElementById("hour_together").value = "Together";
			
			var time;
		
		// //עלות השחר
		// if( curr_hour > sunset_hour )
		// 	time = suntime(tomorrow.getDate(), tomorrow.getMonth() +1, tomorrow.getYear(), 106, 6, lngd, lngm, ewi, latd, latm, nsi, adj);
		// else
		// 	time = suntime(today.getDate(), today.getMonth() +1, today.getYear(), 106, 6, lngd, lngm, ewi, latd, latm, nsi, adj);
        
        // if (time[1] == 0)
		// 	document.getElementById("dawn").value = timeadj(time[2], ampm);

		// //משיכיר
		// if( curr_hour > sunset_hour )
		// 	time = suntime(tomorrow.getDate(), tomorrow.getMonth() +1, tomorrow.getYear(), 101, 0, lngd, lngm, ewi, latd, latm, nsi, adj);
        // else
		// 	time = suntime(today.getDate(), today.getMonth() +1, today.getYear(), 101, 0, lngd, lngm, ewi, latd, latm, nsi, adj);
		
		// if (time[1] == 0)
		// 	document.getElementById("misheyakir").value = timeadj(time[2], ampm);

		 //צאת הכוכבים
		 if( curr_hour > sunset_hour )
		 	time = suntime(tomorrow.getDate(), tomorrow.getMonth() +1, tomorrow.getYear(), 96, 0, lngd, lngm, ewi, latd, latm, nsi, adj);
         else
		 	time = suntime(today.getDate(), today.getMonth() +1, today.getYear(), 96, 0, lngd, lngm, ewi, latd, latm, nsi, adj);
		
		 if (time[1] == 0)
            document.getElementById("tziet").value = timeadj(time[3], ampm);
        
    }



    return hour;

}