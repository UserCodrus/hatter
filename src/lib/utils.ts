import { Alias } from "@prisma/client";
import { SessionUser } from "./auth";

/** URL leafs for each page of the app */
export const pages = {
	root: "/",
	history: "/history",
	create: "/create",
	account: "/account",

	icons: "/icons.svg",

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

/** Generate a random color string */
export function randomColor(): string
{
	const letters = "0123456789abcdef";
	let color = "#";

	for (let i = 0; i < 6; ++i) {
		color += letters[Math.floor(Math.random() * letters.length)];
	}

	return color;
}