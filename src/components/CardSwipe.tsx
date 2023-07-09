import {
  View,
  Animated,
  PanResponder,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons'; 

import Card from './Card';
import { data as People } from '../data';

const {width } = Dimensions.get('window');


interface DataItem {
  image: string;
  id: number;
  title: string;
}

const SWIPE_THRESHOLD = 100;

const CardSwipe = () => {
  const [data, setData] = useState<DataItem[]>(People);

  useEffect(() => {
    !data.length && setData(People);
  }, [data]);

  const swipe = useRef<Animated.ValueXY>(new Animated.ValueXY()).current;
  const rotate = useRef<Animated.Value>(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dx, dy }) => {
        swipe.setValue({ x: dx, y: 0 });
      },
      onPanResponderRelease: (_, { dx, dy }) => {
        const direction = Math.sign(dx);
        const isSwipeActive = Math.abs(dx) > SWIPE_THRESHOLD;
      
        if (isSwipeActive) {
          Animated.timing(swipe, {
            toValue: { x: 5 * direction * width, y: dy },
            useNativeDriver: true,
            duration: 400,
          }).start(removeCard);
        } else {
          Animated.spring(swipe, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            friction: 4,
          }).start();
        }
      },
    })
  ).current;

  const removeCard = useCallback(() => {
    setData(prepState => prepState.slice(1));
    swipe.setValue({ x: 0, y: 0 });
  }, [swipe]);

  const handleSelection = useCallback(
    (direction: number) => {
      Animated.timing(swipe, {
        toValue: { x: direction * 500, y: 0 },
        useNativeDriver: true,
        duration: 500,
      }).start(removeCard);
    },
    [removeCard]
  );

  return (
    <View style={{ flex: 1 }}>
      {data
        .map((item, index) => {
          let isFirst = index === 0;
          let dragHandlers = isFirst ? panResponder.panHandlers : {};
          return (
            <Card
              item={item}
              rotate={rotate}
              isFirst={isFirst}
              swipe={swipe}
              {...dragHandlers}
              key={item.id}
            />
          );
        })
        .reverse()}

      <View
        style={{
          width: '100%',
          position: 'absolute',
          height: 100,
          bottom: 0,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            backgroundColor: '#fff',
            elevation: 5,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            handleSelection(-1);
          }}>
          <Ionicons name="md-close-sharp" size={50} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            bottom: 30,
            width: 60,
            height: 60,
            backgroundColor: '#fff',
            elevation: 5,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            handleSelection(1);
          }}>
          <Ionicons name="star" size={40} color="gold" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            backgroundColor: '#fff',
            elevation: 5,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            handleSelection(1);
          }}>
          <Ionicons name="heart" size={40} color="#00FFC8" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CardSwipe;
