import type { Metadata } from 'next';
import { Pacifico, PT_Serif } from 'next/font/google';
import './globals.css';

const ptSerif = PT_Serif({
	weight: ['400', '700'],
	style: ['normal', 'italic'],
	subsets: ['latin'],
	display: 'swap',
});

const pacifico = Pacifico({
	weight: ['400'],
	style: ['normal'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-pacifico',
});

export const metadata: Metadata = {
	title: 'Pretty Boys',
	description: 'Oficjalna strona klubu piłkarskiego Pretty Boys',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='pl'>
			<body
				className={`${ptSerif.className} ${pacifico.variable} bg-zinc-800  `}>
				{children}
			</body>
		</html>
	);
}
