/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MapView from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = -13.5281034;
const LONGITUDE = -71.9465414;
const LATITUDE_DELTA = 0.0043;
const LONGITUDE_DELTA = 0.0034;
const SPACE = 0.01;
export default class MapsPrueba2 extends Component {
  constructor(props){
    super(props)
    this.state = {
      initialPosition:{
        latitude:0,
        longitude:0,
        latitudeDelta:0,
        longitudeDelta:0,
      },
      markerPosition:{
        latitude:0,
        longitude:0,
      }
    }
  }


  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var lat=parseFloat(position.coords.latitude)
        var long=parseFloat(position.coords.longitude)
        var initialRegion = {
          latitude: lat,
          longitude: long,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }
        this.setState({initialPosition:initialRegion});
        this.setState({markerPosition:initialRegion});
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lat=parseFloat(position.coords.latitude)
      var long=parseFloat(position.coords.longitude)
      var initialRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
      this.setState({initialPosition:initialRegion});
      this.setState({markerPosition:initialRegion});
    });
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  takeSnapshot() {
    const snapshot = this.map.takeSnapshot({
      width: 300,      // optional, when omitted the view-width is used
      height: 300,     // optional, when omitted the view-height is used
      //region: {..},    // iOS only, optional region to render
      format: 'png',   // image formats: 'png', 'jpg' (default: 'png')
      quality: 0.8,    // image quality: 0..1 (only relevant for jpg, default: 1)
      result: 'file'   // result types: 'file', 'base64' (default: 'file')
    });
    snapshot.then((uri) => {
      this.setState({ mapSnapshot: uri });
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <MapView
          showsUserLocation={true}
          zoomEnabled={true}
          showsMyLocationButton={true}
          provider={this.props.provider}
          ref={ref => { this.map = ref; }}
          style={styles.map}
          region={this.state.initialPosition}
          
        >
          <MapView.Marker
            coordinate={this.state.markerPosition}
          />

        </MapView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.takeSnapshot()}
            style={[styles.bubble, styles.button]}
          >
            <Text>Take snapshot</Text>
          </TouchableOpacity>
        </View>
        {this.state.mapSnapshot &&
          <TouchableOpacity
            style={[styles.container, styles.overlay]}
            onPress={() => this.setState({ mapSnapshot: null })}
          >
            <Image

              source={{ uri: this.state.mapSnapshot }}
              style={{ width: 300, height: 300 }}
            />
          </TouchableOpacity>
        }
      </View>
    );
  }
}

MapsPrueba2.propTypes = {
  provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  button: {
    width: 140,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
});

AppRegistry.registerComponent('MapsPrueba2', () => MapsPrueba2);
