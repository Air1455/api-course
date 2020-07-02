import React from "react";
import ReactDom from "react-dom";
import $ from 'jquery';
import '../css/app.css';

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

console.log('Hello Webpack Encore! Edit me in assets/js/app.js');

const App = () => {
    return <h1>Bonjour à tous !</h1>;
}

const rootElement = document.querySelector('#app');
ReactDom.render(<App />, rootElement);
$('#app').text('Un autre texte');