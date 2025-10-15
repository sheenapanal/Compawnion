import { View, Text, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';

const { width } = Dimensions.get('window');

const howToData = [
  {
    title: 'Create your pet profile',
    description: 'Add your pet’s name, breed, birthday, and a photo.',
    image: { uri: 'https://i.natgeofe.com/n/12886911-82d7-4254-9cb5-d63a3d6361ec/NationalGeographic_703697_16x9.jpg' },
  },
  {
    title: 'Log skin health updates',
    description: 'Capture changes in your pet’s skin condition and monitor symptoms over time',
    image: { uri: 'https://cdn.shopify.com/s/files/1/0035/1984/0325/files/Welchcorgipembroke_1024x1024.jpg?v=1655987017' },
  },
  {
    title: 'Find veterinarian',
    description: 'Locate nearby veterinary clinics and animal hospitals in your area.',
    image: { uri: 'https://www.toorakrdvetclinic.com.au/wp-content/uploads/2023/08/Challenges-Faced-by-Veterinarian-Practices.jpg' },
  },
];

const HowToUseCarousel = () => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % howToData.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 5000); 

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={howToData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.textBox}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    backgroundColor: 'white'
  },
  
  card: {
    width,
    alignItems: 'center',
  },
  image: {
    width: width * 0.9,
    height: 180,
    borderRadius: 16,
  },
  textBox: {
    width: width * 0.9,
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#475569',
  },
});

export default HowToUseCarousel;
