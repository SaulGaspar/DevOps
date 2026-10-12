
import { memo, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  optimizeImageUrl,
  placeholderImageUrl,
} from '../utils/progressiveCatalog';

function ProgressiveImageInner({
  uri,
  width,
  label,
  resizeMode,
  style,
}) {
  const [status, setStatus] = useState('loading');
  const [opacity] = useState(() => new Animated.Value(0));

  if (!uri) {
    return (
      <View style={[styles.box, style]}>
        <Text style={styles.message}>Sin imagen</Text>
      </View>
    );
  }

  const thumb = placeholderImageUrl(uri);

  function handleLoad() {
    setStatus('loaded');

    Animated.timing(opacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }

  return (
    <View style={[styles.box, style]}>
      {thumb && status !== 'error' ? (
        <Image
          blurRadius={4}
          resizeMode={resizeMode}
          source={{ uri: thumb }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}

      {status === 'loading' ? (
        <ActivityIndicator
          color="#0B1F3A"
          style={styles.loader}
        />
      ) : null}

      {status === 'error' ? (
        <Text style={styles.message}>
          No se pudo cargar
        </Text>
      ) : (
        <Animated.Image
          accessibilityLabel={label}
          onError={() => setStatus('error')}
          onLoad={handleLoad}
          resizeMode={resizeMode}
          source={{
            uri: optimizeImageUrl(uri, width),
          }}
          style={[
            StyleSheet.absoluteFill,
            { opacity },
          ]}
        />
      )}
    </View>
  );
}

function ProgressiveImage({
  uri,
  width = 400,
  resizeMode = 'cover',
  label,
  style,
}) {
  return (
    <ProgressiveImageInner
      key={uri || 'sin-imagen'}
      uri={uri}
      width={width}
      resizeMode={resizeMode}
      label={label}
      style={style}
    />
  );
}

export default memo(ProgressiveImage);

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    backgroundColor: '#F3F6FA',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  loader: {
    position: 'absolute',
  },
  message: {
    color: '#78879A',
    fontSize: 12,
    textAlign: 'center',
  },
});
