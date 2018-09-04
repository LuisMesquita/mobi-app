import React from 'react';
import { Image } from 'react-native';

const RoundImage = ({ source, size }) => {
  const style = {
    height: size,
    width: size,
    borderRadius: size / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8
  };  
  return (
      <Image
        style={style}
        source={source}
      />
  );
};

export { RoundImage };
