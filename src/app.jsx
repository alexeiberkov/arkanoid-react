const React = require('react');
const Arkanoid = require('./Components/Arkanoid');

const App = React.createClass({

    displayName: 'App',

    render: function () {
        return <Arkanoid onFinishGame={this.onFinishGame}/>;
    },

    onFinishGame: function () {
        console.log('Game is over...');
    }

});

module.exports = App;
