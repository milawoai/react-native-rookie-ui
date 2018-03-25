/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import StackNav from './src/pages/stackNav'

export default class App extends Component<> {
  render() {
    return (
      <StackNav ref={nav => { this.navigator = nav }}/>
    )
  }
}
