import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'a.storyblok.com',
                port: '',
                pathname: '/f/**',
            },
        ],
    },
};

export default nextConfig;
