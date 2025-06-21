import bundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
	basePath: '/payment-flow',
	output: 'export',
	reactStrictMode: true,
	experimental: {
		optimizePackageImports: ['validator'],
	},
	images: {
		unoptimized: true,
		formats: ['image/webp', 'image/avif'],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	},
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
};

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
