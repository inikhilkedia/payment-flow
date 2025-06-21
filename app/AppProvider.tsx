'use client';

import React, { ReactNode, useState } from 'react';
import { PaymentProvider, UIProvider, AppContextType } from './AppContext';
import AppContext from './AppContext';

interface AppProviderProps {
	children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
	// Legacy context state for backward compatibility
	const [amount, setAmount] = useState(600.0);
	const [cardNumber, setCardNumber] = useState('');
	const [expiry, setExpiry] = useState('');
	const [cvv, setCvv] = useState('');
	const [name, setName] = useState('');
	const [zip, setZip] = useState('');
	const [error, setError] = useState<Record<string, string>>({});
	const [editing, setEditing] = useState(false);

	const legacyContextValue: AppContextType = {
		amount,
		setAmount,
		cardNumber,
		setCardNumber,
		expiry,
		setExpiry,
		cvv,
		setCvv,
		name,
		setName,
		zip,
		setZip,
		error,
		setError,
		editing,
		setEditing,
	};

	return (
		<AppContext.Provider value={legacyContextValue}>
			<PaymentProvider>
				<UIProvider>{children}</UIProvider>
			</PaymentProvider>
		</AppContext.Provider>
	);
};

export default AppProvider;
