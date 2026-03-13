import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface TypingAnimationProps {
  text: string;
  speed?: number;
  style?: any;
}

export default function TypingAnimation({ text, speed = 100, style }: TypingAnimationProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <View style={styles.container}>
      <Text style={[styles.text, style]}>
        {displayText}
        <Text style={styles.cursor}>|</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
  cursor: {
    color: '#6366f1',
    fontWeight: 'bold',
  },
});
