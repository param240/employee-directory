import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './components/login';

ReactDOM.render(
    <LocaleProvider locale={enUS}>
        <BrowserRouter>
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route path="/" component={App} />
            </Switch>
        </BrowserRouter>
    </LocaleProvider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
