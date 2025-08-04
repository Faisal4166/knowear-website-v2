/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'knowear.s3.ap-south-1.amazonaws.com'
            },
            {
                protocol: 'https',
                hostname: 'knowearcommerce.s3.ap-south-1.amazonaws.com'
            }
        ]
    }
};

export default nextConfig;
