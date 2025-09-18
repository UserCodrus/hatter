import type { Metadata } from "next";
import { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Silk from "@/components/silk";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Hatter",
	description: "The world's most useless social media website.",
};

export default function RootLayout(props: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}>
				<div className="flex flex-col items-center justify-items-center">
					{props.children}
				</div>
				<div className="fixed top-0 left-0 w-[100vw] h-[100vh] -z-10">
					<Silk
						speed={2}
						scale={0.5}
						color="#333527"
						noiseIntensity={1.5}
						rotation={0}
					/>
				</div>
			</body>
		</html>
	);
}
