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

	useEffect(() => {
		// Set editing to true if the page is accessed directly and editing is false
		// Only do this on initial load, not every time editing changes
		if (editing === false && setEditing) {
			setEditing(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Remove editing and setEditing from dependencies

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
		<div className='mx-auto flex min-h-screen w-full max-w-full flex-col rounded-lg bg-white p-8 text-left shadow-lg max-[1023px]:mx-0 max-[768px]:px-4 lg:my-10 lg:max-w-md'>
			<section id='step1' className={`${editing ? 'mb-6' : 'mb-3'}`}>
				<header className={`flex items-center ${editing ? 'mb-6' : 'mb-0'}`}>
					<p
						className={`mr-2 inline-block rounded-full px-2 ${
							editing
								? 'bg-blue-600 text-white'
								: 'bg-custom-light-gray text-gray-500'
						}`}
					>
						1
					</p>
					<p className='grow text-xl font-bold text-custom-dark'>
						Payment information
					</p>
					{!editing && (
						<p
							className='ml-4 text-lg font-bold text-blue-600 cursor-pointer'
							onClick={() => setEditing?.(true)}
						>
							Edit
						</p>
					)}
				</header>
				{editing && <PaymentForm classes={paymentFormClass} />}
			</section>
			<section id='step2' className='mt-3 border-t pt-5'>
				<header className='flex items-center'>
					<p
						className={`mr-2 inline-block rounded-full px-2 ${
							editing
								? 'bg-custom-light-gray text-gray-500'
								: 'bg-blue-600 text-white'
						}`}
					>
						2
					</p>
					<span
						className={`${
							editing ? 'text-gray-500' : 'text-xl font-bold text-custom-dark'
						}`}
					>
						Review and pay
					</span>
				</header>
				{!editing && (
					<div className={reviewFragmentClass}>
						<p className='my-6 text-xl text-custom-dark'>
							You&apos;re about to make a payment of{' '}
							<span className='font-bold'>${amount}</span>
						</p>
						<h3 className='text-lg font-bold text-custom-gray'>
							Payment method
						</h3>
						<div className='my-4 flex items-center justify-start gap-2'>
							<Icons type='card' cardType={getCardType?.(cardNumber ?? '')} />
							<span className='card-details text-custom-dark'>
								Card ending in ••••{cardNumber?.slice(-4)}
							</span>
						</div>
						<button
							className='m-auto mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-white'
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
