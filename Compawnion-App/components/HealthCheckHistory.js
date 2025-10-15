import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';


const healthData = [
  { title: 'Ringworms', image: { uri: 'https://kb.rspca.org.au/wp-content/uploads/2018/11/fungal-lesion-cat-ear.jpg' } },
  { title: 'Dermatitis', image: { uri: 'https://cennutrition.com.au/wp-content/uploads/2021/07/Dermatitis-in-dogs.jpg' } },
  { title: 'Scabies', image: { uri: 'https://media.istockphoto.com/id/1481423640/photo/scabies.jpg?s=612x612&w=0&k=20&c=Sxa_4RnsUAkitY9ngk2EKKU8xlDhi6E8q5MiUnKYAGM=' } },
  { title: 'Fungal Infection', image: { uri: 'https://images.ctfassets.net/nx3pzsky0bc9/7McSDzd7haIqPCVZf8rV85/0b291d385fc759111a3e7c8da50a79a7/Untitled_design-43.jpg?w=804' } },
];

const HealthCheckHistory = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Common skin diseases in the philippines</Text>
      </View>

      <View style={styles.grid}>
        {healthData.map((item, index) => (
          <View key={index} style={styles.cardWrapper}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                if (item.title === 'Ringworms') {
                  router.push('/ringworm');
                }
              }}
            >
              <Image source={item.image} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={styles.label}>Skin</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
container: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAll: {
    color: '#9B1C1C',
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 12,
    shadowColor: '#ffff',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    color: '#1E40AF',
    fontSize: 12,
    marginBottom: 2,
  },
  cardTitle: {
    fontWeight: '500',
    fontSize: 12,
    flexWrap: 'wrap',
  },
});

export default HealthCheckHistory;
