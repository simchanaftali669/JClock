/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function englishFunction()
{
	var url_obj = new URL(document.location.href);
	var lon = url_obj.searchParams.get("longitude");        
	var lat = url_obj.searchParams.get("latitude");
	var year = url_obj.searchParams.get("year");
	var month = url_obj.searchParams.get("month");
	var day = url_obj.searchParams.get("day");
	

	var location = "";
	if(lon)
		location = "?longitude=" + lon + "&latitude=" + lat;

	var custom_date = "";
	if(lon && year)
		custom_date = "&year=" + year + "&month=" + month + "&day=" + day;
	else if(year)
		custom_date = "?year=" + year + "&month=" + month + "&day=" + day; 

	window.location.href= "../../he/kabala/index.html" + location + custom_date;
}


function englishScheduleFunction()
{
	window.location.href= "../../he/kabala/schedule.html";
}

function englishInternalSportFunction()
{
	window.location.href= "../../he/kabala/internal_sport.html";
}

function englishExternalSportFunction()
{
	window.location.href= "../../en/kabala/external_sport.html";
}