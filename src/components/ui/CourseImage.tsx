import { memo, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Shimmer } from '@/components/loaders/Shimmer';
import { resolveCourseImageUrl } from '@/utils/courseImage';

type ImageStatus = 'loading' | 'loaded' | 'error';

interface CourseImageProps {
  uri: string;
  courseId: string;
  height: number;
  style?: ViewStyle;
  rounded?: 'top' | 'all' | 'none';
}

const radiusStyles: Record<NonNullable<CourseImageProps['rounded']>, ViewStyle> = {
  top: { borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  all: { borderRadius: 24 },
  none: {},
};

export const CourseImage = memo(function CourseImage({
  uri,
  courseId,
  height,
  style,
  rounded = 'top',
}: CourseImageProps) {
  const [status, setStatus] = useState<ImageStatus>('loading');
  const resolvedUri = useMemo(
    () => resolveCourseImageUrl([uri], courseId),
    [uri, courseId],
  );
  const containerStyle = useMemo(
    () => [styles.container, { height }, radiusStyles[rounded], style],
    [height, rounded, style],
  );

  useEffect(() => {
    setStatus('loading');
  }, [resolvedUri]);

  const showFallback = status === 'error';

  return (
    <View style={containerStyle}>
      {!showFallback ? (
        <Image
          source={{ uri: resolvedUri }}
          contentFit="cover"
          cachePolicy="memory-disk"
          recyclingKey={courseId}
          transition={200}
          style={StyleSheet.absoluteFill}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      ) : null}

      {status === 'loading' && !showFallback ? (
        <View style={StyleSheet.absoluteFill}>
          <Shimmer height={height} rounded={rounded === 'all' ? '3xl' : '2xl'} />
        </View>
      ) : null}

      {showFallback ? (
        <View style={[StyleSheet.absoluteFill, styles.fallback]}>
          <Ionicons name="image-outline" size={36} color="#94A3B8" />
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'rgba(226, 232, 240, 0.8)',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(226, 232, 240, 0.8)',
  },
});
