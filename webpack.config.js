const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const path = require('path');
const fs = require('fs');
const copydir = require('copy-dir');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const argv = require('yargs-parser')(process.argv.slice(2));

const { mode } = argv;
const isDev = mode === 'development';

const DIST_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'src/js');
const BUILD_DIR = path.resolve(__dirname, 'dist/js/');
const ASSETS_PATH = path.resolve(__dirname, 'dist/assets/');


const CSS_DIR = path.resolve(__dirname, 'src/css');
const CSS_DIR_PUBLIC = path.resolve(__dirname, 'dist/css');

const getFileList = function(objectKey, filePath, ignoreFileName = [], matchExt = []){
    let storage = {};
    fs.readdirSync(filePath).forEach((fileName) => {
        if (fs.statSync(`${filePath}/${fileName}`).isDirectory()) {
            if (ignoreFileName.indexOf(fileName) == -1) {
                storage = Object.assign({},
                    storage,
                    getFileList(`${objectKey}/${fileName}`,
                        `${filePath}/${fileName}`,
                        ignoreFileName,
                        matchExt));
            }
        } else {
            let matchFlag = false;

            if (matchExt.length == 0) {
                matchFlag = true;
            } else {
                const ext = fileName.split('.').pop();
                if (matchExt.indexOf(ext) !== -1) {
                    matchFlag = true;
                }
            }

            if (matchFlag) {
                if (ignoreFileName.indexOf(fileName) !== -1) {
                    matchFlag = false;
                }
            }

            if (matchFlag) {
                const tmpFile = fileName.split('.').slice(0, -1).join('.');
                storage[`${objectKey}/${tmpFile}`] = ['babel-polyfill', `${filePath}/${fileName}`];
            }
        }
    });
    return storage;
};

const deleteFolder = function(path){
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file, index) => {
            const curPath = `${path}/${file}`;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

deleteFolder(DIST_DIR);

/* 在 public 中建立 js css img */
const public_defaul_folder = ['', 'js', 'css', 'img'];
public_defaul_folder.map((keyName) => {
    const dir = path.resolve(__dirname, `dist/${keyName}`);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
});


let jsEntry = {};
/* JS entry */
if (1) {
    const jsFolder = {
        app: `${APP_DIR}/` + 'app',
    };
    let JS_Entry = {};

    Object.keys(jsFolder).map((objectKey, index) => {
        const filePath = jsFolder[objectKey];
        JS_Entry = Object.assign(JS_Entry, getFileList(objectKey, filePath, ['component', 'components']));
    });

    jsEntry = Object.assign({}, jsEntry, JS_Entry);
}

/* CSS entry */
let cssEntry = {};
if (1) {
    const cssFolder = {
        page: `${CSS_DIR}/` + 'page',
        // vendor: CSS_DIR + "/" + "vendor",
    };

    let CSS_Entry = {};
    Object.keys(cssFolder).map((objectKey, index) => {
        const filePath = cssFolder[objectKey];
        CSS_Entry = Object.assign(CSS_Entry, getFileList(objectKey, filePath, [], ['css', 'scss', 'less']));
    });

    cssEntry = Object.assign({}, cssEntry, CSS_Entry);
}


/* Copy folder */
if (1) {
    const IMG_DIR = path.resolve(__dirname, 'src/img');
    const IMG_DIR_PUBLIC = path.resolve(__dirname, 'dist/img');

    const ICOMOON_FONT_DIR = path.resolve(__dirname, 'src/css/icomoon/');
    const ICOMOON_FONT_PUBLIC_DIR = path.resolve(__dirname, 'dist/css/icomoon/');

    const copyEntry = {};
    copyEntry[IMG_DIR] = IMG_DIR_PUBLIC;
    // copyEntry[ICOMOON_FONT_DIR] = ICOMOON_FONT_PUBLIC_DIR;

    for (const fromPath in copyEntry) {
        copydir.sync(fromPath, copyEntry[fromPath]);
    }
}


let jsConfig = {
    mode,
    devtool: isDev ? 'cheap-eval-source-map' : '',
    context: APP_DIR,
    entry: {
        ...jsEntry,
    },
    output: {
        filename: '[name].bundle.js',
        path: BUILD_DIR,
        publicPath: ASSETS_PATH,
    },
    resolve: {
        alias: {
            vendor: path.join(__dirname, '/src/js/vendor'),
            lib: path.join(__dirname, '/src/js/lib'),
            vue: 'vue/dist/vue.js',
        },
        extensions: ['.vue', '.jsx', '.js', '.json'],
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            include: APP_DIR,
            exclude: /node_modules/,
            loader: 'babel-loader',
        },
        {
            test: /\.vue$/,
            loader: 'vue-loader',
        },
        {
            test: /\.css$/,
            use: [
                'vue-style-loader',
                'css-loader',
            ],
        },
        ],
    },
    plugins: [
    // // make sure to include the plugin!
        new VueLoaderPlugin(),
        new ExtractTextPlugin('../css/[name].css'),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            jquery: 'jquery',
            'window.jQuery': 'jquery',
            moment: 'moment',
        }),
        /*
            https://github.com/nuxt/webpackbar
         */
        new WebpackBar({
            name: ' ------ JS Bundle ------ ',
            color: '#f79420',
        }),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                default: false,
                node_modules: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'chunk/node_modules',
                    chunks: 'all',
                    minSize: 10,
                    // minChunks: 1
                },
                vendor: {
                    test: /[\\/]js[\\/]vendor[\\/]/,
                    name: 'chunk/vendor',
                    chunks: 'initial',
                    minSize: 100,
                    minChunks: 1,
                },
            },
        },
    },
};

// if (mode == 'development') {
//     jsConfig = {
//         ...jsConfig,
//         ...{
//             performance: {
//                 hints: false, // disable warning
//             },
//             devtool: 'source-map',

//             watchOptions: {
//                 aggregateTimeout: 300,
//             },
//         },
//     };
// }


// const cssConfigPlugin = [];
// cssConfigPlugin.push(new ExtractTextPlugin('../css/[name].css'));
// if (mode == 'production') {
//     cssConfigPlugin.push(
//         new OptimizeCssAssetsPlugin({
//             cssProcessor: require('cssnano'),
//             cssProcessorOptions: { discardComments: { removeAll: true } },
//             canPrint: false,
//         }),
//     );
// }


const cssConfig = {
    mode,
    devtool: isDev ? 'cheap-eval-source-map' : '',
    entry: {
        ...cssEntry,
    },
    output: {
        filename: './css_del/[name].bundle.css.js',
        path: BUILD_DIR,
    },
    resolve: {
        alias: {

        },
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                        },
                    },
                    'postcss-loader',
                ],
            },
            {
                test: /\.(sa|sc)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                        },
                    },
                    'postcss-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        /*
            https://github.com/webpack-contrib/mini-css-extract-plugin
        */
        new MiniCssExtractPlugin({
            filename: '../css/[name].css',
        }),
        /*
            https://github.com/nuxt/webpackbar
         */
        new WebpackBar({
            name: ' ------ CSS Bundle ------ ',
            color: '#009fba',
        }),
    ],
};

// if (mode == 'development') {
//     cssConfig = {
//         ...cssConfig,
//         ...{
//             performance: {
//                 hints: false, // disable warning
//             },
//             devtool: 'source-map',

//             watchOptions: {
//                 aggregateTimeout: 300,
//             },
//         },
//     };
// }


module.exports = [jsConfig, cssConfig];

// module.exports = [jsConfig];
