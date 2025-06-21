import React, {
	FC,
	FormEvent,
	ChangeEvent,
	useContext,
	useRef,
	useState,
	useEffect,
} from 'react';
import { useFormStatus } from 'react-dom';
import validator from 'validator';
import InputField from './InputField';
import AppContext, { AppContextType } from '../AppContext';

interface PaymentFormProps {
	classes: string;
}

interface CSRFToken {
	token: string;
	expiresAt: number;
}

/**
 * PaymentForm component
 *
 * Manages the input and validation of payment information.
 *
 * @param {Object} props - Component props
 * @param {string} props.classes - Additional CSS classes for the form
 * @returns {JSX.Element} The PaymentForm component
 */
const PaymentForm: FC<PaymentFormProps> = ({ classes }) => {
	const context = useContext(AppContext) as AppContextType;
	const errorContext = context.error as Record<string, string>;
	const {
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
		setEditing,
		setError,
	} = context;

	// CSRF token state
	const [csrfToken, setCsrfToken] = useState<string>('');
	const [csrfExpiresAt, setCsrfExpiresAt] = useState<number>(0);

	// Create refs for each input field
	const cardNumberRef = useRef<HTMLInputElement>(null);
	const expiryRef = useRef<HTMLInputElement>(null);
	const cvvRef = useRef<HTMLInputElement>(null);
	const nameRef = useRef<HTMLInputElement>(null);
	const zipRef = useRef<HTMLInputElement>(null);

	// Generate CSRF token
	const generateCSRFToken = (): CSRFToken => {
		const token =
			Math.random().toString(36).substring(2, 15) +
			Math.random().toString(36).substring(2, 15) +
			Math.random().toString(36).substring(2, 15);
		return {
			token,
			expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes
		};
	};

	// Store CSRF token
	const storeCSRFToken = (token: CSRFToken) => {
		if (typeof window !== 'undefined') {
			sessionStorage.setItem('csrfToken', JSON.stringify(token));
		}
	};

	// Get stored CSRF token
	const getStoredCSRFToken = (): CSRFToken | null => {
		if (typeof window !== 'undefined') {
			const stored = sessionStorage.getItem('csrfToken');
			if (stored) {
				try {
					return JSON.parse(stored);
				} catch (error) {
					console.error('Failed to parse stored CSRF token:', error);
				}
			}
		}
		return null;
	};

	// Validate CSRF token
	const validateCSRFToken = (token: string, expiresAt: number): boolean => {
		if (!token || Date.now() > expiresAt) {
			return false;
		}
		return true;
	};

	// Initialize CSRF token on component mount
	useEffect(() => {
		const storedToken = getStoredCSRFToken();

		if (storedToken && storedToken.expiresAt > Date.now()) {
			// Use stored token if valid
			setCsrfToken(storedToken.token);
			setCsrfExpiresAt(storedToken.expiresAt);
		} else {
			// Generate new token
			const newToken = generateCSRFToken();
			storeCSRFToken(newToken);
			setCsrfToken(newToken.token);
			setCsrfExpiresAt(newToken.expiresAt);
		}
	}, []);

	/**
	 * Validators for the PaymentForm component.
	 * The cardNumber function uses the isCreditCard method from the validator package to validate the card number.
	 * The expiry function validates the expiry date by checking if the month is between 1 and 12 and the year is greater than the current year.
	 * The cvv function validates the CVV by checking if it is 3 or 4 digits long and contains only numbers.
	 * The name function validates the name by checking if it contains only alphabetic characters.
	 * The zip function validates the zip code by checking if it is a valid US postal code.
	 *
	 * @typedef {Object} Validators - The validators object for payment form fields.
	 * @property {(value: string) => boolean} cardNumber - The validator for card number field.
	 * @property {(value: string) => boolean} expiry - The validator for expiry date field.
	 * @property {(value: string) => boolean} cvv - The validator for CVV field.
	 * @property {(value: string) => boolean} name - The validator for name field.
	 * @property {(value: string) => boolean} zip - The validator for ZIP code field.
	 *
	 * @type {Validators} validators - The validators object for payment form fields.
	 */
	const validators: Record<string, (value: string) => boolean> = {
		cardNumber: validator.isCreditCard,
		expiry: value => {
			const [month, year] = value.split('/').map(item => item.trim());
			if (
				month &&
				year &&
				validator.isInt(month, { min: 1, max: 12 }) &&
				validator.isInt(year, { min: 0 })
			) {
				const currentYear = new Date().getFullYear() % 100;
				const currentMonth = new Date().getMonth() + 1;
				const expiryYear = parseInt(year, 10);
				const expiryMonth = parseInt(month, 10);
				return (
					expiryYear > currentYear ||
					(expiryYear === currentYear && expiryMonth >= currentMonth)
				);
			}
			return false;
		},
		cvv: value => {
			const isAmex = cardNumber
				? validator.isCreditCard(cardNumber, { provider: 'amex' })
				: false;
			return isAmex
				? validator.isLength(value, { min: 4, max: 4 }) &&
						validator.isNumeric(value)
				: validator.isLength(value, { min: 3, max: 3 }) &&
						validator.isNumeric(value);
		},
		name: value => {
			const trimmed = value.trim();
			return (
				trimmed.length >= 3 && // minimum length
				/^[A-Za-z ]+$/.test(trimmed) && // only letters and spaces
				trimmed.split(' ').filter(word => word.length > 0).length >= 2 // at least two words
			);
		},
		zip: value => validator.isPostalCode(value, 'US'),
	};

	// Stable event handlers using useEvent (React 19)
	const handleFieldChange = (
		type: string,
		value: string,
		nextFieldRef?: React.RefObject<HTMLInputElement | null>
	): void => {
		let formattedValue = value;

		if (type === 'expiry' && value.length === 2) {
			formattedValue = value + '/';
		}

		const setStateFunctions: Record<string, (value: string) => void> = {
			cardNumber: setCardNumber!,
			expiry: setExpiry!,
			cvv: setCvv!,
			name: setName!,
			zip: setZip!,
		};

		setStateFunctions[type](formattedValue);

		const newError = validators[type](formattedValue)
			? ''
			: type === 'cardNumber'
			? 'Invalid card number.'
			: type === 'expiry'
			? 'Invalid expiry date.'
			: type === 'cvv'
			? 'Invalid CVV.'
			: type === 'name'
			? 'Name must be at least two words.'
			: type === 'zip'
			? 'Invalid ZIP code.'
			: 'Invalid value.';
		const newErrorObj = { ...errorContext, [type]: newError };
		setError(newErrorObj);
	};

	// Stable event handlers using useEvent (React 19)
	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		type: string,
		nextFieldRef?: React.RefObject<HTMLInputElement | null>
	): void => {
		// Special handling for expiry field backspace
		if (type === 'expiry') {
			const target = e.target as HTMLInputElement;
			if (
				(e.key === 'Backspace' || e.key === 'Delete') &&
				target.selectionStart === 3 &&
				target.value[2] === '/'
			) {
				e.preventDefault();
				setExpiry(target.value.slice(0, 2));
				return;
			}
		}

		// Handle Tab or Enter key
		if (e.key === 'Tab' || e.key === 'Enter') {
			const currentValue = e.currentTarget.value;
			const isValid = validators[type](currentValue);

			// If field is valid and we have a next field, move focus
			if (isValid && nextFieldRef?.current) {
				e.preventDefault(); // Prevent default Tab behavior
				nextFieldRef.current.focus();
			}
		}
	};

	// Stable event handlers using useEvent (React 19)
	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();

		// Validate CSRF token first
		if (!validateCSRFToken(csrfToken, csrfExpiresAt)) {
			alert(
				'Security validation failed. Please refresh the page and try again.'
			);
			return;
		}

		const newError: Record<string, string> = {};
		if (!validators.cardNumber(cardNumber))
			newError.cardNumber = 'Invalid card number.';
		if (!validators.expiry(expiry)) newError.expiry = 'Invalid expiry date.';
		if (!validators.cvv(cvv)) newError.cvv = 'Invalid CVV.';
		if (!validators.name(name))
			newError.name = 'Name must be at least two words.';
		if (!validators.zip(zip)) newError.zip = 'Invalid ZIP code.';

		if (Object.keys(newError).length === 0) {
			setError({});
			setEditing?.(false);
		} else {
			setError(newError);
		}
	};

	const { pending } = useFormStatus();

	return (
		<form
			id='PaymentForm'
			onSubmit={handleSubmit}
			className={`space-y-4 ${classes}`}
		>
			{/* Hidden CSRF token field */}
			<input type='hidden' name='csrfToken' value={csrfToken} />

			<InputField
				id='cardNumber'
				label='Card number'
				value={cardNumber ?? ''}
				onChange={(e: ChangeEvent<HTMLInputElement>) =>
					handleFieldChange('cardNumber', e.target.value, expiryRef)
				}
				onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
					handleKeyDown(e, 'cardNumber', expiryRef)
				}
				error={errorContext.cardNumber ?? ''}
				ariaLabel='Card number'
				validationFunc={validators.cardNumber}
				ref={cardNumberRef}
			/>
			<div className='flex space-x-4'>
				<InputField
					id='expiry'
					classes='flex-1'
					label='Expires (MM/YY)'
					value={expiry ?? ''}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						handleFieldChange('expiry', e.target.value, cvvRef)
					}
					onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
						handleKeyDown(e, 'expiry', cvvRef)
					}
					error={errorContext.expiry ?? ''}
					ariaLabel='Expiration date'
					validationFunc={validators.expiry}
					ref={expiryRef}
				/>
				<InputField
					id='cvv'
					classes='flex-1'
					label='Security code (CVV)'
					value={cvv ?? ''}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						handleFieldChange('cvv', e.target.value, nameRef)
					}
					onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
						handleKeyDown(e, 'cvv', nameRef)
					}
					error={errorContext.cvv ?? ''}
					ariaLabel='CVV'
					validationFunc={validators.cvv}
					ref={cvvRef}
				/>
			</div>
			<InputField
				id='name'
				label='Name on card'
				value={name ?? ''}
				onChange={(e: ChangeEvent<HTMLInputElement>) =>
					handleFieldChange('name', e.target.value, zipRef)
				}
				onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
					handleKeyDown(e, 'name', zipRef)
				}
				error={errorContext.name ?? ''}
				ariaLabel='Name on card'
				validationFunc={validators.name}
				ref={nameRef}
			/>
			<InputField
				id='zip'
				label='Zip code'
				value={zip ?? ''}
				onChange={(e: ChangeEvent<HTMLInputElement>) =>
					handleFieldChange('zip', e.target.value)
				}
				onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
					handleKeyDown(e, 'zip')
				}
				error={errorContext.zip ?? ''}
				ariaLabel='Zip code'
				validationFunc={validators.zip}
				ref={zipRef}
			/>
			<button
				type='submit'
				className='mt-8 w-full rounded-lg bg-blue-600 px-4 py-2 text-white'
				disabled={pending}
			>
				{pending ? 'Processing...' : 'Continue'}
			</button>
		</form>
	);
};

export default PaymentForm;
