import { memo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatPrice } from '../utils/productCatalog';

function ProductCard({ product, onPress }) {
  const [loadingImage, setLoadingImage] = useState(Boolean(product.imagenUrl));
  const soldOut = product.stock_total <= 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver ${product.nombre}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.imageBox}>
        {product.imagenUrl ? (
          <Image
            accessibilityLabel={`Imagen de ${product.nombre}`}
            onLoadEnd={() => setLoadingImage(false)}
            resizeMode="cover"
            source={{ uri: product.imagenUrl }}
            style={styles.image}
          />
        ) : (
          <Text style={styles.placeholder}>Sin imagen</Text>
        )}
        {loadingImage ? <ActivityIndicator color="#0B1F3A" style={styles.loader} /> : null}
        {soldOut ? <Text style={styles.stockBadge}>Agotado</Text> : null}
      </View>
      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.brand}>
          {product.marca || product.categoria || 'SportLike'}
        </Text>
        <Text numberOfLines={2} style={styles.name}>{product.nombre}</Text>
        <Text style={styles.price}>{formatPrice(product.precio)}</Text>
        <Text style={[styles.stock, soldOut && styles.stockOut]}>
          {soldOut ? 'Sin existencias' : `${product.stock_total} disponibles`}
        </Text>
      </View>
    </Pressable>
  );
}

export default memo(ProductCard);

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderColor: '#E3E9F1', borderRadius: 16, borderWidth: 1, flex: 1, margin: 6, overflow: 'hidden' },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  imageBox: { alignItems: 'center', aspectRatio: 1, backgroundColor: '#F3F6FA', justifyContent: 'center' },
  image: { height: '100%', width: '100%' },
  loader: { position: 'absolute' },
  placeholder: { color: '#78879A', fontSize: 12 },
  stockBadge: { backgroundColor: '#B42318', borderRadius: 10, color: '#FFFFFF', fontSize: 10, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 4, position: 'absolute', right: 8, top: 8 },
  content: { padding: 12 },
  brand: { color: '#68788D', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  name: { color: '#0B1F3A', fontSize: 14, fontWeight: '800', lineHeight: 18, marginTop: 3, minHeight: 36 },
  price: { color: '#0B1F3A', fontSize: 17, fontWeight: '900', marginTop: 8 },
  stock: { color: '#287A4B', fontSize: 10, fontWeight: '700', marginTop: 3 },
  stockOut: { color: '#B42318' },
});
