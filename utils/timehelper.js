 export const stampToDate = (stamp) => {
	if (!stamp) return new Date(1970, 0, 1);
	let date;
	if (stamp.toDate && typeof stamp.toDate == 'function') date = stamp.toDate();
	else {
		date = new Date(1970, 0, 1);
		if (stamp.seconds) date.setSeconds(stamp.seconds);
		else if (stamp._seconds) date.setSeconds(stamp._seconds);
	}
	return date;
};


