function hebrewDayOffset()
{
	hebrewclock_man();
	setmazal_man();
	return 0;
}

function hasFullBirthCalculationParams()
{
	return birthYear != null && birthYear !== "" &&
		birthMonth != null && birthMonth !== "" &&
		birthDay != null && birthDay !== "" &&
		birthHour != null && birthHour !== "" &&
		birthMin != null && birthMin !== "" &&
		birthGMT != null && birthGMT !== "";
}
