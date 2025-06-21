'use client';

import React, { Suspense } from 'react';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import AppContext from '../AppContext';
import { getCardType } from '../utils/cardType';
import Icons from '../components/Icons';
import styles from './PayAndReview.module.css';

// Dynamically import PaymentForm for code splitting
const PaymentForm = dynamic(() => import('../components/PaymentForm'), {
	loading: () => (
		<div className='flex justify-center items-center p-8'>
			<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
		</div>
	),
	ssr: false,
});

/**
 * PayAndReview component
 *
 * Manages the payment and review process.
 *
 * @returns {JSX.Element} The PayAndReview component
 */
export default function PayAndReview(): React.JSX.Element {
	const context = useContext(AppContext);
	const { amount, cardNumber, editing, setEditing } = context || {};
	const router = useRouter();
	const [paymentFormClass, setPaymentFormClass] = useState(
		editing ? styles.expand : styles.collapse
	);
	const [reviewFragmentClass, setReviewFragmentClass] = useState(
		editing ? styles.collapse : styles.expand
	);

	// Handle direct navigation to this page
	useEffect(() => {
		// Only set editing to true if it's not already set and we have the setter
		if (editing === undefined && setEditing) {
			setEditing(true);
		}
	}, [editing, setEditing]);

	useEffect(() => {
		if (editing) {
			setPaymentFormClass(styles.expand);
			setReviewFragmentClass(styles.collapse);
		} else {
			setPaymentFormClass(styles.collapse);
			setReviewFragmentClass(styles.expand);
		}
	}, [editing]);

	const handlePayment = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (setEditing) {
			setEditing(false);
			router.push('/ThankYou');
		}
	};

	return (
		<div className='mx-auto flex min-h-screen w-full max-w-full flex-col rounded-2xl glass p-8 text-left shadow-soft backdrop-blur-md max-[1023px]:mx-0 max-[768px]:px-4 lg:my-10 lg:max-w-md animate-fade-in'>
			<section id='step1' className={`${editing ? 'mb-8' : 'mb-4'}`}>
				<header className={`flex items-center ${editing ? 'mb-8' : 'mb-0'}`}>
					<div
						className={`mr-4 inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-300 ${
							editing
								? 'bg-gradient-button text-white shadow-glow'
								: 'bg-white/20 text-white/70'
						}`}
					>
						1
					</div>
					<p className='grow text-xl font-bold text-white font-inter'>
						Payment information
					</p>
					{!editing && (
						<button
							className='ml-4 text-lg font-semibold text-primary-300 hover:text-primary-200 cursor-pointer transition-colors duration-200'
							onClick={() => setEditing?.(true)}
						>
							Edit
						</button>
					)}
				</header>
				{editing && <PaymentForm classes={paymentFormClass} />}
			</section>
			<section id='step2' className='mt-4 border-t border-white/20 pt-6'>
				<header className='flex items-center'>
					<div
						className={`mr-4 inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-300 ${
							editing
								? 'bg-white/20 text-white/70'
								: 'bg-gradient-button text-white shadow-glow'
						}`}
					>
						2
					</div>
					<span
						className={`font-inter ${
							editing ? 'text-white/70' : 'text-xl font-bold text-white'
						}`}
					>
						Review and pay
					</span>
				</header>
				{!editing && (
					<div className={reviewFragmentClass}>
						<div className='glass rounded-xl p-6 my-6 shadow-soft'>
							<p className='text-xl text-white/90 font-inter'>
								You&apos;re about to make a payment of{' '}
								<span className='font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent'>
									${amount}
								</span>
							</p>
						</div>
						<div className='glass rounded-xl p-6 shadow-soft'>
							<h3 className='text-lg font-bold text-white/80 font-inter mb-4'>
								Payment method
							</h3>
							<div className='flex items-center justify-start gap-3'>
								<Icons type='card' cardType={getCardType?.(cardNumber ?? '')} />
								<span className='card-details text-white/90 font-inter'>
									Card ending in ••••{cardNumber?.slice(-4)}
								</span>
							</div>
						</div>
						<button
							className='m-auto mt-8 w-full rounded-xl bg-gradient-button hover:bg-gradient-button-hover px-6 py-4 text-white font-semibold shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105 font-inter text-lg'
							onClick={handlePayment}
						>
							Pay ${amount}
						</button>
					</div>
				)}
			</section>
		</div>
	);
}
