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
		<div className='flex min-h-screen flex-col bg-blue-50'>
			<header className='flex items-center min-h-20 bg-white p-4 shadow-md'>
				<div className='flex items-center'>
					<Image
						src='/payment-flow/abclogo.svg'
						alt='ABC Health System'
						width={120}
						height={40}
						className='h-auto w-auto cursor-pointer'
						onClick={handleLogoClick}
						priority
						loading='eager'
						sizes='(max-width: 768px) 100px, 120px'
					/>
				</div>
			</header>
			<main className='flex-grow min-h-screen text-center'>{children}</main>
		</div>
	);
};

export default Layout;
