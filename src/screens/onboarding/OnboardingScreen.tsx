import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Dimensions, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT, SIZES } from '../../constants/theme';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/Button';

const { width, height } = Dimensions.get('window');

interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: 'Welcome to Vehicle Inspection',
    description: 'Streamline your vehicle inspection process with our advanced plate recognition system.',
    image: 'https://images.pexels.com/photos/3807330/pexels-photo-3807330.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '2',
    title: 'Efficient Registration',
    description: 'Register your vehicles easily by adding plate number, color, make, model, and other important details.',
    image: 'https://images.pexels.com/photos/3806252/pexels-photo-3806252.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '3',
    title: 'Instant Verification',
    description: 'Get your vehicles verified quickly through our advanced plate number recognition system.',
    image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { setFirstLaunchComplete } = useAuthStore();
  
  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true
      });
    } else {
      handleGetStarted();
    }
  };
  
  const handleGetStarted = () => {
    setFirstLaunchComplete();
  };
  
  const handleSkip = () => {
    flatListRef.current?.scrollToIndex({
      index: onboardingData.length - 1,
      animated: true
    });
  };
  
  const renderItem = ({ item }: { item: OnboardingItem }) => {
    return (
      <View style={styles.slideContainer}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };
  
  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot
              ]}
            />
          ))}
        </View>
        
        <View style={styles.buttonsContainer}>
          {currentIndex < onboardingData.length - 1 ? (
            <>
              <TouchableOpacity onPress={handleSkip}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
              
              <Button 
                title="Next" 
                onPress={handleNext} 
                size="medium"
              />
            </>
          ) : (
            <Button 
              title="Get Started" 
              onPress={handleGetStarted}
              size="large"
              style={styles.getStartedButton}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />
      
      {renderPagination()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  slideContainer: {
    width,
    flex: 1,
  },
  imageContainer: {
    height: height * 0.6,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: SIZES.padding.xl,
    paddingTop: SIZES.padding.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT.size.xxl,
    fontWeight: FONT.weight.bold,
    textAlign: 'center',
    marginBottom: SIZES.margin.md,
    color: COLORS.text.primary,
  },
  description: {
    fontSize: FONT.size.md,
    textAlign: 'center',
    color: COLORS.text.secondary,
    lineHeight: 24,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: SIZES.padding.xl,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SIZES.margin.lg,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.secondary[300],
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: COLORS.primary[500],
    width: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipText: {
    fontSize: FONT.size.md,
    color: COLORS.secondary[700],
    fontWeight: FONT.weight.medium,
  },
  getStartedButton: {
    width: '100%',
  },
});

export default OnboardingScreen;