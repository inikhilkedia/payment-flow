'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Split context into smaller, more focused contexts
interface PaymentContextType {
	amount: number;
	setAmount: (value: number) => void;
	cardNumber: string;
	setCardNumber: (value: string) => void;
	expiry: string;
	setExpiry: (value: string) => void;
	cvv: string;
	setCvv: (value: string) => void;
	name: string;
	setName: (value: string) => void;
	zip: string;
	setZip: (value: string) => void;
}

interface UIContextType {
	error: Record<string, string>;
	setError: (value: Record<string, string>) => void;
	editing: boolean;
	setEditing: (value: boolean) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);
const UIContext = createContext<UIContextType | undefined>(undefined);

// Custom hooks for better performance
export const usePaymentContext = () => {
	const context = useContext(PaymentContext);
	if (!context) {
		throw new Error('usePaymentContext must be used within a PaymentProvider');
	}
	return context;
};

export const useUIContext = () => {
	const context = useContext(UIContext);
	if (!context) {
		throw new Error('useUIContext must be used within a UIProvider');
	}
	return context;
};

// Payment Provider
export const PaymentProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [amount, setAmount] = useState(600.0);
	const [cardNumber, setCardNumber] = useState('');
	const [expiry, setExpiry] = useState('');
	const [cvv, setCvv] = useState('');
	const [name, setName] = useState('');
	const [zip, setZip] = useState('');

	const value = {
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
	};

	return (
		<PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
	);
};

// UI Provider
export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [error, setError] = useState<Record<string, string>>({});
	const [editing, setEditing] = useState(false);

	const value = {
		error,
		setError,
		editing,
		setEditing,
	};

	return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

// Combined Provider for backward compatibility
export const AppProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	return (
		<PaymentProvider>
			<UIProvider>{children}</UIProvider>
		</PaymentProvider>
	);
};

// Legacy context for backward compatibility
export interface AppContextType {
	amount: number;
	setAmount: (value: number) => void;
	cardNumber: string;
	setCardNumber: (value: string) => void;
	expiry: string;
	setExpiry: (value: string) => void;
	cvv: string;
	setCvv: (value: string) => void;
	name: string;
	setName: (value: string) => void;
	zip: string;
	setZip: (value: string) => void;
	error: Record<string, string>;
	setError: (value: Record<string, string>) => void;
	editing: boolean;
	setEditing: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useAppContext must be used within an AppProvider');
	}
	return context;
};

export default AppContext;
