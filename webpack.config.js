const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'test') {
    require('dotenv').config({ path: '.env.test' });
} else if (process.env.NODE_ENV === 'development') {
    require('dotenv').config({ path: '.env.development' });
}
// process.env.NODE_ENV

module.exports = (env) => {
    const isProduction = env === 'production';

    // console.log('env', env, isProduction)
    const CSSExtract = new ExtractTextPlugin('styles.css');
    return {
        entry: ['babel-polyfill', './src/app.js'],
        output: {
            path: path.resolve(__dirname, 'public', 'dist'),
            // publicPath: 'dist/',
            filename: '[name].bundle.js',
            chunkFilename: '[name].bundle.js',
            // path: path.resolve(process.cwd(), 'public', 'dist'),
        },
        module: {
            rules: [
                {
                    loader: 'json-loader',
                    test: /\.json$/
                },
                {
                    loader: 'babel-loader',
                    test: /\.js$/,
                    exclude: /node_modules/
                },
                {
                    test: /\.s?css$/,
                    use: CSSExtract.extract({
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    })
                },
                {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: 'svg-url-loader',
                            options: {
                                limit: 10000,
                            },
                        },
                    ],
                }
            ]
        },
        plugins: [
            new webpack.ProgressPlugin(),
            new CompressionPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
                threshold: 10240,
                minRatio: 0.8
            }),
            CSSExtract,
            new CleanWebpackPlugin(),
            new webpack.DefinePlugin({
                'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
                'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
                'process.env.FIREBASE_DATABASE_URL': JSON.stringify(process.env.FIREBASE_DATABASE_URL),
                'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
                'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
                'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
                'process.env.ADMIN_PRIVATE_KEY_ID': JSON.stringify(process.env.ADMIN_PRIVATE_KEY_ID),
                'process.env.ADMIN_PRIVATE_KEY': JSON.stringify(process.env.ADMIN_PRIVATE_KEY),
                'process.env.CLIENT_ID': JSON.stringify(process.env.CLIENT_ID),
                'process.env.CLIENT_EMAIL': JSON.stringify(process.env.CLIENT_EMAIL)
            })
        ],
        devtool: isProduction ? false : 'cheap-module-eval-source-map',
        devServer: {
            contentBase: path.join(__dirname, 'public'),
            historyApiFallback: true,
            publicPath: '/dist/',
            proxy: {
                '/api': 'http://127.0.0.1:3000'
            },
            port: 8080,
            compress: true
        },
        optimization: {
            minimizer: [new TerserPlugin()],
            splitChunks: {
                chunks: 'all',
            }
        }
    }
};