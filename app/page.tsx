'use client';

import React from 'react';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import AppContext from './AppContext';

/**
 * Home component
 *
 * Renders different stages of the payment process based on the current stage.
 *
 * @returns {JSX.Element} The home component
 */
export default function Home(): React.JSX.Element {
	const router = useRouter();
	const context = useContext(AppContext);
	const { amount, setEditing } = context || {};

	/**
	 * Handles the continue button click event
	 *
	 * @param {React.MouseEvent<HTMLButtonElement>} e - Event object
	 * @returns {void}
	 */
	const handleContinue = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (setEditing) {
			setEditing(true);
			router.push('/PayAndReview');
		}
	};

	return (
		<div className='flex flex-col min-h-screen h-screen'>
			<main className='flex flex-col items-center justify-center text-center'>
				<section className='grow basis-2/5 px-10 py-10 md:px-32 md:py-32 max-[768px]:px-10 max-[768px]:py-10'>
					<h1 className='mb-4 text-4xl font-bold text-custom-blue font-georgia max-[768px]:text-xl'>
						Hi, Taylor
					</h1>
					<p className='mb-4 text-base font-arial font-normal leading-[24px] tracking-[0.2px] text-custom-dark max-w-xl'>
						You have 6 medical bills ready from ABC Health System. You can pay
						your bills here or verify your identity to view full bill details.
					</p>
				</section>
				<section className='relative flex flex-col w-full min-h-screen bottom-0 rounded-t-2xl bg-white shadow-md'>
					<div className='absolute inset-x-0 top-24 px-0 mx-auto max-w-xl max-[768px]:px-0'>
						<div className='mb-4 flex justify-around'>
							<div className='mr-2 text-2xl font-bold text-custom-gray'>
								Total due
							</div>
							<div className='text-3xl font-bold text-custom-blue font-georgia'>
								${amount}
							</div>
						</div>

						<button
							className='w-10/12 px-4 py-2 text-white bg-blue-600 rounded-lg md:w-8/12'
							onClick={handleContinue}
						>
							Pay total
						</button>
					</div>
				</section>
			</main>
		</div>
	);
}
