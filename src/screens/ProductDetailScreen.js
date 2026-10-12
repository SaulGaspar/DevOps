import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { productApi } from '../services/api';
import { formatPrice, normalizeProduct } from '../utils/productCatalog';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const galleryRef = useRef(null);
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProduct = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const response = await productApi.detail(id);
      const normalized = normalizeProduct(response);
      setProduct(normalized);
      setSelectedSize(normalized.tallas.length === 1 ? normalized.tallas[0] : '');
      setSelectedColor(normalized.coloresLista.length === 1 ? normalized.coloresLista[0] : '');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => loadProduct(), 0);
    return () => clearTimeout(timer);
  }, [loadProduct]);

  const canAdd = useMemo(() => {
    if (!product || product.stock_total <= 0) return false;
    if (product.tallas.length && !selectedSize) return false;
    if (product.coloresLista.length && !selectedColor) return false;
    return true;
  }, [product, selectedColor, selectedSize]);

  function addToCart() {
    if (!canAdd) {
      Alert.alert('Completa tu selección', 'Selecciona talla y color antes de agregar el producto.');
      return;
    }
    Alert.alert(
      'Producto preparado',
      `${product.nombre}${selectedSize ? ` · Talla ${selectedSize}` : ''}${selectedColor ? ` · ${selectedColor}` : ''}. La persistencia del carrito corresponde a HU5.`,
      [{ text: 'Seguir viendo', style: 'cancel' }, { text: 'Ir al carrito', onPress: () => router.push('/carrito') }],
    );
  }

  if (loading) return <View style={styles.center}><ActivityIndicator color="#0B1F3A" size="large" /><Text style={styles.muted}>Cargando producto</Text></View>;
  if (error || !product) return <View style={styles.center}><Text style={styles.errorTitle}>No pudimos abrir el producto</Text><Text style={styles.muted}>{error || 'Producto no encontrado.'}</Text><Pressable onPress={loadProduct} style={styles.primaryButton}><Text style={styles.primaryText}>Reintentar</Text></Pressable></View>;

  const images = product.imagenes.length ? product.imagenes : [''];
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.gallery}>
        <FlatList
          data={images}
          horizontal
          keyExtractor={(item, index) => `${item}-${index}`}
          onMomentumScrollEnd={(event) => setCurrentImage(Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH))}
          pagingEnabled
          ref={galleryRef}
          renderItem={({ item }) => (
            <View style={styles.imagePage}>
              {item ? <Image source={{ uri: item }} resizeMode="contain" style={styles.image} /> : <Text style={styles.muted}>Sin imagen disponible</Text>}
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
        {images.length > 1 ? <Text style={styles.counter}>{currentImage + 1} / {images.length}</Text> : null}
      </View>

      <View style={styles.details}>
        <Text style={styles.brand}>{product.marca || product.categoria || 'SPORTLIKE'}</Text>
        <Text style={styles.title}>{product.nombre}</Text>
        <Text style={styles.price}>{formatPrice(product.precio)}</Text>
        <Text style={[styles.stock, product.stock_total <= 0 && styles.stockOut]}>{product.stock_total > 0 ? `${product.stock_total} unidades disponibles` : 'Producto agotado'}</Text>
        <Text style={styles.description}>{product.descripcion || 'Producto deportivo seleccionado por SportLike.'}</Text>

        {product.tallas.length ? <OptionGroup label="Selecciona tu talla" options={product.tallas} selected={selectedSize} onSelect={setSelectedSize} /> : null}
        {product.coloresLista.length ? <OptionGroup label="Selecciona el color" options={product.coloresLista} selected={selectedColor} onSelect={setSelectedColor} /> : null}

        <Pressable disabled={product.stock_total <= 0} onPress={addToCart} style={({ pressed }) => [styles.addButton, product.stock_total <= 0 && styles.disabled, pressed && canAdd && styles.pressed]}>
          <Text style={styles.addText}>{product.stock_total <= 0 ? 'Sin existencias' : 'Agregar al carrito'}</Text>
        </Pressable>
        {!canAdd && product.stock_total > 0 ? <Text style={styles.hint}>Selecciona las opciones disponibles para continuar.</Text> : null}
      </View>
    </ScrollView>
  );
}

function OptionGroup({ label, options, selected, onSelect }) {
  return <View style={styles.optionSection}><Text style={styles.optionLabel}>{label}</Text><View style={styles.options}>{options.map((option) => { const active = selected === option; return <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} key={option} onPress={() => onSelect(option)} style={[styles.option, active && styles.optionActive]}><Text style={[styles.optionText, active && styles.optionTextActive]}>{option}</Text></Pressable>; })}</View></View>;
}

const styles = StyleSheet.create({
  content: { backgroundColor: '#F5F7FA', flexGrow: 1, paddingBottom: 34 },
  center: { alignItems: 'center', backgroundColor: '#F5F7FA', flex: 1, justifyContent: 'center', padding: 28 },
  gallery: { backgroundColor: '#FFFFFF' },
  imagePage: { alignItems: 'center', backgroundColor: '#F4F6F8', height: 360, justifyContent: 'center', width: SCREEN_WIDTH },
  image: { height: '100%', width: '100%' },
  counter: { backgroundColor: '#0B1F3ACC', borderRadius: 14, bottom: 14, color: '#FFFFFF', fontSize: 11, fontWeight: '800', paddingHorizontal: 10, paddingVertical: 5, position: 'absolute', right: 14 },
  details: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -18, padding: 22 },
  brand: { color: '#65758B', fontSize: 11, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase' },
  title: { color: '#0B1F3A', fontSize: 27, fontWeight: '900', lineHeight: 32, marginTop: 6 },
  price: { color: '#0B1F3A', fontSize: 24, fontWeight: '900', marginTop: 12 },
  stock: { color: '#287A4B', fontSize: 12, fontWeight: '800', marginTop: 4 },
  stockOut: { color: '#B42318' },
  description: { color: '#506176', fontSize: 14, lineHeight: 21, marginTop: 18 },
  optionSection: { marginTop: 22 },
  optionLabel: { color: '#0B1F3A', fontSize: 14, fontWeight: '900', marginBottom: 10 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  option: { borderColor: '#CCD6E2', borderRadius: 10, borderWidth: 1, minWidth: 48, paddingHorizontal: 13, paddingVertical: 10 },
  optionActive: { backgroundColor: '#0B1F3A', borderColor: '#0B1F3A' },
  optionText: { color: '#34465D', fontSize: 12, fontWeight: '800', textAlign: 'center' },
  optionTextActive: { color: '#FFFFFF' },
  addButton: { alignItems: 'center', backgroundColor: '#0B1F3A', borderRadius: 12, marginTop: 28, paddingVertical: 15 },
  disabled: { backgroundColor: '#9AA7B8' },
  pressed: { opacity: 0.8 },
  addText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
  hint: { color: '#B45309', fontSize: 11, marginTop: 8, textAlign: 'center' },
  muted: { color: '#68788D', marginTop: 10, textAlign: 'center' },
  errorTitle: { color: '#0B1F3A', fontSize: 18, fontWeight: '900', textAlign: 'center' },
  primaryButton: { backgroundColor: '#0B1F3A', borderRadius: 10, marginTop: 18, paddingHorizontal: 22, paddingVertical: 12 },
  primaryText: { color: '#FFFFFF', fontWeight: '800' },
});
