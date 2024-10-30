import type { NextConfig } from "next";
import { Configuration } from 'webpack'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {},
  },
  webpack: (config: Configuration) => {
    config.resolve = {
      ...(config.resolve || {}),
      fallback: {
        ...config.resolve?.fallback,
        events: require.resolve('events'),
        util: require.resolve('util')
      }
    }
    return config;
  }
};

export default nextConfig;
