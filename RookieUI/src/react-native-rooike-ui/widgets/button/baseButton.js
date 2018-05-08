'use strict'
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import PropTypes from 'prop-types'
import ViewPropTypes from 'ViewPropTypes'

const PressCtrlMode = {
  none: 'none', // 没有延时
  async: 'async', // 异步方法
  antiShark: 'antiShark', // 函数防抖 delay时间内没有响应
  custom: 'custom', // 通过props.loading控制按键

  throttle: 'throttle', // 函数节流 (todo)
}

const styles = StyleSheet.create({
  spinner: {
    alignSelf: 'center'
  },
  mask: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
})

const defaultIndicatorConfigs = {
  animating: true,
  size: 'small',
  color: 'white',
  style: styles.spinner
}

const ButtonFlags = {
  center: {
    style: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    }
  },
  noOpacity : { // 未完成
    activeOpacity: 1
  }
}

export default class Button extends Component {
  static defaultProps = {
    labelText:'确定',
    pressCtrlMode: PressCtrlMode.async,
  }

  static propTypes = {
    isDegrade: PropTypes.bool, //是否降级
    linearGradientConfig: PropTypes.any,
    children: PropTypes.any,
    style: ViewPropTypes.style,
    onPress: PropTypes.func,
    pressCtrlMode: PropTypes.oneOf([
      PressCtrlMode.none,
      PressCtrlMode.async,
      PressCtrlMode.antiShark,
      PressCtrlMode.custom,
    ]),

    disabled: PropTypes.bool,
    disabledStyle: PropTypes.object,

    delay: PropTypes.number, //延迟，单位毫秒, pressCtrlMode 为 PressCtrlMode.antiShark 时生效

    ignoreIndicator:  PropTypes.bool,
    indicatorConfigs: PropTypes.object, // 控制指示器控制props， 参见react-native ActivityIndicator
    customIndicator: PropTypes.element,

    loading: PropTypes.bool // 只有 pressCtrlMode 为 PressCtrlMode.custom 时生效，控制是否可以点击
  }

  state = {
    isLoading: false
  }

  constructor(props) {
    super(props)
    this.pressConfig = {
      [PressCtrlMode.none]: this.onNormalPress,
      [PressCtrlMode.async]: this.onAsyncPress,
      [PressCtrlMode.antiShark]: this.onAntiSharePress,
      [PressCtrlMode.custom]: this.onCustomPress
    }
  }

  render() {
    let defaultStyle = this.genButtonStyle()
    const {disabled, linearGradientConfig} = this.props
    if (disabled) {
      return(
        <View style = {[defaultStyle, this.props.style, this.props.disabledStyle]}>
          {this.renderInnerView()}
        </View>
      )
    }
    return(
      <TouchableOpacity {...this.props} style = {[defaultStyle, this.props.style]}
        onPress={this.onPress}>
        {this.renderLinearGradient(linearGradientConfig)}
        {this.renderInnerView()}
      </TouchableOpacity>
    )
  }

  renderLinearGradient(linearGradientConfig) {
    if (!linearGradientConfig) return
    return  (
      <LinearGradient {...linearGradientConfig}
        style={styles.mask} />
    )
  }

  renderInnerView() {
    if (this.state.isLoading) {
      return this.renderIndicator()
    } else {
      return this.props.children
    }
  }

  renderIndicator() {
    const {customIndicator, ignoreIndicator, indicatorConfigs, children} = this.props
    if (ignoreIndicator) {
      return children
    }
    if (customIndicator) {
      return customIndicator
    }
    let indicatorParams = {...defaultIndicatorConfigs ,...indicatorConfigs}
    return (<ActivityIndicator {...indicatorParams}/>)
  }

  onPress = async (e) => {
    const {pressCtrlMode, onPress, delay, loading} = this.props
    let pressHandler = this.pressConfig[pressCtrlMode]
    if (!pressHandler) pressHandler = this.onAsyncPress
    await pressHandler(onPress, e, delay, loading)
  }

  onNormalPress = (onPress, e) => {
    onPress && onPress(e)
  }

  onAsyncPress = async (onPress, e) => {
    if (this.state.isLoading) {
      return
    }
    try {
      this.setState({
        isLoading: true
      })
      onPress && await onPress(e)
    } catch (error) {
      throw error
    } finally {
      this.setState({
        isLoading: false
      })
    }
  }

  onAntiSharePress = async (onPress, e, delay) => {
    if (this.state.isLoading) {
      return
    }
    try {
      this.setState({
        isLoading: true
      })
      await Promise.all([onPress(e), this.timeout(delay)])
    } catch (error) {
      throw error
    } finally {
      this.setState({
        isLoading: false
      })
    }
  }

  onCustomPress = (onPress, e, delay, loading) => {
    if (loading) return
    onPress && onPress(e)
  }

  timeout = (delay = 1000) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, delay)
    })
  }

  genButtonStyle = () => {
    let defaultStyle = {}
    for (let item of Object.keys(this.props)) {
      if (ButtonFlags[item] && ButtonFlags[item].style) {
        defaultStyle = {...defaultStyle,...(ButtonFlags[item].style)}
      }
    }
    return defaultStyle
  }
}

Button.ButtonFlags = ButtonFlags
Button.PressCtrlMode = PressCtrlMode
