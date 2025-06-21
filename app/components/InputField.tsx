import React, { ChangeEvent, FC, forwardRef, Ref } from 'react';
import ErrorText from './ErrorText';
import Icons from './Icons';
import { getCardType } from '../utils/cardType';

interface InputFieldProps {
	id: string;
	classes?: string;
	label: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	error: string;
	ariaLabel: string;
	validationFunc: (value: string) => boolean;
}

// Wrap the component with forwardRef to pass refs
const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
	(
		{
			id,
			classes = '',
			label,
			value,
			onChange,
			onKeyDown,
			error,
			ariaLabel,
			validationFunc,
		},
		ref
	) => {
		return (
			<div className={`form-group ${classes}`}>
				<label
					htmlFor={id}
					className='mb-1 block font-bold text-gray-700 max-[385px]:text-sm'
				>
					{label}
				</label>
				<div className='relative flex items-center'>
					{id === 'cardNumber' && (
						<span className='absolute left-3 flex items-center'>
							<Icons type='card' cardType={getCardType?.(value ?? '')} />
						</span>
					)}
					<input
						type='text'
						id={id}
						value={value}
						onChange={onChange}
						onKeyDown={onKeyDown}
						className={`w-full rounded border px-3 py-2 text-custom-dark ${
							error ? 'border-custom-error-red' : 'border-custom-medium-gray'
						} ${id === 'cardNumber' ? 'pl-12' : ''} pr-10`}
						aria-label={ariaLabel}
						ref={ref} // Apply the ref here
					/>
					<span className='absolute right-3 flex items-center'>
						{error ? (
							<Icons type='error' />
						) : validationFunc(value) ? (
							<Icons type='success' />
						) : null}
					</span>
				</div>
				{error && <ErrorText error={error} />}
			</div>
		);
	}
);

// Assigning a display name to the forwardRef component for debugging purposes.
InputField.displayName = 'InputField';

export default InputField;
