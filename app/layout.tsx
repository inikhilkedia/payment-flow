import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppProvider from './AppProvider';
import Layout from './components/Layout';

// Import the Inter font from Google Fonts with the Latin subset
const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
	preload: true,
});

/**
 * Metadata for the app
 */
export const metadata: Metadata = {
	title: 'ABC Health System - Payment Portal',
	description: 'Secure payment processing for ABC Health System',
	robots: 'noindex, nofollow',
	icons: {
		icon: '/favicon.ico',
	},
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
};

/**
 * RootLayout component
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered
 *
 * @returns {JSX.Element} The root layout component
 */
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}): React.JSX.Element {
	return (
		<html lang='en'>
			<head>
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link
					rel='preconnect'
					href='https://fonts.gstatic.com'
					crossOrigin='anonymous'
				/>
			</head>
			<body className={inter.className}>
				<AppProvider>
					<Layout>{children}</Layout>
				</AppProvider>
			</body>
		</html>
	);
}
