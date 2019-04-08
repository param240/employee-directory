import React, { Component } from 'react';
import './App.css';
import Main from './components/main';
import * as authUtil from './utils/auth-util';
import { message } from 'antd';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false
    }
  }
  componentWillMount() {
    message.config({
      top: 70,
      duration: 4
    });
    if (!authUtil.isAuthenticated()) {
      this.props.history.push('/login');
    } else {
      this.setState({ authenticated: true })
    }
  }

  componentWillUnmount() {
    message.destroy();
  }
  render() {
    var mainComponent = null;
    if (this.state.authenticated) {
      mainComponent = (
        <Main />
      )
    }
    return (
      <div className="App">
        {mainComponent}
      </div>
    );
  }
}

export default App;
