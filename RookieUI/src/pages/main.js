'use strict'

import React, { Component } from 'react'
import { StyleSheet, Image, View } from 'react-native'
import { TabNavigator, TabBarBottom } from 'react-navigation'
import { px2dp } from '../utils/screenUtils'
import Icon from 'react-native-vector-icons/EvilIcons'

import ButtonPage from './UI/buttonPage'

const tabNavigatorConf = {
  initialRouteName: 'ButtonPage',
  tabBarPosition: 'bottom',
  tabBarComponent: TabBarBottom,
  lazy: true,
  lazyLoad: true,
  swipeEnabled: false,
  animationEnabled: false,
  tabBarOptions: {
    showIcon: true,
    activeTintColor: '#FFC850',
    activeBackgroundColor: '#ffffff',
    inactiveTintColor: '#9f9f9f',
    inactiveBackgroundColor: '#ffffff',
    style: {
      backgroundColor: '#fff',
    }
  },
}

const MainTab = TabNavigator({
  ButtonPage: {
    screen: ButtonPage,
    navigationOptions: ({navigation}) => ({
      tabBarLabel: 'Button',
      title: 'Button',
      tabBarIcon: ({tintColor}) => (
        <Icon name="refresh" size={25} color={tintColor} />
      ),
    })
  }
}, tabNavigatorConf)

const styles = StyleSheet.create({
  icon: {
    width: 35,
    height: 35
  }
})

export default MainTab