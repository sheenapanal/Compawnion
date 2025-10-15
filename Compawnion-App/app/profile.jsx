import { SafeAreaView, StyleSheet, View, Text } from 'react-native';

export default function Profile() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Placeholder */}
        <Text style={styles.text}>Profile Page</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, color: '#333' },
});
