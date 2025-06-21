import React from 'react';

type ErrorTextProps = {
	error: string;
};

const ErrorText: React.FC<ErrorTextProps> = ({ error }) => {
	if (!error) return null;

	return (
		<div className='flex items-center gap-2 text-custom-error-red text-sm mt-1'>
			<span className='icon-wrapper'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					strokeWidth={1.5}
					stroke='currentColor'
					className='size-4'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z'
					/>
				</svg>
			</span>
			{error}
		</div>
	);
};

export default React.memo(ErrorText);
