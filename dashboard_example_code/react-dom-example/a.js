require.config({
    paths: {
        'react': 'https://unpkg.com/react@16/umd/react.production.min',
        'react-dom': 'https://unpkg.com/react-dom@16/umd/react-dom.production.min'
    }
});

require([
    "underscore",
    "backbone",
    "splunkjs/mvc",
    "jquery",
    "react",
    "react-dom"
], function(_, Backbone, mvc, $, React, ReactDOM) {

    ReactDOM.render(React.createElement(
        'h1',
        null,
        'Hello, world!'
    ), document.getElementById('root'));

});
