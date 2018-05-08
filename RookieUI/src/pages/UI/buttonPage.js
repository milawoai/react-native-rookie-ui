/**
 * Created by ygj on 2017/10/30.
 */
import React, { Component } from 'react'
import {
  StyleSheet, Image, View, TouchableOpacity, Text, ScrollView, Animated, Easing
} from 'react-native'
import { px2dp , px2sp} from '../../utils/screenUtils'
import {
  Button
} from 'react-native-rooike-ui'

// import Button from '../../react-native-rooike-ui/widgets/button/baseButton'


import * as commonStyle from '../../commonLib/commonStyle'

class CustomHUD extends React.Component {
  state = {
    rotateAnim: new Animated.Value(0),  // Initial value for opacity: 0
  }

  componentDidMount() {
    this.startAnimation()
  }

  startAnimation = () => {
    this.state.rotateAnim.setValue(0);
    Animated.timing(this.state.rotateAnim, {
      toValue: 360,
      duration: 3000,
      easing: Easing.linear
    }).start(this.startAnimation);// 开始spring动画
  }

  render() {
    let { rotateAnim } = this.state;
    return (
      <Animated.Image style={{width: 40, height: 40, borderRadius: 20,
        transform:[{rotate: rotateAnim
          .interpolate({inputRange: [0, 360],outputRange: ['0deg', '360deg']})
        }]
      }} source={require('../../image/loading.png')}/>
    );
  }
}

class CellItem extends Component {
  render() {
    const {title, buttonInfos} = this.props

    let buttonArea = buttonInfos.map((elem, index) => {
      let key = `${Math.random()}_${index}`
      return (
        <View style={{padding: px2dp(30)}} key={key}>
          {elem}
        </View>
      )
    })
    return (
      <View style = {CellItemStyle.cellContainer}>
        <View style = {CellItemStyle.cellTitleContainer}>
          <Text style={CellItemStyle.cellTitle}>{title}</Text>
        </View>
        <View style={[CellItemStyle.buttonAreaContainer]}>
          {buttonArea}
        </View>
      </View>
    )
  }
}

const asyncFuc = (delay = 1000) => {
  return () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, delay)
    }).then( () => {
      console.warn(`asyncFuc : ${delay}`)
    })
  }
}

const syncFuc = () => {
  return () => console.warn(`syncFuc`)
}

export default class ButtonPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    }

    const Buttons = {
      title: 'Button',
      buttonInfos: [
        (
          <Button center onPress={asyncFuc(2000)} style={{backgroundColor: 'red'}}>
            <Text style={{color: 'white'}}>default</Text>
          </Button>
        )
      ]
    }

    const MultiClickButtons = {
      title: 'MutilClickButtons',
      buttonInfos: [
        (
          <Button onPress={asyncFuc(2000)}
                  pressCtrlMode = {Button.PressCtrlMode.none}
                  linearGradientConfig = {{
                    colors: ['#feb800', '#f9d308'],
                    start: {x: 0.3, y: 0},
                    end: {x: 1, y: 0}
                  }}
          >
            <Text style={{color: 'black'}}>{Button.PressCtrlMode.none}</Text>
          </Button>
        ),
        (
          <Button center onPress={asyncFuc(2000)} style={{backgroundColor: 'yellow'}}
                  indicatorConfigs = {{
                    color: 'black'
                  }}
                  pressCtrlMode = {Button.PressCtrlMode.async}
          >
            <Text style={{color: 'black'}}>{Button.PressCtrlMode.async}</Text>
          </Button>
        ),
        (
          <Button onPress={syncFuc()} style={{backgroundColor: 'yellow'}}
                  indicatorConfigs = {{
                    color: 'black'
                  }}
                  pressCtrlMode = {Button.PressCtrlMode.antiShark}
                  delay = {2000}
          >
            <Text style={{color: 'black'}}>{Button.PressCtrlMode.antiShark}</Text>
          </Button>
        ),
        (
          <Text>{Button.PressCtrlMode.custom} in last section!</Text>
        )
      ]
    }

    const IndicateButtons = {
      title: 'IndicateButtons',
      buttonInfos: [
        (
          <Button onPress={asyncFuc(2000)} style={{backgroundColor: 'green'}} ignoreIndicator>
            <Text style={{color: 'black'}}>ignoreIndicator</Text>
          </Button>
        ),
        (
          <Button onPress={asyncFuc(2000)} activeOpacity={1}
                  style={{backgroundColor: 'green'}}
                  indicatorConfigs = {{
                    animating: true,
                    size: 'large',
                    color: 'black',
                    style: {alignSelf: 'flex-start'}
                  }}>
            <Text>indicatorConfigs</Text>
          </Button>
        ),
        (
          <Button onPress={asyncFuc(2000)} activeOpacity={1}
                  style={{backgroundColor: 'green'}}
                  customIndicator={<CustomHUD />}>
            <Text>customIndicator</Text>
          </Button>
        )
      ]
    }

    const DisableButtons = {
      title: 'IndicateButtons',
      buttonInfos: [
        (
          <Button onPress={asyncFuc(2000)} style={{backgroundColor: '#991488'}} disabled>
            <Text style={{color: 'white'}}>ignoreIndicator</Text>
          </Button>
        ),
        (
          <Button onPress={asyncFuc(2000)} activeOpacity={1}
                  style={{backgroundColor: 'green'}}
                  indicatorConfigs = {{
                    animating: true,
                    size: 'large',
                    color: 'black',
                    style: {alignSelf: 'flex-start'}
                  }}>
            <Text>indicatorConfigs</Text>
          </Button>
        ),
        (
          <Button onPress={asyncFuc(2000)} activeOpacity={1}
                  style={{backgroundColor: 'green'}}
                  customIndicator={<CustomHUD />}>
            <Text>customIndicator</Text>
          </Button>
        )
      ]
    }

    this.modalApis = [
      Buttons,
      MultiClickButtons,
      IndicateButtons
    ]
  }

  render() {
    let cells = this.modalApis.map((elem, index) => {
      return (
        <CellItem title = {elem.title}
                  buttonInfos = {elem.buttonInfos}
                  key={`modalApis_${index}`} />
      )
    })
    return (
      <ScrollView>
        {cells}

        <View style = {CellItemStyle.cellContainer}>
          <View style = {CellItemStyle.cellTitleContainer}>
            <Text style={CellItemStyle.cellTitle}>{'special control'}</Text>
          </View>
          <View style={[CellItemStyle.buttonAreaContainer]}>
            <Button onPress={this.innerAsync} style={{backgroundColor: 'yellow'}}
                    indicatorConfigs = {{
                      color: 'black',
                    }}
                    pressCtrlMode = {Button.PressCtrlMode.custom}
                    loading = {this.state.loading}
            >
              <Text style={{color: 'black'}}>{Button.PressCtrlMode.custom}</Text>
            </Button>
          </View>
        </View>

      </ScrollView>
    )
  }

  innerAsync = () => {
    this.setState({
      loading: true
    }, () => {
      console.warn(`button block`)
    })
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 2000)
    }).then( () => {
      console.warn(`innerAsync : ${2000}`)
      this.setState({
        loading: false
      }, () => {
        console.warn(`button can click`)
      })
    })
  }
}

const CellItemStyle = {
  cellContainer: {
    paddingBottom: px2dp(20)
  },
  cellTitleContainer: {
    backgroundColor: '#C0C0C0',
    height: px2dp(100),
    justifyContent: 'center',
    paddingLeft: px2dp(20),
    alignSelf: 'stretch'
  },
  cellTitle: {
    fontSize: px2sp(30)
  },
  buttonAreaContainer: {
    padding: px2dp(20),
    alignSelf: 'stretch'
  },
  buttonContainer: {
    backgroundColor: 'white',
    borderRadius: px2dp(10),
    margin: px2dp(10),
    padding: px2dp(20)
  },
  buttonText: {
    fontSize: px2sp(30)
  }
}