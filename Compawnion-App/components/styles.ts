// Camera styles with improved text justification
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  camera: { 
    flex: 1 
  },
  backButton: {
    position: 'absolute', 
    top: 50, 
    left: 20, 
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)', 
    padding: 8, 
    borderRadius: 20,
  },
  flashButton: {
    position: 'absolute', 
    top: 50, 
    right: 20, 
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)', 
    padding: 8, 
    borderRadius: 20,
  },
  petTypeContainer: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    zIndex: 10,
  },
  petTypeLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
  },
  inactivePetType: {
    color: '#ccc',
  },
  petSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  headerTextContainer: {
    position: 'absolute', 
    top: 50, 
    left: 0, 
    right: 0, 
    alignItems: 'center', 
    zIndex: 5,
  },
  headerText: {
    color: 'white', 
    fontSize: 15, 
    fontWeight: '600',
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12,
  },
  loadingText: {
    color: '#ff9800',
    fontSize: 12,
    marginTop: 5,
  },
  bottomControls: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'flex-end',
    justifyContent: 'space-around', 
    paddingBottom: 30,
  },
  iconButton: {
    width: 80, 
    height: 80, 
    borderRadius: 30,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  shutterButton: {
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    borderWidth: 6,
    borderColor: 'white', 
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: 'rgba(200, 200, 200, 0.82)',
  },
  buttonLoader: {
    position: 'absolute',
  },
  // Processing overlay styles
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  processingText: {
    color: '#ff9800',
    fontSize: 16,
    marginTop: 15,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  resultOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  resultCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: '70%',
  },
  resultTitle: {
    fontSize: 16, 
    color: 'green', 
    marginBottom: 8, 
    fontWeight: '600',
  },
  resultLabel: {
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 4,
  },
  confidence: {
    fontSize: 16, 
    color: '#888',
  },
  confidenceMessage: {
    color: '#cc0000',
    marginTop: 5,
    marginBottom: 10,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'justify',
    lineHeight: 18,
    letterSpacing: 0.2,
    paddingHorizontal: 4,
  },
  tagContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  tag: {
    backgroundColor: '#eee', 
    color: '#333',
    paddingHorizontal: 10, 
    paddingVertical: 4,
    borderRadius: 12, 
    marginRight: 6, 
    marginBottom: 6,
    fontSize: 12,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'left',
  },
  resultDescription: {
    fontSize: 13, 
    marginBottom: 10,
    textAlign: 'justify',
    lineHeight: 19,
    letterSpacing: 0.2,
    width: 300,
  },
  infoGrid: {
    marginVertical: 10,
  },
  infoItem: {
    fontSize: 12.5, 
    marginBottom: 8,
    textAlign: 'justify',
    lineHeight: 19,
    letterSpacing: 0.2,
    width: 300
  },
  saveButton: {
    backgroundColor: '#a62c2c', 
    paddingVertical: 12,
    borderRadius: 10, 
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white', 
    textAlign: 'center', 
    fontWeight: 'bold',
  },
  readMoreLink: {
    color: '#a62c2c',
    marginTop: 2,
    fontWeight: 'bold',
  },
  infoLabelBold: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#222',
  },
  additionalNote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#777',
    marginTop: 4,
    marginBottom: 4,
    textAlign: 'justify',
    lineHeight: 16,
    letterSpacing: 0.1,
    paddingHorizontal: 2,
  },
  infoLabelNormal: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
  },
  //updated
  allPredictionsContainer: {
    marginTop: 15,
    marginBottom: 10,
    width: '100%',
  },
  otherPredictionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  otherPredictionLabel: {
    fontSize: 14,
    color: '#666',
  },
  otherPredictionConfidence: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888',
  },
  topPredictionLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  topPredictionConfidence: {
    fontWeight: 'bold',
    color: '#a62c2c',
  },
  totalPercentageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalPercentageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  totalPercentageValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#a62c2c',
  },
  //
  // Image preview styles
  imagePreviewCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },

  imagePreviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },

  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
  },

  previewInstructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
    lineHeight: 18,
    letterSpacing: 0.1,
  },

  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },

  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 8,
  },

  retakeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },

  scanButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a62c2c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
  },

  scanButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },

  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#000',
  },

  // Not Pet Skin Result Modal Styles
  notPetSkinHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 10,
  },

  notPetSkinTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff6b35',
  },

  notPetSkinMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'justify',
    marginBottom: 20,
    lineHeight: 22,
    letterSpacing: 0.2,
    paddingHorizontal: 4,
  },

  notPetSkinTipsList: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },

  tipText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    lineHeight: 18,
    textAlign: 'justify',
    letterSpacing: 0.1,
    paddingLeft: 4,
  },

  notPetSkinAdvice: {
    fontSize: 14,
    color: '#666',
    textAlign: 'justify',
    fontStyle: 'italic',
    marginBottom: 25,
    lineHeight: 20,
    paddingHorizontal: 10,
    letterSpacing: 0.2,
  },

  tryAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6b35',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  tryAgainButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Additional helper styles for better text formatting
  textContainer: {
    paddingHorizontal: 4,
  },

  justifiedParagraph: {
    textAlign: 'justify',
    lineHeight: 18,
    letterSpacing: 0.2,
    marginBottom: 10,
    paddingHorizontal: 2,
  },

  centeredImportant: {
    textAlign: 'center',
    fontWeight: '600',
    marginVertical: 8,
  },

  leftAlignedHeader: {
    textAlign: 'left',
    fontWeight: 'bold',
    marginBottom: 6,
  },
});

export default styles;