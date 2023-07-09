import { View, Text, Dimensions, Image, Animated } from 'react-native';
import React, { useCallback } from 'react';
import { LinearGradient } from "expo-linear-gradient";
import Emotes from './Emotes';

const { height, width } = Dimensions.get('window');

interface CardProps {
  item: {
    id: number;
    image: string;
    title: string;
  };
  rotate: any;
  isFirst: boolean;
  swipe: Animated.ValueXY;
}

const Card: React.FC<CardProps> = ({ item, isFirst, swipe, ...rest }) => {
  const rotate = swipe.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-30deg', '0deg', '30deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = swipe.x.interpolate({
    inputRange: [10, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const rejectOpacity = swipe.x.interpolate({
    inputRange: [-100, -10],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const renderChoice = useCallback(() => {
    return (
      <>
        <Animated.View
          style={[
            { position: 'absolute', top: 100, left: 20 },
            { opacity: likeOpacity },
          ]}
        >
          <Emotes type={'Like'} />
        </Animated.View>
        <Animated.View
          style={[
            { position: 'absolute', top: 100, right: 20 },
            { opacity: rejectOpacity },
          ]}
        >
          <Emotes type={'Nope'} />
        </Animated.View>
      </>
    );
  }, [likeOpacity, rejectOpacity]);

  return (
    <Animated.View
      style={[
        {
          width: width - 20,
          height: height - 200,
          position: 'absolute',
          top: 50,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        },
        isFirst && {
          transform: [
            ...swipe.getTranslateTransform(),
            { rotate: rotate },
            { translateY: swipe.y },
          ],
        },
      ]}
      {...rest}
    >
      <Image
        source={{uri: item.image}}
        style={{ width: '100%', height: '100%', borderRadius: 20, resizeMode: 'cover' }}
      />
      {isFirst && renderChoice()}
      <LinearGradient
        colors={['transparent', 'transparent', 'rgba(0,0,0,0.8)']}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          borderRadius: 20,
        }}
      >
        <Text
          style={{
            position: 'absolute',
            bottom: 20,
            left: 30,
            fontSize: 30,
            color: '#FFF',
          }}
        >
          {item.title}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
};

export default Card;
