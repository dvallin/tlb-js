const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin

const plugins = [
    new HtmlWebpackPlugin()
]

if (process.env.ANALYZE === "true") {
    plugins.push(new BundleAnalyzerPlugin())
}

module.exports = {
    target: 'web',
    entry: {
        [process.env.LAYER]: './src/main.ts'
    },
    output: {
        filename: 'tlb.bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                options: {
                    useBabel: true
                }
            },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            "@": path.resolve(__dirname, "src"),
        }
    },
    plugins,
    devtool: 'source-map'
}
