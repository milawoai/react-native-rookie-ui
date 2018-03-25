'use strict'
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'

const PressCtrlMode = {
  none: 'none', // 没有延时
  async: 'async', // 异步方法
  antiShark: 'antiShark', // delay时间内没有响应
  throttle: 'throttle' //
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  spinner: {
    alignSelf: 'center',
  },
  opacity: {
    opacity: 0.5,
  },
});


const defaultIndicatorConfigs = {
  animating: true,
  size: 'small',
  color: 'white',
  style: styles.spinner
}

export default class BaseButton extends Component {
  static defaultProps = {
    labelText:'确定',
    pressCtrlMode: PressCtrlMode.async,
  }

  static propTypes = {
    onPress: PropTypes.func,
    pressCtrlMode: PropTypes.oneOf([
      PressCtrlMode.none,
      PressCtrlMode.async,
      PressCtrlMode.antiShark,
      PressCtrlMode.throttle
    ]),
    disable: PropTypes.bool,

    indicatorConfigs: PropTypes.object // 控制指示器
  }

  state = {
    isLoading: false
  }

  constructor(props) {
    super(props)
  }

  renderInnerView() {
    const {indicatorConfigs} = this.props
    let indicatorParams = {...defaultIndicatorConfigs ,...indicatorConfigs}
    if (this.state.isLoading) {
      return(
        <ActivityIndicator {...indicatorParams}/>
      )
    } else {
      return this.props.children
    }
  }

  render() {
    if (this.props.disable) {
      return(
        <View style = {[styles.button,this.props.style,(this.props.disabledStyle)]}>
          {this.renderInnerView()}
        </View>
      )
    }
    return(
      <TouchableOpacity {...this.props}
        style = {[styles.button, this.props.style]}
        onPress={this.onPress}
      >
        {this.renderInnerView()}
      </TouchableOpacity>
    );
  }

  onPress = async (e) => {
    if (this.state.isLoading) {
      return
    }
    try {
      this.setState({
        isLoading: true
      })
      this.props && await this.props.onPress(e)
    } catch (error) {
      throw error
    } finally {
      this.setState({
        isLoading: false
      })
    }
  }
}