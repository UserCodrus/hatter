import type { Metadata } from "next";
import { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Silk from "@/components/silk";
import { AnimatedBackground } from "@/components/background";

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
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased relative`} data-theme="light">
				<div className="flex flex-col items-center justify-items-center min-h-screen">
					{props.children}
				</div>
				<AnimatedBackground />
			</body>
		</html>
	);
}
