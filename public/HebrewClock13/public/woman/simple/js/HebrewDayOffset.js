function hebrewDayOffset()
{
	hebrewclock_man();
	setmazal_man();
	return -1;
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
