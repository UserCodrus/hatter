import { FeedWrapper, PostFeed } from "@/components/feed";
import { Header } from "@/components/header";
import { ModeratorTools } from "@/components/interactive";
import { getPost, getUser } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> })
{
	const params = await props.params;
	const user_data = await getUser();
	const post = await getPost(params.id, user_data.alias?.id);

	if (!post || (!post.published && !user_data.mod && !user_data.admin))
		notFound();

	return (<>
		<Header user={user_data.user} alias={user_data.alias} admin={user_data.admin} expired={user_data.expired} banned={user_data.banned !== null} />
		<div className="flex flex-col gap-4 mt-4">
			{user_data.mod && <ModeratorTools postID={post.id} authorID={post.userId} published={post.published} banned={false} />}
			<FeedWrapper>
				<PostFeed
					currentUser={user_data.alias?.id}
					post={post}
					reply={post.reply}
					replyAuthor={(post.reply as any)?.author}
					author={post.author}
					likes={post._count.likes}
					liked={post.likes.length > 0}
					replies={post._count.replies}
					replied={post.replies.length > 0}
					viewerID={user_data.expired ? undefined : user_data.alias?.id}
				/>
			</FeedWrapper>
		</div>
	</>);
}