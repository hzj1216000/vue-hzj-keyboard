const path = require("path");
const webpack = require("webpack");
const uglify = require("uglifyjs-webpack-plugin");

module.exports = {
    devtool: 'source-map',
    entry: "./src/index.js", //入口文件，就是上步骤的src目录下的index.js文件，
    output: {
        path: path.resolve(__dirname, './lib'), //输出路径，就是上步骤中新建的dist目录，
        publicPath: '/lib/',
        filename: 'VueHzjKeyboard.js',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    externals: {
        vue: "vue",
        axios: "axios"
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(css|less)$/,
                use: [{
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "less-loader"
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [{
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "scss-loader"
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
				options: {
					presets: ['es2015']
				}
            },
            {
                test: /\.(png|jpg|gif|ttf|svg|woff|eot)$/,
                loader: 'url-loader',
                query: {
                    limit: 30000,
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            //输出不显示警告
            compress: {
                warnings: false //默认值
            },
            //输出去掉注释
            output: {
                comments: false //默认值
            }
        })
    ]
};