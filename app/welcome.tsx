import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowRight, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomText } from '../components/CustomText';

const { width, height } = Dimensions.get('window');

interface SlideData {
  id: string;
  image: ImageSourcePropType;
  title: string;
  subtitle: string;
}

const slides: SlideData[] = [
  {
    id: '1',
    image: require('../assets/images/welcome-1.png'),
    title: 'Manage Your Finance\nEffortlessly',
    subtitle: 'Control your expense and target your savings',
  },
  {
    id: '2',
    image: require('../assets/images/welcome-2.png'),
    title: 'Easy Simulations with\nCrypto',
    subtitle: 'Easy to follow simulation on crypto investments',
  },
  {
    id: '3',
    image: require('../assets/images/welcome-3.png'),
    title: 'All in One Financial\nEducation',
    subtitle: 'Learn with 20+ finance materials available',
  },
  {
    id: '4',
    image: require('../assets/images/welcome-4.png'),
    title: 'Get Started with Fluent\nFinance',
    subtitle: '',
  },
];

export default function WelcomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<SlideData>>(null);
  const insets = useSafeAreaInsets();

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken<SlideData>[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleComplete = async () => {
    await AsyncStorage.setItem('hasSeenWelcome', 'true');
    router.replace('/(drawer)/(tabs)' as any);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleComplete();
    }
  };

  const renderSlide = ({ item }: { item: SlideData }) => (
    <View style={styles.slide}>
      {/* Image area */}
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
        {/* Gradient overlays for smooth transparency transition */}
        <LinearGradient
          colors={['rgba(11, 22, 38, 0.6)', 'transparent']}
          style={styles.imageOverlayTop}
        />
        <LinearGradient
          colors={['transparent', '#0b1626']}
          style={styles.imageOverlayBottom}
        />
      </View>

      {/* Text content area */}
      <View style={styles.textContainer}>
        <CustomText weight="bold" style={styles.title}>
          {item.title}
        </CustomText>
        {item.subtitle ? (
          <CustomText style={styles.subtitle}>{item.subtitle}</CustomText>
        ) : null}
      </View>
    </View>
  );

  const isLastSlide = currentIndex === slides.length - 1;

  // Calculate safe bottom padding — use inset if available, otherwise fallback
  const bottomPadding = insets.bottom > 0 ? insets.bottom + 12 : 40;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
      />

      {/* Pagination dots */}
      <View style={[styles.paginationContainer, { bottom: bottomPadding + 60 }]}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      {/* Bottom navigation */}
      <View style={[styles.bottomNav, { bottom: bottomPadding }]}>
        <TouchableOpacity onPress={handleComplete} style={styles.skipButton}>
          <CustomText weight="medium" style={styles.skipText}>
            Skip
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          style={[styles.nextButton, isLastSlide && styles.nextButtonFinal]}
          activeOpacity={0.8}
        >
          {isLastSlide ? (
            <Check size={22} color="#fff" strokeWidth={3} />
          ) : (
            <ArrowRight size={22} color="#fff" strokeWidth={2.5} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1626',
  },
  slide: {
    width,
    height,
  },
  imageContainer: {
    width,
    height: height * 0.55,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  imageOverlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 28,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    color: '#ffffff',
    lineHeight: 38,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#94a3b8',
    lineHeight: 22,
  },
  paginationContainer: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: '#0ea5e9',
    width: 24,
  },
  dotInactive: {
    backgroundColor: '#1e293b',
  },
  bottomNav: {
    position: 'absolute',
    left: 28,
    right: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  skipText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  nextButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#147684',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonFinal: {
    backgroundColor: '#0ea5e9',
  },
});
