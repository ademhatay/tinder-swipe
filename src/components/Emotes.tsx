import { View, Text } from 'react-native';
import React from 'react';

import { Ionicons } from '@expo/vector-icons'; 

interface EmotesProps {
  type: 'Like' | 'Nope';
}

const Emotes: React.FC<EmotesProps> = ({ type }) => {
  return (
    <View>
      <Text
        style={{
          fontSize: 40,
          textTransform: 'uppercase',
          letterSpacing: 4,
          fontWeight: 'bold',
          padding: 5,
          borderRadius: 50,
          backgroundColor: '#fff',
          transform: [{ rotate: type === 'Like' ? '-20deg' : '20deg' }],
        }}
      >
        {
          type === 'Like' ? (
            <Ionicons name="ios-heart" size={50} color="#00eda6" />
          ) : (
            <Ionicons name="ios-close" size={50} color="#FF0060" />
          )
        }
      </Text>
    </View>
  );
};

export default Emotes;
