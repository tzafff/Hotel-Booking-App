/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: '127.0.0.1',
            },
            {
                hostname: 'blush-fundamental-gerbil-302.mypinata.cloud',
            }
        ]
    }
};

export default nextConfig;
