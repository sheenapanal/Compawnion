import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

const ClinicMap = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 51.045,
    longitude: -114.072,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const mapRef = useRef(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission',
          'Enable location for better results. Using default location.',
          [{ text: 'OK' }]
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setUserLocation(userCoords);
      setMapRegion({
        ...userCoords,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      
      searchVeterinaryClinics('veterinary clinic', userCoords);
    } catch (error) {
      console.error('Location error:', error);
    }
  };

  // Geocoding function to convert address to coordinates
  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // OpenStreetMap search
  const searchWithOSM = async (searchQuery, location) => {
    try {
      const url = `https://overpass-api.de/api/interpreter?data=[out:json];node[amenity=veterinary](${location.latitude-0.05},${location.longitude-0.05},${location.latitude+0.05},${location.longitude+0.05});out;`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.elements && data.elements.length > 0) {
        const clinics = data.elements.map((place, index) => ({
          id: place.id || `clinic-${index}`,
          name: place.tags?.name || 'Veterinary Clinic',
          address: place.tags?.['addr:street'] || 'Address not available',
          coordinate: {
            latitude: place.lat,
            longitude: place.lon,
          },
          rating: (Math.random() * 1 + 4).toFixed(1), 
          open: Math.random() > 0.3, 
          phone: '(555) 123-4567', 
        }));

        return clinics;
      }
    } catch (error) {
      console.error('OSM Search error:', error);
    }
    return [];
  };

 
  const generateMockClinics = (location, count = 10) => {
    const clinics = [];
    for (let i = 0; i < count; i++) {
      clinics.push({
        id: `mock-clinic-${i}`,
        name: `Animal Hospital ${i + 1}`,
        address: `${Math.floor(Math.random() * 1000) + 1} Main St`,
        coordinate: {
          latitude: location.latitude + (Math.random() - 0.5) * 0.02,
          longitude: location.longitude + (Math.random() - 0.5) * 0.02,
        },
        rating: (Math.random() * 1 + 4).toFixed(1),
        open: Math.random() > 0.3,
        phone: `(555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      });
    }
    return clinics;
  };

  const searchVeterinaryClinics = async (searchQuery = 'veterinary clinic', location = userLocation) => {
    if (!location) return;

    setIsLoading(true);
    
    try {
      let clinics = [];

      clinics = await searchWithOSM(searchQuery, location);
      
      if (clinics.length === 0) {
        clinics = generateMockClinics(location);
      }

      setSearchResults(clinics);
      if (clinics.length > 0) {
        setSelectedClinic(clinics[0]);
        
        const newRegion = {
          latitude: clinics[0].coordinate.latitude,
          longitude: clinics[0].coordinate.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setMapRegion(newRegion);
      }
    } catch (error) {
      console.error('Search error:', error);
      
      const mockClinics = generateMockClinics(location);
      setSearchResults(mockClinics);
      if (mockClinics.length > 0) {
        setSelectedClinic(mockClinics[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (text) => {
    setQuery(text);
    
    if (text.length < 2) {
      setSearchResults([]);
      return;
    }

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
      
      const isLocationQuery = text.split(',').length > 1 || text.split(' ').length > 2;
      
      if (isLocationQuery) {
        
        const locationCoords = await geocodeAddress(text);
        if (locationCoords) {
          
          const newRegion = {
            ...locationCoords,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          };
          setMapRegion(newRegion);
          mapRef.current?.animateToRegion(newRegion, 1000);
          
          
          searchVeterinaryClinics('veterinary clinic', locationCoords);
        } else {
          Alert.alert('Location Not Found', 'Please try a different location name.');
        }
      } else {
        
        searchVeterinaryClinics(text, mapRegion);
      }
    }, 800);
  };

  let searchTimeout;

  const selectClinic = (clinic) => {
    setSelectedClinic(clinic);
    setSearchResults([]);
    setQuery('');

    const newRegion = {
      latitude: clinic.coordinate.latitude,
      longitude: clinic.coordinate.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };

    setMapRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 1000);
  };

  const focusOnUserLocation = () => {
    if (userLocation) {
      const newRegion = {
        ...userLocation,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setMapRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
      searchVeterinaryClinics('veterinary clinic', userLocation);
    }
  };

  const searchForLocation = async () => {
    if (query.trim().length === 0) return;

    setIsLoading(true);
    try {
      const locationCoords = await geocodeAddress(query);
      if (locationCoords) {
        const newRegion = {
          ...locationCoords,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setMapRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
        
        
        await searchVeterinaryClinics('veterinary clinic', locationCoords);
      } else {
        Alert.alert('Location Not Found', 'Please try a different location name or address.');
      }
    } catch (error) {
      console.error('Location search error:', error);
      Alert.alert('Error', 'Failed to search for location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDirections = async (clinic) => {
    if (!clinic?.coordinate) return;

    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${clinic.coordinate.latitude},${clinic.coordinate.longitude}`,
      android: `google.navigation:q=${clinic.coordinate.latitude},${clinic.coordinate.longitude}`,
    });

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open maps application');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open directions');
    }
  };

  const callClinic = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderClinicItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.clinicItem,
        selectedClinic?.id === item.id && styles.selectedClinicItem
      ]} 
      onPress={() => selectClinic(item)}
    >
      <View style={styles.clinicHeader}>
        <Text style={styles.clinicName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
      </View>
      
      <Text style={styles.clinicAddress} numberOfLines={2}>{item.address}</Text>
      
      <View style={styles.clinicFooter}>
        <View style={[styles.statusIndicator, item.open ? styles.open : styles.closed]}>
          <Text style={styles.statusText}>
            {item.open ? 'OPEN NOW' : 'CLOSED'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => callClinic(item.phone)}>
          <Text style={styles.phoneText}>{item.phone}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef}
        style={styles.map} 
        region={mapRegion}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={!!userLocation}
        showsMyLocationButton={false}
      >
        {searchResults.map((clinic) => (
          <Marker
            key={clinic.id}
            coordinate={clinic.coordinate}
            onPress={() => selectClinic(clinic)}
          >
            <View style={[
              styles.markerContainer,
              selectedClinic?.id === clinic.id && styles.selectedMarker
            ]}>
              <FontAwesome5 
                name="clinic-medical" 
                size={20} 
                color={selectedClinic?.id === clinic.id ? "#FFFFFF" : "#A04747"} 
              />
            </View>
          </Marker>
        ))}
        
        {selectedClinic && (
          <Marker coordinate={selectedClinic.coordinate}>
            <Callout tooltip>
              <View style={styles.customCalloutContainer}>
                <View style={styles.calloutContent}>
                  <Text style={styles.calloutTitle}>{selectedClinic.name}</Text>
                  
                  <View style={styles.calloutBody}>
                    <Text style={styles.calloutAddress}>{selectedClinic.address}</Text>
                    
                    <View style={styles.calloutFooter}>
                      <View style={styles.ratingContainer}>
                        <MaterialIcons name="star" size={14} color="#FFD700" />
                        <Text style={styles.calloutRating}>{selectedClinic.rating}</Text>
                      </View>
                      
                      <View style={[styles.statusIndicator, selectedClinic.open ? styles.open : styles.closed]}>
                        <Text style={styles.statusText}>
                          {selectedClinic.open ? 'OPEN' : 'CLOSED'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.calloutActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => callClinic(selectedClinic.phone)}
                    >
                      <MaterialIcons name="phone" size={16} color="#FFFFFF" />
                      <Text style={styles.actionText}>CALL</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.directionsButton]}
                      onPress={() => getDirections(selectedClinic)}
                    >
                      <MaterialIcons name="directions" size={16} color="#FFFFFF" />
                      <Text style={styles.actionText}>DIRECTIONS</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.calloutArrow} />
              </View>
            </Callout>
          </Marker>
        )}
      </MapView>

      {/* Search Box */}
      <View style={styles.searchBox}>
        <MaterialIcons name="search" size={20} color="#666" />
        <TextInput
          placeholder="Search location or veterinary clinics..."
          style={styles.searchInput}
          value={query}
          onChangeText={handleSearch}
          returnKeyType="search"
          onSubmitEditing={searchForLocation}
        />
        <View style={styles.searchButtons}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#A04747" />
          ) : (
            <>
              <TouchableOpacity onPress={searchForLocation} style={styles.searchButton}>
                <MaterialIcons name="search" size={20} color="#A04747" />
              </TouchableOpacity>
              <TouchableOpacity onPress={focusOnUserLocation} style={styles.locationButton}>
                <MaterialIcons name="my-location" size={20} color="#A04747" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Results List */}
      {searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              {searchResults.length} Veterinary Clinics Found
            </Text>
          </View>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={renderClinicItem}
            showsVerticalScrollIndicator={false}
            style={styles.resultsList}
            contentContainerStyle={styles.resultsContent}
          />
        </View>
      )}

      {/* Loading State */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A04747" />
          <Text style={styles.loadingText}>Searching for clinics...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  searchBox: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  searchButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    marginLeft: 10,
    padding: 4,
  },
  locationButton: {
    marginLeft: 8,
    padding: 4,
  },
  markerContainer: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#A04747',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedMarker: {
    backgroundColor: '#A04747',
    transform: [{ scale: 1.1 }],
  },
  
  resultsContainer: {
    position: 'absolute',
    top: '50%', 
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    maxHeight: height * 0.4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ translateY: -height * 0.2 }],
  },
  resultsHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    padding: 16,
    textAlign: 'center',
  },
  resultsList: {
    borderRadius: 15,
  },
  resultsContent: {
    paddingBottom: 10,
  },
  clinicItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedClinicItem: {
    backgroundColor: '#f9f9f9',
    borderLeftWidth: 4,
    borderLeftColor: '#A04747',
  },
  clinicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  clinicAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  clinicFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  open: {
    backgroundColor: '#E8F5E8',
  },
  closed: {
    backgroundColor: '#FFE8E8',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  phoneText: {
    fontSize: 12,
    color: '#A04747',
    fontWeight: '600',
  },
  customCalloutContainer: {
    alignItems: 'center',
  },
  calloutContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  calloutBody: {
    marginBottom: 12,
  },
  calloutAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  calloutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calloutRating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  calloutActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A04747',
    paddingVertical: 8,
    borderRadius: 6,
  },
  directionsButton: {
    backgroundColor: '#333',
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 12,
  },
  calloutArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    transform: [{ translateY: -50 }],
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});

export default ClinicMap;