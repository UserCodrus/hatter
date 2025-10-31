'use client';

import { ReactElement, useEffect, useState } from "react";
import Silk from "./silk";

/** Create an animated background element */
export function AnimatedBackground(): ReactElement
{
	const [color, setColor] = useState<string>("");

	useEffect(() => {
		const styles = getComputedStyle(document.body);
		setColor(styles.getPropertyValue("--background"));
	}, []);
	
	if (color) {
		return (
			<div className="fixed top-0 left-0 w-screen h-screen -z-10">
				<Silk
					speed={2}
					scale={0.5}
					color={color}
					noiseIntensity={0.5}
					rotation={0}
				/>
			</div>
		);
	} else {
		return <></>;
	}
}