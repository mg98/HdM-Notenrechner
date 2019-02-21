import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import utils from './utils'

const store = utils.createStore();
const notenOptions = [
    { key: '-', value: '-', text: '-' },
    { key: '1.0', value: '1.0', text: '1.0' },
    { key: '1.3', value: '1.3', text: '1.3' },
    { key: '1.7', value: '1.7', text: '1.7' },
    { key: '2.0', value: '2.0', text: '2.0' },
    { key: '2.3', value: '2.3', text: '2.3' },
    { key: '2.7', value: '2.7', text: '2.7' },
    { key: '3.0', value: '3.0', text: '3.0' },
    { key: '3.3', value: '3.3', text: '3.3' },
    { key: '3.7', value: '3.7', text: '3.7' },
    { key: '4.0', value: '4.0', text: '4.0' }
]
ReactDOM.render(<App notenOptions={notenOptions} store={store} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
