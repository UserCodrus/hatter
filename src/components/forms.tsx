'use client';

import { createAlias, updateAlias } from "@/lib/db";
import { pages } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, ReactElement, useRef, useState } from "react";
import { DropDownMenu } from "./menus";
import { AvatarSelector, ColorSelector, MenuButton } from "./interactive";
import { HexColorPicker } from "react-colorful";

/** A form that allows the user to submit a post */
export function CreatePost(props: { replyID?: string }): ReactElement
{
	const [media, setMedia] = useState("");
	const [validMedia, setValidMedia] = useState(false);
	const [content, setContent] = useState("");

	const ref = useRef(null);
	const router = useRouter();
	const location = usePathname();

	async function submitForm(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			const media_link = validMedia ? media : undefined;

			// Submit the post data to the API
			const body = { content, media: media_link, reply: props.replyID };
			console.log(body);
			await fetch("/api/post", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body)
			});

			// Redirect to the history feed
			const target = pages.history;
			if (location === target) {
				console.log("yay?")
				window.location.reload();
			} else {
				router.push(target);
			}
		} catch (error) {
			if (error instanceof Error)
				console.error(error);
		}
	}

	function imageLoad() {
		if (!validMedia)
			setValidMedia(true);
	}

	function imageError() {
		if (validMedia)
			setValidMedia(false);
	}

	const hide_media = validMedia ? "" : " hidden";
	const disabled = !content && !validMedia;
	const disabled_style = disabled ? " disabled" : "";

	return (
		<form className="flex flex-col p-4 gap-2" onSubmit={submitForm}>
			<div className={"flex flex-row w-full justify-center" + hide_media}>
				<img
					className="max-w-2/3"
					src={media ? media : undefined}
					onLoad={() => imageLoad()}
					onError={() => imageError()}
					ref={ref}
				/>
			</div>
			<input
				className="input"
				placeholder={"Image URL (optional)"}
				value={media}
				onChange={(e) => setMedia(e.target.value)}
				type="text"
			/>
			<textarea
				className="input"
				placeholder={"Write your post here"}
				value={content}
				onChange={(e) => setContent(e.target.value)}
			/>
			<div className="flex items-center justify-center">
				<input className={"w-20 button" + disabled_style} disabled={disabled} type="submit" value="Post" />
			</div>
		</form>
	);
}

type AvatarSettings = {
	icon: string,
	colorA: string,
	colorB: string,
	style: string,
};

const num_avatars = 70;
const avatar_options = [
	"pixel",
	"bauhaus",
	"beam",
	"marble",
] as const;

const enum ColorSelection {
	left,
	right
}

/** A modal popup that gives the user a set of icons to choose from */
function SelectAvatar(props: { avatar: AvatarSettings, base: string, selectCallback: (settings: AvatarSettings) => void }): ReactElement
{
	const [selectedColor, setSelectedColor] = useState<ColorSelection>(ColorSelection.left);
	const [lastSelection, setLastSelection] = useState(props.avatar.icon);
	const [salt, setSalt] = useState<number | null>(null);

	// Pass the selected avatar back to the create alias form
	function submit(new_avatar: AvatarSettings) {
		props.selectCallback(new_avatar);
	}

	function selectIcon(new_icon: string) {
		submit({
			...props.avatar,
			icon: new_icon,
		});
	}

	function setColorA(new_color: string) {
		submit({
			...props.avatar,
			colorA: new_color,
		});
	}

	function setColorB(new_color: string) {
		submit({
			...props.avatar,
			colorB: new_color,
		});
	}

	function setSelected(new_color: string) {
		console.log("Selection changed")
		if (selectedColor === ColorSelection.left) {
			submit({
				...props.avatar,
				colorA: new_color,
			});
		} else {
			submit({
				...props.avatar,
				colorB: new_color,
			});
		}
	}

	function setStyle(new_style: string) {
		submit({
			...props.avatar,
			style: new_style,
		});
	}

	// Generate an avatar icon string using a given
	function generateAvatar(i: number) {
		if (i === 0)
			return lastSelection;

		if (salt === null)
			return props.base.concat(i.toString());
		else
			return props.base.concat((salt / i).toString());
	}

	function shuffleAvatars() {
		setLastSelection(props.avatar.icon);
		setSalt(Math.random() * 1000);
	}

	// Create buttons to select different avatar styles
	const components: ReactElement[] = [];
	let key = 0;
	for (let i = 0; i < num_avatars; ++i) {
		const icon = generateAvatar(i);
		components.push(<AvatarSelector
			icon={icon} selected={icon === props.avatar.icon}
			colors={[props.avatar.colorA, props.avatar.colorB]}
			onSelect={selectIcon}
			style={props.avatar.style as any} key={key} />);
		++key;
	}

	// Create components for the dropdown menu
	const dropdown_main = <div className="bg-input p-1 min-w-20 text-center panel-inner">{props.avatar.style}</div>
	const dropdown: ReactElement[] = [];
	key = 0;
	for (const option of avatar_options) {
		dropdown.push(<MenuButton label={option} onClick={() => setStyle(option)} key={key} />);
		++key;
	}

	return (
		<div className="flex flex-col justify-center items-center overflow-auto p-4 gap-4 panel fit-width">
			<div className="text-lg font-bold text-center">Avatar</div>
			<div className="flex flex-row justify-center w-full">
				<ColorSelector
					color={props.avatar.colorA}
					onChange={setColorA}
					onSelect={() => setSelectedColor(ColorSelection.left)}
					selected={selectedColor === ColorSelection.left}
				/>
				<ColorSelector
					color={props.avatar.colorB}
					onChange={setColorB}
					onSelect={() => setSelectedColor(ColorSelection.right)}
					selected={selectedColor === ColorSelection.right}
				/>
			</div>
			<HexColorPicker color={selectedColor === ColorSelection.left ? props.avatar.colorA : props.avatar.colorB} onChange={setSelected} />
			<div className="flex flex-row justify-center gap-2 flex-wrap max-h-[50vh] overflow-auto">
				{components}
			</div>
			<div className="flex flex-row justify-evenly items-center w-full">
				<div className="flex flex-row gap-2 items-center">
					<div>Style:</div>
					<DropDownMenu main={dropdown_main} fill above>
						<div className="flex flex-col gap-2 p-2 panel-inner text-center">
							{dropdown}
						</div>
					</DropDownMenu>
				</div>
				<button className="button" onClick={() => shuffleAvatars()}>Shuffle</button>
			</div>
		</div>
	);
}

/** A form that allows the user to create a new alias */
export function CreateAlias(props: { defaultAvatar: AvatarSettings }): ReactElement
{
	const [tag, setTag] = useState("");
	const [name, setName] = useState("");
	const [bio, setBio] = useState("");
	const [avatar, setAvatar] = useState<AvatarSettings>(props.defaultAvatar);
	const [error, setError] = useState("");
	const router = useRouter();

	// Call the server function to create the new alias
	async function submitForm(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		console.log("submit form");

		const error = await createAlias(tag.toLowerCase(), name, bio, avatar.icon, avatar.colorA, avatar.colorB, avatar.style);
		if (error === null)
			router.push("/history");
		else
			setError(error);
	}

	// Set the user's current avatar from the avatar selection modal
	function selectAvatar(avatar: AvatarSettings) {
		setAvatar(avatar);
	}

	return (
		<div className="flex flex-col flex-wrap items-center justify-center gap-2">
			<form className="flex flex-col p-4 gap-2 items-stretch panel fit-width" onSubmit={submitForm}>
				<div className="text-lg font-bold text-center">Account Info</div>
				<div className="flex flex-row items-center">
					<label className="flex-1">ID</label>
					<input
						className="w-2/3 lowercase input"
						placeholder={""}
						value={tag}
						onChange={(e) => setTag(e.target.value)}
						type="text" pattern="^([a-zA-Z]+)$"
					/>
				</div>
				<div className="flex flex-row items-center">
					<label className="flex-1">Name</label>
					<input
						className="w-2/3 input"
						placeholder={""}
						value={name}
						onChange={(e) => setName(e.target.value)}
						type="text"
					/>
				</div>
				<div className="text-center">Bio</div>
				<textarea
					className="input"
					placeholder={"Write your account's bio here"}
					value={bio}
					onChange={(e) => setBio(e.target.value)}
				/>
				<div className="flex items-center justify-center">
					<input className="button" disabled={!tag || !name} type="submit" value="Create" />
				</div>
				{error && <div className="text-center text-alert">{error}</div>}
			</form>
			<SelectAvatar avatar={avatar} base={props.defaultAvatar.icon} selectCallback={selectAvatar} />
		</div>
	);
}

/** A form that allows the user to update an owned alias */
export function UpdateAlias(props: {tag: string, name: string, bio: string | null}): ReactElement
{
	const [name, setName] = useState(props.name ? props.name : "");
	const [bio, setBio] = useState(props.bio ? props.bio : "");
	const [error, setError] = useState("");
	const router = useRouter();

	async function submitForm(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const error = await updateAlias(name, bio, null);
		if (error === null)
			router.push("/history");
		else
			setError(error);
	}

	return (
		<form className="flex flex-col p-4 gap-2 w-full items-stretch panel" onSubmit={submitForm}>
			<div className="flex flex-row items-center">
				<label className="flex-1">ID</label>
				<input
					className="w-2/3 lowercase"
					placeholder={""}
					value={props.tag}
					type="text"
					disabled={true}
				/>
			</div>
			<div className="flex flex-row items-center">
				<label className="flex-1">Name</label>
				<input
					className="w-2/3"
					placeholder={props.name}
					value={name}
					onChange={(e) => setName(e.target.value)}
					type="text"
				/>
			</div>
			<div className="text-center">Bio</div>
			<textarea
				placeholder={props.bio ? props.bio : "Write your account's bio here"}
				value={bio}
				onChange={(e) => setBio(e.target.value)}
			/>
			<div className="flex items-center justify-center m-2">
				<input className="w-20 button" disabled={!name} type="submit" value="Update" />
			</div>
			{error && <div className="text-center text-alert">{error}</div>}
		</form>
	);
}