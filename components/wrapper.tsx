import React from 'react';

export default function Wrapper({
	children,
	lg,
}: {
	children: React.ReactNode;
	lg?: boolean;
}) {
	return (
		<div className={`${lg ? 'max-w-[1600px]' : 'max-w-7xl'} mx-auto`}>
			{children}
		</div>
	);
}
