'use client';

import React, { ReactNode } from 'react';
import { PaymentProvider, UIProvider } from './AppContext';

interface AppProviderProps {
	children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
	return (
		<PaymentProvider>
			<UIProvider>{children}</UIProvider>
		</PaymentProvider>
	);
};

export default AppProvider;
