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
		<div className='flex flex-col min-h-screen items-center justify-center bg-transparent'>
			{/* Background decorative elements */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-full blur-3xl animate-pulse-slow'></div>
				<div
					className='absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-400/20 to-primary-400/20 rounded-full blur-3xl animate-pulse-slow'
					style={{ animationDelay: '1s' }}
				></div>
			</div>

			<main className='flex flex-1 flex-col items-center justify-center text-center relative z-10 w-full'>
				<div className='glass rounded-2xl p-8 shadow-soft backdrop-blur-md max-w-md w-full mx-auto animate-fade-in flex flex-col gap-6'>
					<h1 className='text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent font-poppins max-[768px]:text-2xl mb-2'>
						Hi, Taylor
					</h1>
					<p className='text-base font-inter font-normal leading-relaxed text-white/90 max-w-xl mx-auto mb-2'>
						You have{' '}
						<span className='font-semibold text-primary-200'>6 bills</span>{' '}
						ready for payment. You can pay your bills here or verify your
						identity to view full bill details.
					</p>
					<div className='flex justify-between items-center mb-4'>
						<div className='text-lg font-semibold text-white/90 font-inter'>
							Total due
						</div>
						<div className='text-3xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent font-poppins'>
							${amount}
						</div>
					</div>
					<button
						className='w-full px-6 py-3 text-white font-semibold bg-gradient-button hover:bg-gradient-button-hover rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105 font-inter text-lg'
						onClick={handleContinue}
					>
						Pay total
					</button>
				</div>
			</main>
		</div>
	);
}
