'use client';

import React from 'react';
import { ReactNode, useContext } from 'react';
import Image from 'next/image';
import AppContext, { AppContextType } from '../AppContext';
import { useRouter } from 'next/navigation';

interface LayoutProps {
	children: ReactNode;
}

/**
 * Layout component
 *
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to be rendered
 *
 * @returns {JSX.Element} The layout component
 */
const Layout = ({ children }: LayoutProps): React.JSX.Element => {
	const context = useContext(AppContext) as AppContextType;
	const {
		setError,
		setEditing,
		setCardNumber,
		setExpiry,
		setCvv,
		setName,
		setZip,
	} = context || {};
	const router = useRouter();

	/**
	 * Handles logo click event
	 */
	const handleLogoClick = () => {
		setError?.({});
		setEditing?.(false);
		setCardNumber?.('');
		setExpiry?.('');
		setCvv?.('');
		setName?.('');
		setZip?.('');
		router.push('/');
	};

	return (
		<div className='flex min-h-screen flex-col'>
			<header className='flex items-center min-h-20 glass shadow-soft backdrop-blur-md p-4 relative z-20'>
				<div className='flex items-center'>
					<Image
						src='/payment-flow/logo.png'
						alt='Payment Portal'
						width={120}
						height={40}
						className='h-auto w-auto cursor-pointer transition-transform duration-300 hover:scale-105'
						onClick={handleLogoClick}
						priority
						loading='eager'
						sizes='(max-width: 768px) 100px, 120px'
					/>
				</div>
			</header>
			<main className='flex-grow min-h-screen text-center relative z-10'>
				{children}
			</main>
		</div>
	);
};

export default Layout;
