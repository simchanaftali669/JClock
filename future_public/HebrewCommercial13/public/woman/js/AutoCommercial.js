var commercials = createEmptyCommercials();

//period <==> {dovid,month,year,yovel}
function ReCalcCommercial(period)
{
	commercials = createEmptyCommercials();

	var normalizedPeriod = String(period).toLowerCase();
	var mazal = getCurrentMazal(normalizedPeriod);
	var hebrewDay = Number(mazal[0]);
	var hebrewHour = Number(mazal[1]);
	var hourMazal = calculateMazal(hebrewDay, hebrewHour);
	var nextCommercials = buildCommercialsByMolad(hebrewDay, hourMazal);

	applyCommercials(nextCommercials);
	initCommercials();

	return commercials;
}

function buildCommercialsByMolad(hebrewDay, hourMazal)
{
	var nextCommercials = createEmptyCommercials();

	nextCommercials.Drink_07 = createCommercialSlots(getAllHours(), '0360');
	nextCommercials.Eat_01 = createCommercialSlots(getEatHours(), '0360');

	addMazalCommercials(nextCommercials, hebrewDay);
	addMazalCommercials(nextCommercials, hourMazal);

	return nextCommercials;
}

function createEmptyCommercials()
{
	return {
		Drink_01: '',
		Drink_03: '',
		Drink_04: '',
		Drink_05: '',
		Drink_06: '',
		Drink_07: '',
		Eat_01: '',
		Eat_02: '',
		Eat_03: '',
		Eat_04: '',
		Eat_05: '',
		Eat_06: '',
		Eat_07: '',
		Meet_02: '',
		Meet_04: '',
		Meet_05: '',
		Meet_07: ''
	};
}

function addMazalCommercials(nextCommercials, mazalNumber)
{
	var suffix = twoDigits(mazalNumber);
	var drinkKey = 'Drink_' + suffix;
	var eatKey = 'Eat_' + suffix;
	var meetKey = 'Meet_' + suffix;

	if(nextCommercials.hasOwnProperty(drinkKey) && nextCommercials[drinkKey] === '')
		nextCommercials[drinkKey] = createCommercialSlots(getDrinkHours(), '0720');

	if(nextCommercials.hasOwnProperty(eatKey) && nextCommercials[eatKey] === '')
		nextCommercials[eatKey] = createCommercialSlots(getEatHours(), '0720');

	if(nextCommercials.hasOwnProperty(meetKey) && nextCommercials[meetKey] === '')
		nextCommercials[meetKey] = createCommercialSlots(getMeetHours(), '0720');
}

function applyCommercials(nextCommercials)
{
	for(var commercialName in nextCommercials)
	{
		if(nextCommercials.hasOwnProperty(commercialName))
			commercials[commercialName] = nextCommercials[commercialName];
	}
}

function createCommercialSlots(hours, priority)
{
	var slots = '';

	for(var region = 1; region <= 12; region++)
	{
		for(var day = 1; day <= 6; day++)
		{
			for(var hourIdx = 0; hourIdx < hours.length; hourIdx++)
			{
				slots += 's_' + twoDigits(region) +
					'#d_' + twoDigits(day) +
					'__h_' + twoDigits(hours[hourIdx]) +
					'__p_' + priority + '+';
			}
		}
	}

	return slots;
}

function getAllHours()
{
	return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
}

function getEatHours()
{
	return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 18, 19, 20, 21, 22, 23];
}

function getDrinkHours()
{
	return [12, 13, 14, 15, 16, 17];
}

function getMeetHours()
{
	return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 19, 20, 21, 22, 23];
}

function twoDigits(value)
{
	value = Number(value);
	return value <= 9 ? '0' + value : String(value);
}

function calculateMazal(hebrewDay, hebrewHour)
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
	
	var mazalHour  = (dayOffsets[Number(hebrewDay)] + Number(hebrewHour) - 1) % 7;

	if(mazalHour == 0)
		mazalHour = 7;

	return mazalHour;
}
