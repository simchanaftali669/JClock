//Commercial_manually
//need to set each commercial publish keys based on it goal
//s is "shevetLocation", d is "day of week" between 1-7, h is "hour" between 00 and 23, p meaning is "priority" counter set from min 0001 to max 1080 
var cInRegionAtTime = new Map();
const commercials = {
    Soteria: 's_xx#d_xx__h_xx__p_0001+',
    Breslev: 's_12#d_xx__h_xx__p_0001+s_09#d_xx__h_xx__p_0001+s_10#d_xx__h_xx__p_0001+s_02#d_xx__h_xx__p_0001+',
	LechemMoshe: 's_xx#d_xx__h_03__p_0360+s_xx#d_xx__h_04__p_0360+s_xx#d_xx__h_05__p_0360+s_xx#d_xx__h_15__p_0360+s_xx#d_xx__h_16__p_0360+s_xx#d_xx__h_17__p_0360+',    
	ShifonPlus: 's_xx#d_xx__h_03__p_0360+s_xx#d_xx__h_04__p_0360+s_xx#d_xx__h_05__p_0360+s_xx#d_xx__h_15__p_0360+s_xx#d_xx__h_16__p_0360+s_xx#d_xx__h_17__p_0360+',
    IDF: 's_12#d_04__h_18__p_0360+s_12#d_04__h_19__p_0360+',
    Opticana: 's_xx#d_0x__h_22__p_0720+s_xx#d_0x__h_23__p_0720+',
	NewDeli: 's_xx#d_xx__h_03__p_0360+s_xx#d_xx__h_04__p_0360+s_xx#d_xx__h_05__p_0360+s_xx#d_xx__h_15__p_0360+s_xx#d_xx__h_16__p_0360+s_xx#d_xx__h_17__p_0360+',
	Velvel: 's_xx#d_02__h_01__p_0360+',
    Mispara: 's_12#d_04__h_22__p_0540+',
    JacobsCoffee: 's_xx#d_xx__h_00__p_0360+s_xx#d_xx__h_01__p_0360+s_xx#d_xx__h_02__p_0360+s_xx#d_xx__h_07__p_0360+s_xx#d_xx__h_13__p_0360+s_xx#d_xx__h_14__p_0360+',
    NesCafe: 's_xx#d_xx__h_00__p_0360+s_xx#d_xx__h_01__p_0360+s_xx#d_xx__h_02__p_0360+s_xx#d_xx__h_07__p_0360+s_xx#d_xx__h_13__p_0360+s_xx#d_xx__h_14__p_0360+',
    CoffeeBilig: 's_xx#d_xx__h_00__p_0360+s_xx#d_xx__h_01__p_0360+s_xx#d_xx__h_02__p_0360+s_xx#d_xx__h_07__p_0360+s_xx#d_xx__h_13__p_0360+s_xx#d_xx__h_14__p_0360+'
}

//d_xx ==> xx means 01-06
//d_0x ==> 0x means 01-05

initCommercials();

function initMap()
{
    for(var regionIdx = 1; regionIdx<=12; regionIdx++)
    {
        for(var dayIdx=1; dayIdx<=7; dayIdx++)
        {
            for(var timeIdx = 0; timeIdx<=23; timeIdx++)
            {
                regionIdxValue = (regionIdx <= 9) ? "0" + regionIdx : String(regionIdx);
                dayIdxValue = "0" + dayIdx;
                timeIdxValue = (timeIdx <= 9) ? "0" + timeIdx : String(timeIdx);
                
                //string of 6 characters ==> {rrddtt};
                var regionAtDayTime = regionIdxValue + dayIdxValue + timeIdxValue;
                var cList =[]
                
                cInRegionAtTime.set(regionAtDayTime,cList);
            }
        }
    }

}


function initCommercials()
{
    initMap();
 
    for (let commercial in commercials) 
    {
        //commercial <= name of the commercial in const object.
        //cSlots <= array of all commercial schedule time inside specific region.

        //console.log(commercial + " " + String(commercials[commercial]));
        var commercial_request = String(commercials[commercial]);
        var cSlots = commercial_request.split("+");
        //console.log(cSlots)
        for(let cSlot of cSlots)
        {
            var regionValue = cSlot.slice(2,4);
            var dayValue = cSlot.slice(7,9);
            var timeValue = cSlot.slice(13,15);
            var priority = cSlot.slice(19,23);   

            //console.log("source - regionValue: " + regionValue)
            //console.log("source - dayValue: " + regionValue)
            //console.log("source - timeValue: " + regionValue)

            //cases of all regions/days/time or all of part of them.
            if(regionValue == "xx" && dayValue.includes("x") && timeValue == "xx")
            {
                for(var regionIdx = 1; regionIdx<=12; regionIdx++)
                {
                    for(var dayIdx=1; dayIdx<=6; dayIdx++)
                    {
                        if(dayIdx == 6 && dayValue == "0x" )//"0x means 01-05 only, not 06"
                            break;
                            
                        for(var timeIdx = 0; timeIdx<=23; timeIdx++)
                        {
                            regionIdxValue = (regionIdx <= 9) ? "0" + regionIdx : String(regionIdx);
                            dayIdxValue = "0" + dayIdx;
                            timeIdxValue = (timeIdx <= 9) ? "0" + timeIdx : String(timeIdx);
                            insertCommercialsIntoSlot(commercial,regionIdxValue,dayIdxValue,timeIdxValue,priority)
                        }
                    }
                }
            }
            else if(regionValue == "xx" && dayValue.includes("x") && timeValue != "xx")
            {
                for(var regionIdx = 1; regionIdx<=12; regionIdx++)
                {
                    for(var dayIdx=1; dayIdx<=6; dayIdx++)
                    {
                        if(dayIdx == 6 && dayValue == "0x" )//"0x means 01-05 only, not 06"
                            break;
                            
                        regionIdxValue = (regionIdx <= 9) ? "0" + regionIdx : String(regionIdx);
                        dayIdxValue = "0" + dayIdx;
                        insertCommercialsIntoSlot(commercial,regionIdxValue,dayIdxValue,timeValue,priority)
                    }
                }
            }
            else if(regionValue == "xx" && !dayValue.includes("x") && timeValue == "xx")
            {
                for(var regionIdx = 1; regionIdx<=12; regionIdx++)
                {
                    for(var timeIdx = 0; timeIdx<=23; timeIdx++)
                    {
                        regionIdxValue = (regionIdx <= 9) ? "0" + regionIdx : String(regionIdx);
                        timeIdxValue = (timeIdx <= 9) ? "0" + timeIdx : String(timeIdx);
                        insertCommercialsIntoSlot(commercial,regionIdxValue,dayValue,timeIdxValue,priority);
                    }
                }
            }
            else if(regionValue == "xx" && !dayValue.includes("x") && timeValue != "xx")
            {
                for(var regionIdx = 1; regionIdx<=12; regionIdx++)
                {
                    regionIdxValue = (regionIdx <= 9) ? "0" + regionIdx : String(regionIdx);
                    insertCommercialsIntoSlot(commercial,regionIdxValue,dayValue,timeValue,priority);
                }
            }
            else if(regionValue != "xx" && dayValue.includes("x") && timeValue == "xx")
            {
                for(var dayIdx=1; dayIdx<=6; dayIdx++)
                {
                    if(dayIdx == 6 && dayValue == "0x" )//"0x means 01-05 only, not 06"
                        break;

                    for(var timeIdx = 0; timeIdx<=23; timeIdx++)
                    {
                        dayIdxValue = "0" + dayIdx;
                        var timeIdxValue = (timeIdx <= 9) ? "0" + timeIdx : String(timeIdx);
                        //console.log("source - regionValue: " + regionValue)
                        insertCommercialsIntoSlot(commercial,regionValue,dayIdxValue,timeIdxValue,priority)
                    }
                }
            }            
            else if(regionValue != "xx" && dayValue.includes("x") && timeValue != "xx")
            {
                for(var dayIdx=1; dayIdx<=6; dayIdx++)
                {
                    if(dayIdx == 6 && dayValue == "0x" )//"0x means 01-05 only, not 06"
                        break;

                    dayIdxValue = "0" + dayIdx;
                    insertCommercialsIntoSlot(commercial,regionValue,dayIdxValue,timeValue,priority)
                }
            }            
            else if(regionValue != "xx" && dayValue != "xx" && timeValue == "xx")
            {
                for(var timeIdx = 0; timeIdx<=23; timeIdx++)
                {
                    var timeIdxValue = (timeIdx <= 9) ? "0" + timeIdx : String(timeIdx);
                    insertCommercialsIntoSlot(commercial,regionValue,dayValue,timeIdxValue,priority)
                }
            }
            else if(regionValue != "xx" && dayValue.includes("x") && timeValue != "xx")
            {
                for(var dayIdx=1; dayIdx<=6; dayIdx++)
                {
                    if(dayIdx == 6 && dayValue == "0x" )//"0x means 01-05 only, not 06"
                        break;
                    
                    dayIdxValue = "0" + dayIdx;
                    insertCommercialsIntoSlot(commercial,regionValue,dayIdxValue,timeValue,priority);
                }
            }
            else if(regionValue != "xx" && dayValue != "xx" && timeValue != "xx")
            {
                insertCommercialsIntoSlot(commercial,regionValue,dayValue,timeValue,priority)
            }
        }
    }
}

function insertCommercialsIntoSlot(commercial,regionValue,dayValue,timeValue,priority)
{
    //console.log("regionValue: " + regionValue)

    //string of 6 characters ==> {rrddtt};
    var regionAtDayTime = regionValue + dayValue + timeValue;

    //console.log("push: " + regionAtDayTime)
    for(var i= Number(priority); i>0 ; i--)
        cInRegionAtTime.get(regionAtDayTime).push(commercial);
}

var commercial = commercials.Breslev;

//

var selectedCommercialDay;
var selectedCommercialHour;
var selectedCommercialDrinkOnly;
var currentCommercialCandidates = [];

function getSelectedCommercialTime()
{
    var url = new URL(document.location.href);
    var urlDay = url.searchParams.get("hebrewDay") || url.searchParams.get("day");
    var urlHour = url.searchParams.get("hebrewHour") || url.searchParams.get("hour");
    var selectedDay = Number(urlDay);
    var selectedHour = Number(urlHour);

    if (!Number.isFinite(selectedDay) || selectedDay < 1 || selectedDay > 7)
        selectedDay = Number(hebrewday);
    if (!Number.isFinite(selectedHour) || selectedHour < 0 || selectedHour > 24)
        selectedHour = Number(lbHour);

    return {
        day: selectedDay,
        hour: normalizeCommercialHour(selectedHour)
    };
}

function ensureCommercialCandidates(selectedTime)
{
    var drinkOnly = isCurrentSystemDrinkOnly();
    if (
        selectedCommercialDay === selectedTime.day &&
        selectedCommercialHour === selectedTime.hour &&
        selectedCommercialDrinkOnly === drinkOnly
    )
        return;

    selectedCommercialDay = selectedTime.day;
    selectedCommercialHour = selectedTime.hour;
    selectedCommercialDrinkOnly = drinkOnly;
    currentCommercialCandidates = buildCommercialCandidates(selectedCommercialDay, selectedCommercialHour, selectedCommercialDrinkOnly);
}

function buildCommercialCandidates(dayValue, hourValue, drinkOnly)
{
    var hourMazal = calculateCommercialMazal(dayValue, hourValue);
    var candidates = [];

    addCommercialCandidate(candidates, "Drink_07");

    if (drinkOnly)
    {
        addMazalDrinkCandidates(candidates, hourMazal);
        return candidates;
    }

    if (isEatHour(hourValue))
        addCommercialCandidate(candidates, "Eat_01");

    addMazalCommercialCandidates(candidates, hourMazal, hourValue);

    return candidates;
}

function addMazalCommercialCandidates(candidates, mazalNumber, hourValue)
{
    var suffix = twoDigits(mazalNumber);

    addCommercialCandidate(candidates, "Drink_" + suffix);

    if (isEatHour(hourValue))
        addCommercialCandidate(candidates, "Eat_" + suffix);

    if (isMeetHour(hourValue))
        addCommercialCandidate(candidates, "Meet_" + suffix);
}

function addMazalDrinkCandidates(candidates, hourMazal)
{
    addCommercialCandidate(candidates, "Drink_" + twoDigits(hourMazal));
}

function addCommercialCandidate(candidates, commercialName)
{
    if (isKnownCommercial(commercialName) && candidates.indexOf(commercialName) == -1)
        candidates.push(commercialName);
}

function isKnownCommercial(commercialName)
{
    return (
        commercialName == "Drink_01" ||
        commercialName == "Drink_03" ||
        commercialName == "Drink_04" ||
        commercialName == "Drink_05" ||
        commercialName == "Drink_06" ||
        commercialName == "Drink_07" ||
        commercialName == "Eat_01" ||
        commercialName == "Eat_02" ||
        commercialName == "Eat_03" ||
        commercialName == "Eat_04" ||
        commercialName == "Eat_05" ||
        commercialName == "Eat_06" ||
        commercialName == "Eat_07" ||
        commercialName == "Meet_02" ||
        commercialName == "Meet_04" ||
        commercialName == "Meet_05" ||
        commercialName == "Meet_07"
    );
}

function pickCommercialFromCandidates()
{
    if (!currentCommercialCandidates.length)
        return null;

    var randomNumber = Math.floor(Math.random() * currentCommercialCandidates.length);
    return currentCommercialCandidates[randomNumber];
}

function isCurrentSystemDrinkOnly()
{
    var currentSystemHour = Number(lbHour);
    return currentSystemHour >= 12 && currentSystemHour < 17;
}

function normalizeCommercialHour(hour)
{
    hour = Number(hour);
    if (hour == 0)
        return 24;
    return hour;
}

function isEatHour(hour)
{
    return (hour >= 1 && hour <= 10) || (hour >= 18 && hour <= 24);
}

function isMeetHour(hour)
{
    return (hour >= 1 && hour <= 10) || (hour >= 20 && hour <= 24);
}

function calculateCommercialMazal(hebrewDayValue, hebrewHourValue)
{
    var dayOffsets = {
        1: 6,
        2: 2,
        3: 5,
        4: 1,
        5: 4,
        6: 7,
        7: 3
    };
    var mazalHour = (dayOffsets[Number(hebrewDayValue)] + Number(hebrewHourValue) - 1) % 7;
    return mazalHour == 0 ? 7 : mazalHour;
}

function twoDigits(value)
{
    value = Number(value);
    return value <= 9 ? "0" + value : String(value);
}

//need to decide if i want an omer be different between 
function commercialFunction()
{
    //console.log("shevetLocation: " + shevetLocation + "; hebrewday: " + hebrewday + "; lbHour:" + lbHour)
    //need to know which omer and which shevetLocation
    //need to get the list of commercials in this {region,omer} slot.
    var commercialElement = document.getElementById("commercial");
    if (!commercialElement)
        return;

    var selectedTime = getSelectedCommercialTime();
    ensureCommercialCandidates(selectedTime);

    var selectedCommercial = pickCommercialFromCandidates();
    if (selectedCommercial)
    {
        commercialInitFunction(selectedCommercial);
        return;
    }

    regionValue = (Number(shevetLocation) <= 9) ? "0" + Number(shevetLocation) : shevetLocation;
    dayValue = "0" + selectedTime.day;
    timeValue = (selectedTime.hour <= 9) ? "0" + selectedTime.hour : String(selectedTime.hour);
 
    //string of 6 characters ==> {rrddtt};
    var regionAtDayTime = regionValue + dayValue + timeValue;

    cList = cInRegionAtTime.get(regionAtDayTime);
    if (!cList || !cList.length)
        return;
    //console.log(regionAtDayTime);
    //console.log(cList);

    var randomNumber = Math.floor(Math.random() * cList.length);    ; // 0 or 1
    var commercial = cList[randomNumber];

    //console.log(commercial);
    commercialInitFunction(commercial);
}

//Commercial_manually
//need to update each commercial for each language with 1. link address and 2. css id connected to the commercial logo 
function commercialInitFunction(commercial)
{
    var commercialDayElement = document.getElementById("commercial").querySelector(".day");

    if (commercial && (commercial.indexOf("Eat_") == 0 || commercial.indexOf("Drink_") == 0 || commercial.indexOf("Meet_") == 0))
    {
        commercialDayElement.setAttribute("id", commercial);
        return;
    }

    switch(commercial)
	{
		case "Soteria":
            commercialDayElement.setAttribute("id","Soteria");
            document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://soteria.org.il/soteria-israel/"));
            break;
        case "Breslev":
            commercialDayElement.setAttribute("id","Breslev");
            document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"http://www.emuniyim.com/english"));
            break;
        case "LechemMoshe":
                commercialDayElement.setAttribute("id","LechemMoshe");
                document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://lecemoshe.click-eat.co.il/"));
            break;  
        case "ShifonPlus":
            commercialDayElement.setAttribute("id","ShifonPlus");
            document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"http://shifonplus.com/"));
            break;
        case "IDF":
            commercialDayElement.setAttribute("id","IDF");
            document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.idf.il/en/"));
        break;
        case "Opticana":
            commercialDayElement.setAttribute("id","Opticana");
            document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.opticana.co.il/"));            
        break;   
        case "NewDeli":
            commercialDayElement.setAttribute("id","NewDeli");
            document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://newdeli.com/en/"));
        break; 
        case "Velvel":
            commercialDayElement.setAttribute("id","Velvel");
            document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.velvel.co.il/"));
        break; 
        case "Mispara":
            commercialDayElement.setAttribute("id","Mispara");
            document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.opticana.co.il/"));
        break; 
        case "JacobsCoffee":
            commercialDayElement.setAttribute("id","JacobsCoffee");
            document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.jacobscoffee.co.il/"));
        break; 
        case "CoffeeBilig":
            commercialDayElement.setAttribute("id","CoffeeBilig");
            document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://naftali126.wixsite.com/chaimtovim"));
        break; 
        case "NesCafe":
            commercialDayElement.setAttribute("id","NesCafe");
            document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break; 
	} 
}

function openCommercialInNewTab(hyperLink) {
    var win = window.open(hyperLink, '_blank');
    win.focus();
}
