'use server';

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { AuthSession, options } from "./auth";
import { getLastReset, getNextReset } from "./utils";

/** Get the current alias for the user */
export async function getAlias()
{
	const session = await getServerSession(options) as AuthSession;
	const id = session?.user?.id;
	if (id) {
		// Check for an existing alias
		const user_alias = await prisma.userAlias.findUnique({
			where: {
				userID: id,
			},
			include: {
				alias: true,
			}
		});

		if (user_alias) {
			// return the current alias if it isn't expired
			const now = new Date();
			if (now <= user_alias.expires) {
				return user_alias.alias;
			}
		}
	}

	return null;
}

/** Select a new alias for the user, if needed */
export async function resetAlias(debug_force = false)
{
	const session = await getServerSession(options) as AuthSession;
	const id = session?.user?.id;
	if (id) {
		// Find the user's UserAlias
		const user_alias = await prisma.userAlias.findUnique({
			where: {
				userID: id,
			},
			include: {
				alias: true,
			},
		});

		if (user_alias) {
			// Check for an expired alias
			const now = new Date();
			if (now > user_alias.expires || user_alias.alias === null || debug_force) {
				// Get all aliases made before the current reset period that don't have an active user alias
				const reset_time = getLastReset();
				const aliases = await prisma.alias.findMany({
					where: {
						id: {
							not: user_alias.aliasID ? user_alias.aliasID : undefined
						},
						created: {
							lt: reset_time,
						},
						users: {
							none: {
								expires: {
									gte: reset_time,
								},
							},
						},
					}
				});

				console.log(`Found aliases: ${aliases.map((value) => value.tag)}`);

				if (aliases.length > 0) {
					// Generate a randomized hash for the user by encoding their user id salted with
					// the alias reset time into a byte array then hashing the array with SHA-256
					const encoder = new TextEncoder();
					const hash = new Uint32Array(await crypto.subtle.digest("SHA-256", encoder.encode(id + String(reset_time))));

					// Update the UserAlias with the newly selected alias
					const new_alias = aliases[hash[0] % aliases.length];
					console.log(`Generated hashes ${hash}: selection will be ${hash[0] % aliases.length}, alias ${new_alias.tag}`);
					await prisma.userAlias.update({
						where: {
							userID: id,
						},
						data: {
							aliasID: new_alias.id,
							expires: getNextReset()
						}
					});

					return new_alias;
				} else {
					// Give the user a null alias because none are available
					await prisma.userAlias.update({
						where: {
							userID: id,
						},
						data: {
							aliasID: null,
							expires: new Date()
						}
					});

					console.error(`User ${session.user.id} failed to claim an Alias: No Aliases are available.`);
				}
			}
		} else {
			console.error(`User ${session.user.id} failed to claim an Alias: User has no UserAlias`);
		}
	}

	return null;
}

/** Create a new alias for the current user */
export async function createAlias(tag: string, name: string, bio: string | null, image: string | null): Promise<boolean>
{
	const session = await getServerSession(options) as AuthSession;
	if (!session)
		return false;

	// Make sure the user doesn't alread have a UserAlias
	const user = await prisma.userAlias.findUnique({
		where: {
			userID: session.user.id
		}
	});

	if (user)
		return false;

	// Make sure the provided tag isn't taken
	const alias_query = await prisma.alias.findMany({
		where: {
			tag: tag
		}
	});

	if (alias_query.length > 0)
		return false;

	// Generate a new alias and a useralias for the user
	const new_alias = await prisma.alias.create({
		data: {
			tag: tag,
			name: name,
			bio: bio,
			image: image,
		}
	});

	const new_user = await prisma.userAlias.create({
		data: {
			userID: session.user.id,
			aliasID: new_alias.id,
			expires: getNextReset(),
		}
	});

	console.log(`New alias created for user ${session.user.email}`);
	return true;
}

/** Get posts made by the current active user */
export async function getPostHistory()
{
	// Get the user's current alias
	const alias = await getAlias();
	console.log(`Current alias: ${alias?.name}`);

	if (alias?.id) {
		const content = await prisma.post.findMany({
			where: {
				authorId: alias?.id,
				published: true,
			},
			orderBy: {
				created: "desc",
			},
			include: {
				author: {
					select: { name: true },
				},
			},
		});

		return {
			props: { content },
			revalidate: 10
		};
	}

	return {
		props: { content: [] },
		revalidate: 10
	};
};

/** Get posts made by a set of users */
export async function getPosts(users: string[])
{
	// Generate a set of search queries from the user list
	const filters = users.map((value) => {
		return {
			published: true,
			authorId: value,
		}
	});

	// Find posts matching the provided users
	const content = await prisma.post.findMany({
		where: {
			OR: filters,
		},
		orderBy: {
			created: "desc",
		},
		include: {
			author: {
				select: { name: true },
			},
		},
	});

	return {
		props: { content },
		revalidate: 10
	};
}

/** Get all posts */
export async function getAll()
{
	// Find posts matching the provided users
	const content = await prisma.post.findMany({
		where: {
			published: true,
		},
		orderBy: {
			created: "desc",
		},
		include: {
			author: {
				select: { name: true },
			},
		},
	});

	return {
		props: { content },
		revalidate: 10
	};
}

/** Get a single post */
export async function getPost(id: string)
{
	console.log(id);
	
	// Find posts matching the provided users
	const content = await prisma.post.findUnique({
		where: {
			id: String(id),
		},
		include: {
			author: {
				select: { name: true },
			},
		},
	});

	console.log(content);

	return {
		props: { content },
		revalidate: 10
	};
}