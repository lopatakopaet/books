const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        app: './src/js/index.js',
        form: './src/js/form.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist'
    },
    module: {
        rules:[{
            test: /\.js$/,
            loader:'babel-loader',
            exclude: '/node_modules/'
        }]
    },
    devServer: {
        contentBase: [
            path.join(__dirname, '/dist'),
        ],
        overlay: true
    },
    plugins: [
        new CopyPlugin([
            { from: 'src/assets', to: 'assets' },
            { from: 'public', to: '' }
        ]),
    ],
}