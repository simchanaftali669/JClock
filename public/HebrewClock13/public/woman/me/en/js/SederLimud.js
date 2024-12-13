const limudBooks = 
{
    MASECHET: "01",
    SEFER: "10",
    PARASHA: "11"
}

var limudBook = limudBooks.MASECHET;

function sederLimud()
{
	var url = document.location.href;
	
	//console.log(url);
	if(url.includes("jewish") || url.includes("cristian") || url.includes("islam"))
	{
		if(lbHour == 12)//jewish
		{
			if(!url.includes("jewish"))
				document.location.href = "../jewish/index.html";		
		}	
		if(lbHour == 13)//christian
		{
			if(!url.includes("cristian"))
				document.location.href = "../cristian/index.html";
		}
		if(lbHour == 14)//muslim
		{
			if(!url.includes("islam"))
				document.location.href = "../islam/index.html";		
		}		
	}	
	
    limudBook = limudBooks.MASECHET;
	var showMasechet = true;
    var showSefer = true;
    var showParasha = true;


	//var showMazal = true;
    //var showMasechet = true;
    //var showSefer = false;
    //var showParasha = false;

	////console.log(lbHour);
	
	
    if((lbHour%3 + 1) == 1)
    {
		if(!url.includes("jewish"))
			document.location.href = "../jewish/index.html";		

        limudBook = limudBooks.MASECHET;
		showMasechet = true;
		showSefer = false;
		showParasha = false;
    }
    if((lbHour%3 + 1) == 2)
    {
		if(!url.includes("cristian"))
			document.location.href = "../cristian/index.html";

        limudBook = limudBooks.SEFER;
		showMasechet = false;
		showSefer = true;
		showParasha = false;
    }
    if((lbHour%3 + 1) == 3)
    {
		if(!url.includes("islam"))
			document.location.href = "../islam/index.html";		

        limudBook = limudBooks.PARASHA;
		showMasechet = false;
		showSefer = false;
		showParasha = true;
    }
	//console.log('ss');
	if(!url.includes("jewish") && !url.includes("cristian") && !url.includes("islam"))
	{
		showMasechet = true;
		showSefer = true;
		showParasha = true;
	}


    document.querySelector('[id*="Masechet"]').style.display = true;//showMasechet ? "unset" : "none";
    document.querySelector('[id*="Sefer"]').style.display = true;//showSefer ? "unset" : "none";
    document.querySelector('[id*="Parasha"]').style.display = true;//showParasha ? "unset" : "none";

    document.querySelector('[id*="Mazal"]').style.fontWeight = /*(limudBook == limudBooks.MAZAL) ?*/ "bold" /*: "unset"*/;
    document.querySelector('[id*="Masechet"]').style.fontWeight = "unset";//(limudBook == limudBooks.MASECHET) ? "bold" : "unset";
    document.querySelector('[id*="Sefer"]').style.fontWeight = "unset";//(limudBook == limudBooks.SEFER) ? "bold" : "unset";
    document.querySelector('[id*="Parasha"]').style.fontWeight = "unset";//(limudBook == limudBooks.PARASHA) ? "bold" : "unset";
}

