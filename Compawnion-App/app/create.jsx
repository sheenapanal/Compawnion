import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import ColorList from '../components/ColorList'
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Create = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const historyData = await AsyncStorage.getItem('scanHistory');
      if (historyData) {
        setHistoryItems(JSON.parse(historyData));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('scanHistory');
      setHistoryItems([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const getConditionIcon = (condition) => {
    if (condition.includes('Healthy') || condition.includes('Health')) {
      return <MaterialIcons name="check-circle" size={24} color="#4CAF50" />;
    } else if (condition.includes('Flea') || condition.includes('Allergy')) {
      return <FontAwesome5 name="bug" size={20} color="#FF9800" />;
    } else if (condition.includes('Fungal') || condition.includes('Ringworm')) {
      return <FontAwesome5 name="disease" size={20} color="#E91E63" />;
    } else if (condition.includes('Scabies') || condition.includes('demodicosis')) {
      return <FontAwesome5 name="bacteria" size={20} color="#9C27B0" />;
    } else {
      return <MaterialIcons name="healing" size={22} color="#2196F3" />;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence > 80) return '#4CAF50';
    if (confidence > 60) return '#FFC107';
    if (confidence > 40) return '#FF9800';
    return '#F44336';
  };

  const renderHistoryItem = ({ item, index }) => {
    const formattedDate = new Date(item.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    const formattedTime = new Date(item.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return (
      <TouchableOpacity style={styles.historyItem}>
        <View style={styles.iconContainer}>
          {getConditionIcon(item.condition)}
        </View>
        <View style={styles.historyItemContent}>
          <Text style={styles.conditionName}>{item.condition.replace('_', ' ')}</Text>
          <Text style={styles.historyItemMeta}>
            <Text style={styles.speciesText}>
              {item.species === 'dog' ? '🐕 Dog' : '🐱 Cat'}
            </Text>
            {' • '}
            {formattedDate} at {formattedTime}
          </Text>
        </View>
        <View style={styles.confidenceContainer}>
          <Text style={[
            styles.confidenceText, 
            { color: getConfidenceColor(item.confidence) }
          ]}>
            {item.confidence}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health History</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={handleRefresh}
            disabled={refreshing || loading}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="#a62c2c" />
            ) : (
              <Ionicons name="refresh" size={20} color="#a62c2c" />
            )}
          </TouchableOpacity>
          
          {historyItems.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.emptyState}>
          <Text>Loading history...</Text>
        </View>
      ) : historyItems.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="history" size={64} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No History Yet</Text>
          <Text style={styles.emptyStateText}>
            Scan your pet's skin condition to start building your health history
          </Text>
        </View>
      ) : (
        <FlatList
          data={historyItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderHistoryItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ColorList color="#ffffff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#a62c2c',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  list: {
    paddingBottom: 100,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyItemContent: {
    flex: 1,
  },
  conditionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  historyItemMeta: {
    fontSize: 14,
    color: '#666',
  },
  speciesText: {
    fontWeight: '500',
  },
  confidenceContainer: {
    minWidth: 50,
    alignItems: 'flex-end',
  },
  confidenceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, 
  },
  
});

export default Create;