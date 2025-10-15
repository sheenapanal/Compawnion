import { AntDesign, Ionicons, FontAwesome, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions, FlashMode } from 'expo-camera';
import { useRef, useState, useEffect } from 'react';
import { Button, Text, TouchableOpacity, View, Modal, ScrollView, ActivityIndicator, Switch, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as jpeg from 'jpeg-js';
import * as diseaseInfoModule from '../assets/diseaseInfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import styles from '../components/styles';

type CustomModel = tf.LayersModel;


const diseaseInfo: any =
  (diseaseInfoModule as any).diseaseInfo ??
  (diseaseInfoModule as any).default ??
  diseaseInfoModule;

interface CapturedPhoto {
  uri: string;
  base64?: string;
}


const INPUT_SIZE = 224;
const NOT_PET_CONFIDENCE_GATE = 75; 
const EPS = 1e-6;

// ---- Preprocessing types & helpers ----
type Preproc = 'raw' | 'zeroToOne' | 'minusOneToOne';

const normalizeZeroToOne = (floatRgb: tf.Tensor3D) => floatRgb.div(255);
const normalizeMinus1to1 = (floatRgb: tf.Tensor3D) => floatRgb.div(127.5).sub(1);

const applyPreproc = (mode: Preproc, floatRgb: tf.Tensor3D) => {
  if (mode === 'zeroToOne') return normalizeZeroToOne(floatRgb);
  if (mode === 'minusOneToOne') return normalizeMinus1to1(floatRgb);
  return floatRgb; 
};

const inferPreproc = (model: tf.LayersModel): Preproc => {
  try {
    const first = model.layers?.[0];
    const name = (first?.name || '').toLowerCase();
    if (name.includes('rescaling') || name.includes('normalization')) {
      const cfg: any = (first as any).getConfig?.() || {};
      const scale = cfg.scale ?? undefined;
      const offset = cfg.offset ?? 0;
      // Common Keras:
      // Rescaling(1/255) -> scale≈0.0039216, offset=0
      // Rescaling(1/127.5, offset=-1) -> scale≈0.0078431, offset=-1
      if (typeof scale === 'number') {
        const is255 = Math.abs(scale - 1/255) < 1e-6 && Math.abs(offset) < 1e-6;
        const is127 = Math.abs(scale - 1/127.5) < 1e-4 && Math.abs(offset + 1) < 1e-3;
        if (is255 || is127) return 'raw';
      }
      return 'raw';
    }
  } catch {}
  return 'minusOneToOne';
};

// Center-crop to the largest square before resizing
const centerCropSquare = (img: tf.Tensor3D) => {
  const [h, w] = img.shape as [number, number, number?];
  const side = Math.min(h, w);
  const top = Math.floor((h - side) / 2);
  const left = Math.floor((w - side) / 2);
  return img.slice([top, left, 0], [side, side, 3]); // [side, side, 3]
};

// ---- diseaseInfo key matching helpers ----
const normKey = (s: string) =>
  s.toLowerCase()
   .replace(/[_-]+/g, ' ')          
   .replace(/[^a-z0-9 ]+/g, '')     
   .replace(/\s+/g, ' ')            
   .trim();

const findDiseaseEntry = (petType: 'dog' | 'cat', label: string) => {
  const bucket = (diseaseInfo as any)?.[petType] ?? {};
  const entries = Object.entries(bucket) as Array<[string, any]>;
  if (!entries.length) return null;

  const candidates = [
    label,
    label.replace(/_/g, ' '),
    label.replace(/_/g, '-'),
  ];
  const normCandidates = candidates.map(normKey);

  // exact normalized key match
  let exact = entries.find(([k]) => normCandidates.includes(normKey(k)));
  if (exact) return { key: exact[0], value: exact[1] };

  // fallback: contains/overlap match
  const labelNorm = normKey(label);
  const normEntries = entries.map(([k, v]) => [normKey(k), k, v] as [string, string, any]);
  const fuzzy = normEntries.find(([nk]) => nk.includes(labelNorm) || labelNorm.includes(nk));
  return fuzzy ? { key: fuzzy[1], value: fuzzy[2] } : null;
};

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const router = useRouter();

  const [isPetDog, setIsPetDog] = useState(true);

  // Image preview & scanning
  const [capturedPhoto, setCapturedPhoto] = useState<CapturedPhoto | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);

  // Hardcoded class labels (must match training order exactly)
  const dogLabelsRef = useRef<string[]>([
    "Fungal_Infection",
    "Healthy",
    "Demodicosis",
    "Ringworm",
    "Hypersensitivity",
    "Dermatitis",
    "Not_pet_skin"
  ]);

  const catLabelsRef = useRef<string[]>([
    "Scabies",
    "Ringworm",
    "Healthy",
    "Flea_Allergy",
    "Not_pet_skin"
  ]);

  const [predictionLabel, setPredictionLabel] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [allPredictions, setAllPredictions] = useState<Array<{label: string, confidence: number}>>([]);
  const [dogModel, setDogModel] = useState<CustomModel | null>(null);
  const [catModel, setCatModel] = useState<CustomModel | null>(null);
  const [dogPreproc, setDogPreproc] = useState<Preproc>('minusOneToOne');
  const [catPreproc, setCatPreproc] = useState<Preproc>('minusOneToOne');

  const [showResult, setShowResult] = useState(false);
  const [showNotPetSkinResult, setShowNotPetSkinResult] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [processingPhoto, setProcessingPhoto] = useState(false);
  const [resultDescription, setResultDescription] = useState('');
  const [resultTags, setResultTags] = useState<string[]>([]);
  const [resultInfo, setResultInfo] = useState<{[key: string]: string}>({});
  const [readMoreUrl, setReadMoreUrl] = useState<string | undefined>(undefined); 
  const [confidenceMessage, setConfidenceMessage] = useState('');

  // ---- UI toggles ----
  const toggleCameraFacing = () => setFacing(prev => (prev === 'back' ? 'front' : 'back'));
  const toggleFlash = () => setFlash(prev => (prev === 'off' ? 'on' : 'off'));
  const togglePetType = () => setIsPetDog(prev => !prev);

  const getConfidenceMessage = (c: number) => {
    if (c > 80) return "This result is predicted with high confidence. Please still consult a veterinarian to confirm the condition.";
    if (c >= 60) return "This result is moderately confident. We recommend observing your pet closely or seeking professional veterinary advice.";
    if (c >= 35) return "Prediction is uncertain. The model had difficulty identifying the condition. Please consult a veterinarian for confirmation.";
    return "Prediction is highly uncertain. We strongly advise consulting a veterinarian for an accurate diagnosis.";
  };

  // ---- Tensor utils ----
  const toRGB = (imageData: Uint8Array, w: number, h: number) => {
    const raw = tf.tensor3d(imageData, [h, w, 4], 'int32');
    const rgb = raw.slice([0, 0, 0], [-1, -1, 3]);
    return tf.cast(rgb, 'float32'); // [h,w,3] float32, 0..255
  };

  const prepareImageForDogModel = (imageData: Uint8Array, width: number, height: number) => {
    return tf.tidy(() => {
      const floatRgb = toRGB(imageData, width, height);
      const square   = centerCropSquare(floatRgb);
      const resized  = tf.image.resizeBilinear(square, [INPUT_SIZE, INPUT_SIZE]);
      const normalized = applyPreproc(dogPreproc, resized);
      return normalized.expandDims(0); // [1,224,224,3]
    });
  };

  const prepareImageForCatModel = (imageData: Uint8Array, width: number, height: number) => {
    return tf.tidy(() => {
      const floatRgb = toRGB(imageData, width, height);
      const square   = centerCropSquare(floatRgb);
      const resized  = tf.image.resizeBilinear(square, [INPUT_SIZE, INPUT_SIZE]);
      const normalized = applyPreproc(catPreproc, resized);
      return normalized.expandDims(0);
    });
  };

  const saveToHistory = async () => {
    try {
      const historyItem = {
        condition: predictionLabel,
        species: isPetDog ? 'dog' : 'cat',
        confidence,
        timestamp: new Date().toISOString(),
      };
      const existing = await AsyncStorage.getItem('scanHistory');
      const parsed = existing ? JSON.parse(existing) : [];
      await AsyncStorage.setItem('scanHistory', JSON.stringify([historyItem, ...parsed]));
    } catch (e) {
      Alert.alert('Error', 'Failed to save to history. Please try again.');
    }
  };

  useEffect(() => {
    const loadModels = async () => {
      setIsModelLoading(true);
      try {
        // Backend first
        try {
          await tf.setBackend('rn-webgl');
        } catch {
          await tf.setBackend('cpu');
        }
        await tf.ready();
        console.log("TF ready. Backend:", tf.getBackend());

        // Static requires for Expo bundler (paths must match your project structure)
        const dogModelJson = require('../assets/dog_model/dog_model.json');
        const dogModelWeights = require('../assets/dog_model/weights.bin');
        const catModelJson = require('../assets/cat_model/cat_model.json');
        const catModelWeights = require('../assets/cat_model/weights.bin');

        const [loadedDogModel, loadedCatModel] = await Promise.all([
          tf.loadLayersModel(bundleResourceIO(dogModelJson, dogModelWeights)),
          tf.loadLayersModel(bundleResourceIO(catModelJson, catModelWeights))
        ]);

        // Warm-up
        const warm = tf.tidy(() => tf.zeros([1, INPUT_SIZE, INPUT_SIZE, 3], 'float32'));
        loadedDogModel.predict(warm);
        loadedCatModel.predict(warm);
        warm.dispose();

        // Infer preprocessing modes
        const dogMode = inferPreproc(loadedDogModel);
        const catMode = inferPreproc(loadedCatModel);
        setDogPreproc(dogMode);
        setCatPreproc(catMode);
        console.log('Preproc modes → dog:', dogMode, 'cat:', catMode);

        setDogModel(loadedDogModel);
        setCatModel(loadedCatModel);
        console.log('✅ Both models loaded & warmed');

        // Sanity log of labels (hardcoded)
        console.log('Dog labels:', dogLabelsRef.current);
        console.log('Cat labels:', catLabelsRef.current);

      } catch (error) {
        console.error('Failed to load TF models:', error);
        Alert.alert('Model Loading Error', `Failed to load AI model. Please restart the app.`);
      } finally {
        setIsModelLoading(false);
      }
    };

    loadModels();

    return () => {
      try { dogModel?.dispose(); } catch {}
      try { catModel?.dispose(); } catch {}
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTakePhoto = async () => {
    if (!cameraRef.current) {
      Alert.alert('Error', 'Camera not ready. Please try again.');
      return;
    }
    try {
      const options = { quality: 0.9, base64: true, skipProcessing: true, exif: false } as const;
      const photo = await (cameraRef.current as any).takePictureAsync(options);
      if (!photo?.uri || !photo?.base64) {
        Alert.alert('Error', 'Failed to capture photo. Please try again.');
        return;
      }
      setCapturedPhoto({ uri: photo.uri, base64: photo.base64 });
      setShowImagePreview(true);
    } catch (error) {
      console.error('Capture error:', error);
      Alert.alert('Error', 'Error capturing the photo. Please try again.');
    }
  };

  // 👉 Updated flow: close preview, show processing overlay, then run prediction
  const handleScanImage = async () => {
    const currentModel = isPetDog ? dogModel : catModel;
    const classLabels = isPetDog ? dogLabelsRef.current : catLabelsRef.current;

    // Keep the preview open if we can't run yet
    if (isModelLoading || processingPhoto || !currentModel) {
      Alert.alert('Error', 'Model not ready. Please try again.');
      return;
    }
    if (!capturedPhoto?.base64) {
      Alert.alert('Error', 'No image to process. Please retake.');
      return;
    }

    // Close the review modal first, then show the processing overlay
    setShowImagePreview(false);
    setProcessingPhoto(true);
    await new Promise(res => setTimeout(res, 0)); // let UI render overlay (or: await tf.nextFrame())

    try {
      // Decode JPEG base64 -> RGBA bytes
      const imgBuffer = tf.util.encodeString(capturedPhoto.base64, 'base64').buffer;
      const raw = new Uint8Array(imgBuffer);
      const imgData = jpeg.decode(raw, { useTArray: true });
      const { width, height, data } = imgData;

      // Preprocess
      const imgTensor = isPetDog
        ? prepareImageForDogModel(data, width, height)
        : prepareImageForCatModel(data, width, height);

      // Predict
      const pred = currentModel.predict(imgTensor) as tf.Tensor;
      const logits = tf.squeeze(pred) as tf.Tensor1D;

      // These TM models end with softmax, but keep a safe check
      const [minVal] = await logits.min().data();
      const [maxVal] = await logits.max().data();
      const [sumVals] = await logits.sum().data();
      const looksLikeProbs =
        minVal >= -EPS && maxVal <= 1 + EPS && Math.abs(sumVals - 1) < 0.02;

      const probsTensor = looksLikeProbs ? logits : (tf.softmax(logits) as tf.Tensor1D);
      const probsArr = Array.from(await probsTensor.data());
      const total = probsArr.reduce((a, b) => a + b, 0) || 1;
      const normalizedValues = probsArr.map(v => v / total);

      // Build + sort predictions
      const allPredsRaw = classLabels.map((label, i) => ({
        label,
        confidence: Number((normalizedValues[i] * 100).toFixed(1)),
      })).sort((a, b) => b.confidence - a.confidence);

      const top = allPredsRaw[0] || { label: 'Unknown', confidence: 0 };
      setPredictionLabel(top.label);
      setConfidence(top.confidence);

      // Not_pet_skin gate
      const canonicalTop = (top.label || '').toLowerCase().replace(/\s+/g, '_');
      const isNotPet = canonicalTop === 'not_pet_skin';

      if (isNotPet && top.confidence >= NOT_PET_CONFIDENCE_GATE) {
        setShowNotPetSkinResult(true);
        tf.dispose([imgTensor, pred, logits, probsTensor]);
        return;
      }

      // Otherwise show normal results (drop Not_pet_skin and renormalize)
      const filtered = allPredsRaw.filter(x => x.label.toLowerCase().replace(/\s+/g, '_') !== 'not_pet_skin');
      const totalFiltered = filtered.reduce((acc, p) => acc + p.confidence, 0) || 1;
      const renorm = filtered.map(p => ({ ...p, confidence: Number(((p.confidence / totalFiltered) * 100).toFixed(1)) }));

      setAllPredictions(renorm);
      setConfidenceMessage(getConfidenceMessage(top.confidence));

     
      const petType = (isPetDog ? 'dog' : 'cat') as 'dog' | 'cat';
      const entry = findDiseaseEntry(petType, top.label);

      if (entry) {
        const val = entry.value || {};
        setResultDescription(val.description || 'No description available.');
        setResultTags(Array.isArray(val.tags) ? val.tags : []);
        setResultInfo(typeof val.info === 'object' && val.info ? val.info : {});
        setReadMoreUrl(typeof val.readMore === 'string' ? val.readMore : undefined);
      } else {
        setResultDescription('No additional information available for this condition.');
        setResultTags([isPetDog ? 'Dog Condition' : 'Cat Condition']);
        setResultInfo({
          'Symptoms': 'unknown',
          'Treatment': 'consult veterinarian',
          'Severity Indication': 'unknown',
          'Prevention Tips': 'unknown',
          'Contagion Rate': 'unknown'
        });
        setReadMoreUrl(undefined);
      }

      setShowResult(true);

      tf.dispose([imgTensor, pred, logits, probsTensor]);
    } catch (error) {
      console.error('Processing error:', error);
      Alert.alert('Error', 'Error processing the image. Please try again with a clearer photo.');
    } finally {
      setProcessingPhoto(false); // hide overlay when done
    }
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    setShowImagePreview(false);
    setReadMoreUrl(undefined);
  };

  const handleCloseNotPetSkinResult = () => {
    setShowNotPetSkinResult(false);
    setCapturedPhoto(null);
    setReadMoreUrl(undefined);
  };

  const getIconForInfoKey = (key: string) => {
    switch (key) {
      case 'Symptoms': return <MaterialIcons name="sick" size={16} color="#444" />;
      case 'Treatment': return <FontAwesome5 name="first-aid" size={14} color="#444" />;
      case 'Severity Indication': return <MaterialIcons name="warning" size={16} color="#444" />;
      case 'Prevention Tips': return <FontAwesome5 name="shield-virus" size={14} color="#444" />;
      case 'Contagion Rate': return <MaterialIcons name="people" size={16} color="#444" />;
      case 'Risk Factors': return <MaterialIcons name="error" size={16} color="#444" />; 
      default: return null;
    }
  };

  const handleOpenLink = async (url?: string) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else Alert.alert('Error', 'Cannot open this URL');
    } catch {
      Alert.alert('Error', 'Failed to open link');
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', color: 'white', marginBottom: 20 }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Image Preview Modal */}
      <Modal visible={showImagePreview} transparent animationType="slide">
        <View style={styles.resultOverlay}>
          <View style={styles.imagePreviewCard}>
            <Text style={styles.imagePreviewTitle}>Review Your Photo</Text>

            {capturedPhoto && (
              <Image
                source={{ uri: capturedPhoto.uri }}
                style={{ width: '100%', height: 300, borderRadius: 10, marginBottom: 15, backgroundColor: '#f0f0f0' }}
                resizeMode="contain"
              />
            )}

            <Text style={styles.previewInstructions}>
              Make sure the affected area is clearly visible and well-lit
            </Text>

            <View style={styles.previewButtons}>
              <TouchableOpacity style={styles.retakeButton} onPress={handleRetakePhoto} disabled={processingPhoto}>
                <Ionicons name="camera-outline" size={20} color="#666" />
                <Text style={styles.retakeButtonText}>Retake</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.scanButton, (isModelLoading || processingPhoto) && styles.disabledButton]}
                onPress={handleScanImage}
                disabled={isModelLoading || processingPhoto}
              >
                {processingPhoto ? (
                  <ActivityIndicator size={20} color="white" />
                ) : (
                  <MaterialIcons name="search" size={20} color="white" />
                )}
                <Text style={styles.scanButtonText}>{processingPhoto ? 'Analyzing...' : 'Scan Image'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Processing Overlay */}
      <Modal visible={processingPhoto} transparent animationType="fade">
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" />
          <Text style={styles.processingText}>Processing the prediction please wait...</Text>
        </View>
      </Modal>

      {/* Not Pet Skin Result Modal */}
      <Modal visible={showNotPetSkinResult} transparent animationType="slide">
        <View style={styles.resultOverlay}>
          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <View style={{ width: 40, height: 5, backgroundColor: '#ccc', borderRadius: 3 }} />
          </View>
          <View style={styles.resultCard}>
            <View style={styles.notPetSkinHeader}>
              <MaterialIcons name="error" size={32} color="#ff6b35" />
              <Text style={styles.notPetSkinTitle}>Unable to Analyze</Text>
            </View>
            <Text style={styles.notPetSkinMessage}>
              The image doesn't appear to show {isPetDog ? 'dog' : 'cat'} skin. Please make sure to:
            </Text>
            <View style={styles.notPetSkinTipsList}>
              <View style={styles.tipItem}><MaterialIcons name="camera-alt" size={16} color="#666" /><Text style={styles.tipText}>Take a clear photo of your {isPetDog ? 'dog' : 'cat'}'s skin</Text></View>
              <View style={styles.tipItem}><MaterialIcons name="wb-sunny" size={16} color="#666" /><Text style={styles.tipText}>Ensure the affected area is well-lit</Text></View>
              <View style={styles.tipItem}><MaterialIcons name="zoom-in" size={16} color="#666" /><Text style={styles.tipText}>Get close enough to show skin details</Text></View>
              <View style={styles.tipItem}><MaterialIcons name="pets" size={16} color="#666" /><Text style={styles.tipText}>Focus on areas with visible skin conditions</Text></View>
            </View>
            <Text style={styles.notPetSkinAdvice}>
              For best results, expose the affected skin area and take the photo in good lighting conditions.
            </Text>
            <TouchableOpacity style={styles.tryAgainButton} onPress={handleCloseNotPetSkinResult}>
              <MaterialIcons name="camera-alt" size={20} color="white" />
              <Text style={styles.tryAgainButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Result Popup */}
      <Modal visible={showResult} transparent animationType="slide">
        <View style={styles.resultOverlay}>
          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <View style={{ width: 40, height: 5, backgroundColor: '#ccc', borderRadius: 3 }} />
          </View>
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>
              <AntDesign name="checkcircle" size={24} color="#008000" />   Successfully Scanned!
            </Text>
            <Text style={styles.resultLabel}>
              {predictionLabel.replace('_', ' ')} <Text style={styles.confidence}>({confidence}%)</Text>
            </Text>
            <ScrollView style={{ maxHeight: 350 }}>
              <Text style={styles.confidenceMessage}>{confidenceMessage}</Text>
              <View style={styles.tagContainer}>
                {resultTags.map((tag, i) => (<Text key={`${tag}-${i}`} style={styles.tag}>{tag}</Text>))}
              </View>

              {allPredictions.length > 0 && (
                <View style={styles.allPredictionsContainer}>
                  <Text style={styles.otherPredictionsTitle}>Other possible conditions</Text>
                  {allPredictions.map((pred, i) => (
                    <View key={`${pred.label}-${i}`} style={styles.predictionRow}>
                      <Text style={[styles.otherPredictionLabel, i === 0 && styles.topPredictionLabel]}>
                        {pred.label.replace('_', ' ')}
                      </Text>
                      <Text style={[styles.otherPredictionConfidence, i === 0 && styles.topPredictionConfidence]}>
                        {pred.confidence}%
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.resultDescription}>{resultDescription}</Text>

              {readMoreUrl && (
                <TouchableOpacity onPress={() => handleOpenLink(readMoreUrl)}>
                  <Text style={styles.readMoreLink}>
                    <FontAwesome name="bookmark" size={20} color="#a62c2c" />   Read more
                  </Text>
                </TouchableOpacity>
              )}

              <View style={styles.infoGrid}>
                {Object.entries(resultInfo).map(([key, value], index) => {
                  const boldKeys = ['Symptoms','Treatment','Severity Indication','Prevention Tips','Contagion Rate','Risk Factors',];
                  const isBoldKey = boldKeys.includes(key);
                  const isAdditionalNote = key.toLowerCase().includes('note');
                  const icon = getIconForInfoKey(key);
                  return (
                    <Text key={`${key}-${index}`} style={[styles.infoItem, isAdditionalNote && styles.additionalNote]}>
                      {isBoldKey && icon}{' '}
                      <Text style={isBoldKey ? styles.infoLabelBold : styles.infoLabelNormal}>{key}:</Text>{' '}
                      {value}
                    </Text>
                  );
                })}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                saveToHistory();
                setShowResult(false);
                setCapturedPhoto(null);
                setReadMoreUrl(undefined);
              }}
            >
              <Text style={styles.saveButtonText}>Save to history</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>

      {/* Flash Button */}
      <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
        <Ionicons name={flash === 'off' ? 'flash-off-outline' : 'flash-outline'} size={24} color="white" />
      </TouchableOpacity>

      {/* Pet Type Switch */}
      <View style={styles.petTypeContainer}>
        <Text style={[styles.petTypeLabel, isPetDog && styles.inactivePetType]}>Cat</Text>
        <Switch
          value={isPetDog}
          onValueChange={togglePetType}
          trackColor={{ false: '#767577', true: '#a62c2c' }}
          thumbColor={'#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          style={styles.petSwitch}
        />
        <Text style={[styles.petTypeLabel, !isPetDog && styles.inactivePetType]}>Dog</Text>
      </View>

      {/* Header Text */}
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerText}>Scan your {isPetDog ? 'dog' : 'cat'}'s skin</Text>
        {isModelLoading && <Text style={styles.loadingText}>Loading AI model...</Text>}
      </View>

      {/* Camera View */}
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} flash={flash}>
        <View style={styles.bottomControls}>
          <View style={styles.iconButton} />
          <TouchableOpacity style={[styles.shutterButton]} onPress={handleTakePhoto}>
            <View style={styles.shutterInner} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}
