
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';

import ProductCard from '../components/ProductCard';
import { productApi } from '../services/api';
import { normalizeProduct } from '../utils/productCatalog';
import { searchCatalog } from '../utils/searchCatalog';
import {
  PAGE_SIZE,
  getPagedItems,
  hasMorePages,
} from '../utils/progressiveCatalog';

export default function CatalogScreen() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  // Obtener productos y categorías desde la API
  const loadCatalog = useCallback(async ({ refresh = false } = {}) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError('');
    setPage(1);

    try {
      const [productRows, categoryRows] = await Promise.all([
        productApi.list(),
        productApi.categories(),
      ]);

      setProducts(
        Array.isArray(productRows)
          ? productRows.map(normalizeProduct)
          : []
      );

      setCategories(
        Array.isArray(categoryRows) ? categoryRows : []
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadCatalog(), 0);
    return () => clearTimeout(timer);
  }, [loadCatalog]);

  // Filtrar productos por categoría
  const visibleProducts = useMemo(() => {
  const categoryProducts = selectedCategory
    ? products.filter(
        (product) => product.categoria === selectedCategory
      )
    : products;

  return searchCatalog(categoryProducts, searchQuery);
  }, [products, selectedCategory, searchQuery]);

  // HU3: Paginación progresiva del catálogo
  const pagedProducts = useMemo(
    () => getPagedItems(visibleProducts, page, PAGE_SIZE),
    [visibleProducts, page]
  );

  const canLoadMore = hasMorePages(
    visibleProducts.length,
    page,
    PAGE_SIZE
  );

  // Cargar más productos al llegar al final
  const loadMore = useCallback(() => {
    if (canLoadMore) {
      setPage((current) => current + 1);
    }
  }, [canLoadMore]);

  // Todos los hooks están antes de los retornos condicionales
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#0B1F3A" size="large" />
        <Text style={styles.centerText}>
          Cargando catálogo
        </Text>
      </View>
    );
  }

  if (error && products.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          No pudimos cargar el catálogo
        </Text>
        <Text style={styles.centerText}>{error}</Text>
        <Pressable
          onPress={() => loadCatalog()}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      ListHeaderComponent={
        <View>
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>
              SPORTLIKE MOBILE
            </Text>
            <Text style={styles.title}>
              Encuentra tu próximo equipo
            </Text>
            <Text style={styles.subtitle}>
              Explora productos disponibles y revisa cada
              detalle antes de comprar.
            </Text>
          </View>


          <View style={styles.searchContainer}>
  <TextInput
    testID="catalog-search-input"
    style={styles.searchInput}
    placeholder="Buscar productos por nombre o marca..."
    placeholderTextColor="#718096"
    value={searchQuery}
    onChangeText={(text) => {
      setSearchQuery(text);
      setPage(1);
    }}
    autoCorrect={false}
    />
  </View>

          <FlatList
            contentContainerStyle={styles.categories}
            data={['', ...categories]}
            horizontal
            keyExtractor={(item) => item || 'all'}
            renderItem={({ item }) => {
              const active = item === selectedCategory;

              return (
                <Pressable
                  onPress={() => {
                    setSelectedCategory(item);
                    setPage(1);
                  }}
                  style={[
                    styles.chip,
                    active && styles.chipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      active && styles.chipTextActive,
                    ]}
                  >
                    {item || 'Todos'}
                  </Text>
                </Pressable>
              );
            }}
            showsHorizontalScrollIndicator={false}
          />

          <View style={styles.resultsRow}>
            <Text style={styles.resultsTitle}>
              {selectedCategory || 'Catálogo completo'}
            </Text>
            <Text style={styles.resultsCount}>
              {visibleProducts.length} productos
            </Text>
          </View>

          {error ? (
            <Text style={styles.inlineError}>
              {error}
            </Text>
          ) : null}
        </View>
      }
  ListEmptyComponent={
  <View style={styles.empty}>
    <Text style={styles.errorTitle}>
      {searchQuery.trim()
        ? 'No encontramos productos'
        : 'No hay productos'}
    </Text>

    <Text style={styles.centerText}>
      {searchQuery.trim()
        ? 'Prueba con otro nombre o marca.'
        : 'Prueba con otra categoría.'}
    </Text>
  </View>
  }

      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.list}

      // HU3: Mostrar únicamente los productos paginados
      data={pagedProducts}
      keyExtractor={(item) => item.id}
      numColumns={2}
      initialNumToRender={PAGE_SIZE}

      // Indicador mientras hay más productos por mostrar
      ListFooterComponent={
        canLoadMore ? (
          <ActivityIndicator
            color="#0B1F3A"
            style={styles.footerLoader}
          />
        ) : null
      }

      // HU3: Cargar más productos al desplazarse
      onEndReached={loadMore}
      onEndReachedThreshold={0.4}

      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => loadCatalog({ refresh: true })}
          tintColor="#0B1F3A"
        />
      }

      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={() =>
            router.push({
              pathname: '/producto/[id]',
              params: { id: item.id },
            })
          }
        />
      )}

      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#F5F7FA',
    flexGrow: 1,
    paddingBottom: 24,
  },
  hero: {
    backgroundColor: '#0B1F3A',
    paddingBottom: 28,
    paddingHorizontal: 18,
    paddingTop: 22,
  },
  eyebrow: {
    color: '#B7F02B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '900',
    lineHeight: 32,
    marginTop: 8,
  },
  subtitle: {
    color: '#C7D2E1',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
  },
  categories: {
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCE3EC',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 9,
  },
  chipActive: {
    backgroundColor: '#0B1F3A',
    borderColor: '#0B1F3A',
  },
  chipText: {
    color: '#405169',
    fontSize: 12,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  resultsRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  resultsTitle: {
    color: '#0B1F3A',
    fontSize: 18,
    fontWeight: '900',
  },
  resultsCount: {
    color: '#718096',
    fontSize: 11,
  },
  row: {
    paddingHorizontal: 6,
  },
  center: {
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    flex: 1,
    justifyContent: 'center',
    padding: 28,
  },
  centerText: {
    color: '#68788D',
    marginTop: 10,
    textAlign: 'center',
  },
  errorTitle: {
    color: '#0B1F3A',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  inlineError: {
    color: '#B42318',
    fontSize: 12,
    marginHorizontal: 18,
    marginVertical: 6,
  },
  retryButton: {
    backgroundColor: '#0B1F3A',
    borderRadius: 10,
    marginTop: 18,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  empty: {
    alignItems: 'center',
    padding: 32,
  },
  footerLoader: {
    paddingVertical: 18,
  },
  searchContainer: {
  backgroundColor: '#F5F7FA',
  paddingHorizontal: 18,
  paddingTop: 16,
  },
searchInput: {
  backgroundColor: '#FFFFFF',
  borderColor: '#DCE3EC',
  borderRadius: 12,
  borderWidth: 1,
  color: '#0B1F3A',
  fontSize: 14,
  paddingHorizontal: 14,
  paddingVertical: 12,
  },
});
