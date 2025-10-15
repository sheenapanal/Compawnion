import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';

const HowToUse = () => {
  const [expandedSteps, setExpandedSteps] = React.useState({});
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleStep = (id) => {
    setExpandedSteps(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const steps = [
    {
      id: '1',
      icon: 'user',
      title: 'Prepare Your Pet',
      details: [
        'Keep your dog or cat calm and comfortable',
        'Choose a well-lit area with natural light for clearer photos',
        'Make sure the pet is in a relaxed position',
      ],
      color: '#a04747',
    },
    {
      id: '2',
      icon: 'camera',
      title: 'Capture Clear Photos',
      details: [
        'Focus closely on the affected skin area (rash, patch, redness, or hair loss)',
        'Take 2-3 photos from different angles for better accuracy',
        'Ensure the area is clearly visible and in focus',
      ],
      color: '#a04747',
    },
    {
      id: '3',
      icon: 'cpu',
      title: 'AI Analysis',
      details: [
        'Upload or capture photos directly in the app',
        'Our machine learning model (CNN) analyzes the images',
        'Get instant results within seconds',
      ],
      color: '#a04747',
    },
    {
      id: '4',
      icon: 'file-text',
      title: 'Review Results',
      details: [
        'View predicted skin condition with confidence score',
        'Read detailed descriptions and common symptoms',
        'Access suggested care tips and recommendations',
      ],
      color: '#a04747',
    },
    {
      id: '5',
      icon: 'activity',
      title: 'Take Action',
      details: [
        'For mild cases: Follow the provided care advice',
        'Monitor your pet\'s condition regularly',
        'For serious concerns: Contact a veterinarian immediately',
      ],
      color: '#a04747',
    },
  ];

  return (
    <Animated.ScrollView style={[styles.container, { opacity: fadeAnim }]} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Feather name="help-circle" size={28} color="#A04747" />
        </View>
        <Text style={styles.heading}>How to Use Compawnion</Text>
        <Text style={styles.subheading}>
          Follow these simple steps to get the most accurate results for your pet's skin health
        </Text>
      </View>

      {/* Steps Section */}
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <TouchableOpacity 
            key={step.id} 
            style={[
              styles.stepCard,
              { borderLeftColor: step.color, borderLeftWidth: 4 }
            ]}
            onPress={() => toggleStep(step.id)}
            activeOpacity={0.7}
          >
            <View style={styles.stepHeader}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.stepContent}>
                <View style={styles.stepTitleRow}>
                  <Feather name={step.icon} size={20} color={step.color} />
                  <Text style={styles.stepTitle}>{step.title}</Text>
                </View>
                <Feather 
                  name={expandedSteps[step.id] ? "chevron-up" : "chevron-down"} 
                  size={18} 
                  color="#64748B" 
                />
              </View>
            </View>
            
            {(expandedSteps[step.id] || index === 0) && (
              <View style={styles.detailsContainer}>
                {step.details.map((detail, idx) => (
                  <View key={idx} style={styles.detailRow}>
                    <View style={[styles.bullet, { backgroundColor: step.color }]} />
                    <Text style={styles.detailText}>{detail}</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Important Reminders */}
      <View style={styles.reminderSection}>
        <View style={styles.sectionHeader}>
          <Feather name="alert-triangle" size={20} color="#A04747" />
          <Text style={styles.sectionTitle}>Important Reminders</Text>
        </View>
        
        <View style={styles.reminderGrid}>
          <View style={styles.reminderItem}>
            <View style={[styles.reminderIcon, { backgroundColor: '#fff' }]}>
              <Feather name="shield" size={16} color="#a04747" />
            </View>
            <Text style={styles.reminderItemText}>
              Early detection tool, not a replacement for professional care
            </Text>
          </View>
          
          <View style={styles.reminderItem}>
            <View style={[styles.reminderIcon, { backgroundColor: '#fff' }]}>
              <Feather name="heart" size={16} color="#a04747" />
            </View>
            <Text style={styles.reminderItemText}>
              Always consult a veterinarian for serious conditions
            </Text>
          </View>
          
          <View style={styles.reminderItem}>
            <View style={[styles.reminderIcon, { backgroundColor: '#fff' }]}>
              <Feather name="camera" size={16} color="#a04747" />
            </View>
            <Text style={styles.reminderItemText}>
              Photo quality affects analysis accuracy
            </Text>
          </View>
        </View>
      </View>

      {/* Terms & Conditions */}
      <View style={styles.termsSection}>
        <View style={styles.sectionHeader}>
          <Feather name="file-text" size={20} color="#A04747" />
          <Text style={styles.sectionTitle}>Terms & Conditions</Text>
        </View>

        <View style={styles.termsCard}>
          <Text style={styles.termsParagraph}>
            The "Compawnion" Application and its related services are designed for informational and educational purposes only. While the information provided may support the general care and wellness of your pets, it does not constitute medical advice, diagnosis, or treatment.
          </Text>
          
          <Text style={styles.termsParagraph}>
            This application is not a substitute for professional veterinary care. It does not replace consultations, diagnoses, or medical opinions provided by licensed veterinarians. Regular veterinary checkups remain essential for your pet's health.
          </Text>
          
          <Text style={styles.termsParagraph}>
            The app does not function as a medical device, and its findings should not be used for critical or emergency decisions. Users are encouraged to contact a qualified veterinarian for all medical concerns, questions about specific conditions, or if any emergency arises.
          </Text>
          
          <View style={styles.additionalNote}>
            <Text style={styles.additionalNoteTitle}>Additional Note:</Text>
            <Text style={styles.additionalNoteText}>
              Even when photographing the same pet, results for abnormal skin signs may vary depending on the lighting, angle, image quality, and environmental conditions. For accurate evaluation, always consult a licensed veterinary professional.
            </Text>
          </View>
        </View>
      </View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EEF8EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  stepsContainer: {
    marginBottom: 24,
  },
  stepCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF8EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  stepContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 10,
    flex: 1,
  },
  detailsContainer: {
    marginTop: 12,
    paddingLeft: 44,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    marginRight: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    flex: 1,
  },
  reminderSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 8,
  },
  reminderGrid: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#EEF8EE',
    borderRadius: 12,
  },
  reminderIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reminderItemText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    flex: 1,
    fontWeight: '500',
  },
  termsSection: {
    marginBottom: 32,
  },
  termsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    textAlign: 'justify',
    marginBottom: 50
  },
  termsParagraph: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'left',
  },
  additionalNote: {
    marginTop: 8,
    padding: 16,
    backgroundColor: '#EEF8EE',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#a04747',
  },
  additionalNoteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  additionalNoteText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
});

export default HowToUse;