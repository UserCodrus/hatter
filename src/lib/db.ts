'use server';

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { AuthSession, options, SessionUser } from "./auth";
import { getLastReset, getNextReset, isOwner } from "./utils";
import { Alias } from "@prisma/client";

type UserData = {
	user: SessionUser | null,
	alias: Alias | null,
	owned: boolean,
	expired: boolean,
}

/** Get the current user data and alias */
export async function getUser(): Promise<UserData>
{
	const session = await getServerSession(options) as AuthSession;
	if (session) {
		// Retrieve the user's alias if it exists
		const user_alias = await prisma.userAlias.findUnique({
			where: {
				userID: session.user.id,
			},
			include: {
				alias: true,
			}
		});
		
		const now = new Date();
		return {
			user: session.user,
			alias: user_alias ? user_alias.alias : null,
			owned: isOwner(session.user, user_alias?.alias),
			expired: user_alias ? (user_alias.expires <= now) : true
		}
	}

	return {
		user: null,
		alias: null,
		owned: false,
		expired: true,
	};
}

/** Get information about an alias */
export async function getAliasData(id: string)
{
	return await prisma.alias.findUnique({
		where: {
			tag: id,
		},
		include: {
			followers: true,
			following: true,
		},
	});
}

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
export async function createAlias(tag: string, name: string, bio: string | null, image: string | null): Promise<string | null>
{
	const session = await getServerSession(options) as AuthSession;
	if (!session)
		return "You are not currently signed in to an account.";

	// Make sure the user doesn't alread have a UserAlias
	const user = await prisma.userAlias.findUnique({
		where: {
			userID: session.user.id
		}
	});

	if (user)
		return "Your account is already registered.";

	// Make sure the provided tag isn't taken
	const alias_query = await prisma.alias.findMany({
		where: {
			tag: tag
		}
	});

	if (alias_query.length > 0)
		return "The provided ID is already in use.";

	// Generate a new alias and a useralias for the user
	const new_alias = await prisma.alias.create({
		data: {
			tag: tag,
			name: name,
			bio: bio,
			image: image,
			creatorID: session.user.id,
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
	return null;
}

/** Change an alias for the current user */
export async function updateAlias(name: string, bio: string | null, image: string | null): Promise<string | null>
{
	const session = await getUser();
	if (!session.user)
		return "You are not currently signed in to an account.";

	if (!session.alias)
		return "You do not have an alias.";

	// Make sure the provided alias belongs to the user
	const alias_query = await prisma.alias.findUnique({
		where: {
			tag: session.alias.tag,
		}
	});

	if (!alias_query)
		return "You do not have an editable alias.";

	if (!isOwner(session.user, alias_query))
		return "Your current alias cannot be edited."

	// Generate a new alias and a useralias for the user
	const update = await prisma.alias.update({
		where: {
			tag: session.alias.tag,
			creatorID: session.user.id,
		},
		data: {
			name: name ? name :  session.alias.name,
			bio: bio ? bio : session.alias.bio,
			image: image ? image : session.alias.image,
		}
	});

	console.log(`Updated alias ${update.tag}`);
	return null;
}

/** Get posts made by a user */
export async function getPostHistory(id: string)
{
	const content = await prisma.post.findMany({
		where: {
			authorId: id,
			published: true,
		},
		orderBy: {
			created: "desc",
		},
		include: {
			author: {
				select: { name: true, tag: true },
			},
			likes: {
				select: {
					user: { select: { tag: true } },
				},
			},
		},
	});

	return {
		props: { content },
		revalidate: 10
	};
};

/** Get all the followers of a user */
export async function getFollowers(id: string)
{
	const followers = await prisma.alias.findMany({
		where: {
			following: {
				some: {
					id: id
				}
			}
		}
	});

	return followers;
}

/** Get all the users a given user is following */
export async function getFollowing(id: string | null | undefined)
{
	if (!id)
		return null;

	const following = await prisma.alias.findMany({
		where: {
			followers: {
				some: {
					id: id,
				},
			},
		},
	});

	return following;
}

/** Make the current user follow a given user */
export async function toggleFollow(id: string)
{
	const user_data = await getUser();
	if (user_data.alias) {
		// Check to see if the user is already following the given alias
		const following = await prisma.alias.findUnique({
			where: {
				id: id,
				followers: {
					some: {
						id: user_data.alias.id
					},
				},
			},
		});
		
		// Add or remove a following connection depending on the results of the follower query
		const connection = following === null ? { connect: { id: id } } : { disconnect: { id: id } };
		await prisma.alias.update({
			where: {
				id: user_data.alias.id,
			},
			data: {
				following: connection,
			},
		});
	}
}

/** Make the current user like a given post */
export async function toggleLike(id: string)
{
	const user_data = await getUser();
	if (user_data.alias) {
		// Make sure the post exists and wasn't created by the user
		const post = await prisma.post.findUnique({
			where: {
				id: id,
			},
		});

		if (post === null) {
			console.error(`Attempted to like an invalid post: ${id}`);
			return;
		}

		if (post.authorId === user_data.alias.id) {
			console.log(`User tried to like own post: ${id}`);
			return;
		}

		// Check to see if the user has already liked the post
		const liked = await prisma.like.findUnique({
			where: {
				postID_userID: {
					userID: user_data.alias.id,
					postID: id,
				},
			},
		});
		
		// Add or remove a like entry
		if (liked === null) {
			await prisma.like.create({
				data: {
					userID: user_data.alias.id,
					postID: id,
				},
			});
		} else {
			await prisma.like.delete({
				where: {
					postID_userID: {
						userID: user_data.alias.id,
						postID: id,
					},
				},
			});
		};
	}
}

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
				select: { name: true, tag: true },
			},
		},
	});

	return {
		props: { content },
		revalidate: 10
	};
}

/** Get posts liked by a user */
export async function getLiked(user: string)
{
	const content = await prisma.like.findMany({
		where: {
			userID: user,
		},
		orderBy: {
			time: "desc",
		},
		select: {
			post: {
				include: {
					author: {
						select: { name: true, tag: true },
					},
					_count: {
						select: { likes: true },
					},
				},
			},
		},
	});

	return content;
}

/** Get all posts */
export async function getAll()
{
	const user = await getUser();

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
				select: { name: true, tag: true },
			},
			likes: {
				where: {
					userID: user.alias?.id,
				},
				select: {
					user: { select: { tag: true } },
				},
			},
			_count: {
				select: {
					likes: true
				}
			}
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
				select: { name: true, tag: true },
			},
			likes: {
				select: {
					user: { select: { tag: true } },
				},
			},
		},
	});

	return {
		props: { content },
		revalidate: 10
	};
}