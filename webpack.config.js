module.exports = {
    entry: "./js/application.js",
    output: {
        path: __dirname,
        filename: "js/bundle.js"
    },
    modulesDirectories: ["js"],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};
