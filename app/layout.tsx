import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import NextTopLoader from 'nextjs-toploader';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';

import './globals.css';

import { DesignerContextProvider } from '@/components/context/DesignerContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider afterSignOutUrl={'/sign-in'}>
			<html lang='en'>
				<body className={inter.className}>
					<NextTopLoader />

					<DesignerContextProvider>
						<ThemeProvider
							attribute='class'
							defaultTheme='system'
							enableSystem
							disableTransitionOnChange
						>
							{children}
							<Toaster />
						</ThemeProvider>
					</DesignerContextProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
