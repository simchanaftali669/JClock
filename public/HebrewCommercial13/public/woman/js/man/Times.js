//set the sunset and sunrise
function doit_man() {

    let nsi_man, ewi_man;
    let i_man;


    if (ns != "N")
        nsi = 1;
    else
        nsi = 0;

    if (ns != "W")
        ewi = 1;
    else
        ewi = 0;

    let adj = -(12 - tz);
    adj += dst;

    let sunrise = 0, sunset, sunrise_tommorow, sunset_yasterdate;
    let shaa_zmanit = 0;
    let hour = []; //29

    let yasterday = new Date();
    let today = new Date();
    let tomorrow = new Date();

    yasterday.setDate(today.getDate() - 1);
    tomorrow.setDate(today.getDate() + 1);


    //the time of yasterday
    let time_yasterday = [0, 0, 0, 0];
    time_yasterday = suntime(yasterday.getDate(), yasterday.getMonth() +1, yasterday.getYear(), 90, 50, lngd, lngm, ewi, latd, latm, nsi, adj);

    //the time of the current day
    let time_today = [0, 0, 0, 0];
    time_today = suntime(today.getDate(), today.getMonth() +1, today.getYear(), 90, 50, lngd, lngm, ewi, latd, latm, nsi, adj);

    //the time of the next day
    let time_tommorow = [0, 0, 0, 0];
    time_tommorow = suntime(tomorrow.getDate(), tomorrow.getMonth() +1, tomorrow.getYear(), 90, 50, lngd, lngm, ewi, latd, latm, nsi, adj);



    if (time_today[1] == 0) {
        let sunrise_yasterday = time_yasterday[2];
        let sunrise = time_today[2];
        let sunrise_tommorow = time_tommorow[2];
        let sunset_yasterday = time_yasterday[3];
        let sunset = time_today[3];
        let sunset_tommorow = time_tommorow[3];
		
		hour[0] = sunrise_yasterday;
		hour[1] = sunrise;
		hour[2] = sunrise_tommorow;
		hour[3] = sunset_yasterday;
		hour[4] = sunset;
		hour[5] = sunset_tommorow;

        shaa_zmanit = (sunset - sunrise) / 12;

        //using current time in the computer to adjust the right secdule...
        //get the time right now
        let date = new Date();

        let h = date.getHours();
        let minute = date.getMinutes();
        let s = date.getSeconds();
		let m = date.getMilliseconds();
        let curr_hour = m + (s*1000) + (minute*60*1000) + (h*60*60*1000); 

        let str = timeadj1(sunset);
        let sunsetArray = str.split(":");
        sunsetH_man = sunsetArray[0];
        sunsetM_man = sunsetArray[1];
        sunsetS_man = sunsetArray[2];
		sunsetMili_man = sunsetArray[3];
        let sunset_hour =  parseInt(sunsetMili) + parseInt((sunsetS*1000)) + parseInt((sunsetM*60*1000)) + parseInt((sunsetH*60*60*1000));
		//-----------------------------------------------------------------

        let state_of_day = 0; // 0 == curr_hour < sunset_hour 
        //legnth of the shaa zmanit - night
	    if(curr_hour > sunset_hour)
			state_of_day = 1;
		
		if(curr_hour > sunset_hour)
			shaa_zmanit_night = (sunrise_tommorow + (24 - sunset)) / 12;
        else
            shaa_zmanit_night = (sunrise + (24 - sunset_yasterdate)) / 12;


        //legnth of the shaa zmanit - day
        if(curr_hour > sunset_hour)
			shaa_zmanit_day = (sunset_tommorow - sunrise_tommorow) / 12;
        else
			shaa_zmanit_day = (sunset - sunrise) / 12;


        //insert an array of shaot_zmaniot
        let s1, s2,s3,s4;
        if (curr_hour > sunset_hour) {
            s1 = sunset;
            s2 = sunrise_tommorow;
			s3 = sunset_tommorow;
        }
        else {
            s1 = sunset_yasterdate;
            s2 = sunrise;
			s3 = sunset
        }
 
    }



    return hour;

}