import React from 'react';

export default function Section({ children }: { children: React.ReactNode }) {
	return (
		<section className='px-3 py-6 md:px-8 md:py-10 lg:px-10 lg:py-16 xl:px-0'>
			{children}
		</section>
	);
}
