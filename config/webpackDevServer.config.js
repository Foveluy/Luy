'use strict';

const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const path = require('path');
const config = require('./webpack.config.dev');
const paths = require('./paths');

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';

module.exports = function (proxy, allowedHost) {
    return {
        // WebpackDevServer 2.4.3 introduced a security fix that prevents remote
        // websites from potentially accessing local content through DNS rebinding:
        // https://github.com/webpack/webpack-dev-server/issues/887
        // https://medium.com/webpack/webpack-dev-server-middleware-security-issues-1489d950874a
        // However, it made several existing use cases such as development in cloud
        // environment or subdomains in development significantly more complicated:
        // https://github.com/facebookincubator/create-react-app/issues/2271
        // https://github.com/facebookincubator/create-react-app/issues/2233
        // While we're investigating better solutions, for now we will take a
        // compromise. Since our WDS configuration only serves files in the `public`
        // folder we won't consider accessing them a vulnerability. However, if you
        // use the `proxy` feature, it gets more dangerous because it can expose
        // remote code execution vulnerabilities in backends like Django and Rails.
        // So we will disable the host check normally, but enable it if you have
        // specified the `proxy` setting. Finally, we let you override it if you
        // really know what you're doing with a special environment variable.
        disableHostCheck:
            !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
        // 编译之后进行压缩
        compress: true,
        // 关闭webpackserver的一些log，本来他们也没啥用
        clientLogLevel: 'none',
        // By default WebpackDevServer serves physical files from current directory
        // in addition to all the virtual build products that it serves from memory.
        // This is confusing because those files won’t automatically be available in
        // production build folder unless we copy them. However, copying the whole
        // project directory is dangerous because we may expose sensitive files.
        // Instead, we establish a convention that only files in `public` directory
        // get served. Our build script will copy `public` into the `build` folder.
        // In `index.html`, you can get URL of `public` folder with %PUBLIC_URL%:
        // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
        // In JavaScript code, you can access it with `process.env.PUBLIC_URL`.
        // Note that we only recommend to use `public` folder as an escape hatch
        // for files like `favicon.ico`, `manifest.json`, and libraries that are
        // for some reason broken when imported through Webpack. If you just want to
        // use an image, put it in `src` and `import` it from JavaScript instead.
        contentBase: paths.appPublic,
        // 当修改公共文件的时候也会发生重新编译
        watchContentBase: true,
        //启动热更新，css变化的时候会发生热更新，但是如果是JS 发生变化就会重新刷新浏览器
        hot: true,
        // It is important to tell WebpackDevServer to use the same "root" path
        // as we specified in the config. In development, we always serve from /.
        publicPath: config.output.publicPath,
        //让服务器闭嘴
        quiet: true,
        // Reportedly, this avoids CPU overload on some systems.
        // https://github.com/facebookincubator/create-react-app/issues/293
        // src/node_modules is not ignored to support absolute imports
        // https://github.com/facebookincubator/create-react-app/issues/1065
        watchOptions: {
            ignored: new RegExp(
                `^(?!${path
                    .normalize(paths.appSrc + '/')
                    .replace(/[\\]+/g, '\\\\')}).+[\\\\/]node_modules[\\\\/]`,
                'g'
            ),
        },
        // Enable HTTPS if the HTTPS environment variable is set to 'true'
        https: protocol === 'https',
        host: host,
        overlay: false,
        historyApiFallback: {
            // Paths with dots should still use the history fallback.
            // See https://github.com/facebookincubator/create-react-app/issues/387.
            disableDotRule: true,
        },
        public: allowedHost,
        proxy,
    };
};
