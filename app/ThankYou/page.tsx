'use client';

import React from 'react';

export default function ThankYou(): React.JSX.Element {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen p-8 animate-fade-in'>
			<div className='glass rounded-3xl p-12 shadow-soft backdrop-blur-md text-center max-w-md'>
				{/* Success icon */}
				<div className='mb-8 flex justify-center'>
					<div className='w-20 h-20 bg-gradient-success rounded-full flex items-center justify-center shadow-glow'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={2}
							stroke='white'
							className='w-10 h-10'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='m4.5 12.75 6 6 9-13.5'
							/>
						</svg>
					</div>
				</div>

				{/* Thank you message */}
				<h1 className='text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent font-poppins mb-4 max-[768px]:text-3xl'>
					Thank you!
				</h1>

				<p className='text-xl text-white/90 font-inter leading-relaxed'>
					Your payment has been processed successfully.
				</p>

				{/* Decorative elements */}
				<div className='mt-8 flex justify-center space-x-2'>
					<div className='w-2 h-2 bg-primary-400 rounded-full animate-bounce-gentle'></div>
					<div
						className='w-2 h-2 bg-accent-400 rounded-full animate-bounce-gentle'
						style={{ animationDelay: '0.2s' }}
					></div>
					<div
						className='w-2 h-2 bg-primary-400 rounded-full animate-bounce-gentle'
						style={{ animationDelay: '0.4s' }}
					></div>
				</div>
			</div>
		</div>
	);
}
