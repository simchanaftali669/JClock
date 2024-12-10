function hebrewDayOffset()
{
	//doit_man();
	hebrewclock_man();
	setmazal_man();

	
	//console.log(lbHour);
	//console.log(lbHour_man);
		
	
	
	//Man is leading
	if((hebrewday > hebrewday_man) || (hebrewday == 1 && hebrewday_man == 7))
		return -1;
	
	if((hebrewday == hebrewday_man) &&
	   ((lbHour > lbHour_man) || (lbHour == lbHour_man && lbMinute > lbMinute_man)))
		return -1;
	
	return 0;
}