import { Alias } from "@prisma/client";
import { SessionUser } from "./auth";

/** URL leafs for each page of the app */
export const pages = {
	root: "/",
	history: "/history",
	create: "/create",
	signup: "/account",

	user: (id: string) => `/user/${id}`,
	post: (id: string) => `/post/${id}`,

	api: {
		signin: "/api/auth/signin",
		signout: "/api/auth/signout",
	}
}

/** Create a date object corresponding to midnight of the current day */
export function midnight(): Date
{
	const date = new Date();
	date.setUTCHours(0, 0, 0, 0);

	return date;
}

/** Create a date object corresponding to the next reset period for aliases */
export function getNextReset(): Date
{
	const date = midnight();
	date.setUTCDate(date.getUTCDate() + 1);

	return date;
}

/** Get a date object corresponding to the last reset period for aliases */
export function getLastReset(): Date
{
	return midnight();
}

/** Determine if a user owns a given alias */
export function isOwner(user: SessionUser, alias: Alias | null | undefined): boolean
{
	if (!alias)
		return false;

	return user.id === alias.creatorID;
}