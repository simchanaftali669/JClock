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
	window.location.href= "../../en/kabala/index.html";
}


function englishScheduleFunction()
{
	window.location.href= "../../en/kabala/schedule.html";
}

function englishInternalSportFunction()
{
	window.location.href= "../../en/kabala/internal_sport.html";
}

function englishExternalSportFunction()
{
	window.location.href= "../../en/kabala/external_sport.html";
}