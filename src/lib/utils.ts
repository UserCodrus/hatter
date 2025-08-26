/** URL leafs for each page of the app */
export const pages = {
	root: "/",
	history: "/history",
	create: "/create",
	signup: "/signup",

	user: (id: string) => `/user/${id}`,
	post: (id: string) => `/post/${id}`,

	api: {
		signin: "/api/auth/signin",
		signout: "/api/auth/signout",
	}
}

/** Create a date object corresponding to midnight of the current day */
export function midnight()
{
	const date = new Date();
	date.setUTCHours(0, 0, 0, 0);

	return date;
}

/** Create a date object corresponding to the next reset period for aliases */
export function getNextReset()
{
	const date = midnight();
	date.setUTCDate(date.getUTCDate() + 1);

	return date;
}

/** Get a date object corresponding to the last reset period for aliases */
export function getLastReset()
{
	return midnight();
}