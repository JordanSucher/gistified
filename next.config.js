const webpack = require('webpack')

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, options) => {
        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env.FLUENTFFMPEG_COV': false
            })
        )
    
        return config
    },
    output: 'standalone',
}

module.exports = nextConfig
