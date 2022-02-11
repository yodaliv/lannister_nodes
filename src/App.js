import { Fragment } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'

import './App.css';
import Home from './pages/home/Home';
import LannisterApp from './pages/app/LannisterApp';
import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';
import MetamaskProvider from "./provider/MetamaskProvider";

function getLibrary (provider) {
    return new Web3(provider);
}

function App () {
    const AlertTemplate = ({ message }) => (
        <div className="alert red-bg">{message}</div>
    );
    const options = {
        // you can also just use 'bottom center'
        position: positions.TOP_RIGHT,
        timeout: 5000,
        offset: '30px',
        // you can also just use 'scale'
        transition: transitions.SCALE
    }
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <MetamaskProvider>
                <AlertProvider template={AlertTemplate} {...options}>
                    <div className="app">
                        <Router>
                            <Fragment>
                                <Switch>
                                    <Route exact path="/" component={Home} />
                                    <Route exact path="/app" component={LannisterApp} />
                                </Switch>
                            </Fragment>
                        </Router>
                    </div>
                </AlertProvider>
            </MetamaskProvider>
        </Web3ReactProvider>
    );
}

export default App;
