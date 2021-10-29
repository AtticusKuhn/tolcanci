const path = require('path');

module.exports = {

    entry: {
        program: './src/example.ts',
        runTime: "./src/client.ts"
    }
    ,

    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                // use:'',
                use: {
                    loader: 'babel-loader',
                    options: {
                        // presets: 
                        plugins: ['@babel/plugin-transform-typescript', require("./myBabelPlugin")]
                    }
                },
                // options: {
                //     presets: ['env'],
                //     plugins: [require("./myBabelPlugin")]
                // }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    optimization: {
        usedExports: true,
    },
    //  mode: 'production',
    // };
    // Tip
    output: {
        // filename: 'build.js',
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
}