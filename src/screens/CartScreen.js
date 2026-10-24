
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/productCatalog';

export default function CartScreen() {
  const {
    items,
    count,
    subtotal,
    setQuantity,
    remove,
  } = useCart();

  const increaseQuantity = (item) => {
    setQuantity(item.key, item.quantity + 1);
  };

  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      setQuantity(item.key, item.quantity - 1);
    }
  };

  const renderItem = ({ item }) => {
    const { product, quantity, size, color } = item;

    const unitsUsed = items
      .filter((entry) => entry.product.id === product.id)
      .reduce((total, entry) => total + entry.quantity, 0);

    const maximumReached = unitsUsed >= product.stock_total;

    return (
      <View style={styles.productCard}>
        <View style={styles.productRow}>
          {product.imagenUrl ? (
            <Image
              source={{ uri: product.imagenUrl }}
              style={styles.productImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>
                Sin imagen
              </Text>
            </View>
          )}

          <View style={styles.productInfo}>
            <Text style={styles.brand}>
              {product.marca || 'SPORTLIKE'}
            </Text>

            <Text style={styles.productName}>
              {product.nombre}
            </Text>

            {size ? (
              <Text style={styles.variant}>
                Talla: {size}
              </Text>
            ) : null}

            {color ? (
              <Text style={styles.variant}>
                Color: {color}
              </Text>
            ) : null}

            <Text style={styles.price}>
              {formatPrice(product.precio)}
            </Text>
          </View>
        </View>

        <View style={styles.controlsRow}>
          <View style={styles.quantityControl}>
            <Pressable
              testID={`cart-decrease-${item.key}`}
              accessibilityRole="button"
              accessibilityLabel={`Disminuir cantidad de ${product.nombre}`}
              disabled={quantity <= 1}
              onPress={() => decreaseQuantity(item)}
              style={[
                styles.quantityButton,
                quantity <= 1 && styles.disabledButton,
              ]}
            >
              <Text style={styles.quantitySymbol}>−</Text>
            </Pressable>

            <Text
              testID={`cart-quantity-${item.key}`}
              style={styles.quantity}
            >
              {quantity}
            </Text>

            <Pressable
              testID={`cart-increase-${item.key}`}
              accessibilityRole="button"
              accessibilityLabel={`Aumentar cantidad de ${product.nombre}`}
              disabled={maximumReached}
              onPress={() => increaseQuantity(item)}
              style={[
                styles.quantityButton,
                maximumReached && styles.disabledButton,
              ]}
            >
              <Text style={styles.quantitySymbol}>+</Text>
            </Pressable>
          </View>

          <Pressable
            testID={`cart-remove-${item.key}`}
            accessibilityRole="button"
            accessibilityLabel={`Eliminar ${product.nombre} del carrito`}
            onPress={() => remove(item.key)}
            style={styles.removeButton}
          >
            <Text style={styles.removeText}>
              Eliminar
            </Text>
          </Pressable>
        </View>

        <View style={styles.lineTotalRow}>
          <Text style={styles.lineTotalLabel}>
            Importe del producto
          </Text>
          <Text style={styles.lineTotal}>
            {formatPrice(product.precio * quantity)}
          </Text>
        </View>

        {maximumReached ? (
          <Text style={styles.stockNotice}>
            Has alcanzado las unidades disponibles de este producto.
          </Text>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          SPORTLIKE MOBILE
        </Text>

        <Text style={styles.title}>
          Mi carrito
        </Text>

        <Text style={styles.subtitle}>
          Revisa los productos que seleccionaste.
        </Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            Tu carrito está vacío
          </Text>

          <Text style={styles.emptyDescription}>
            Agrega productos desde el catálogo para verlos aquí.
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            testID="cart-products"
            data={items}
            keyExtractor={(item) => item.key}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text style={styles.sectionTitle}>
                Productos seleccionados ({count})
              </Text>
            }
          />

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Artículos
              </Text>

              <Text style={styles.summaryValue}>
                {count}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>
                Subtotal
              </Text>

              <Text
                testID="cart-subtotal"
                style={styles.totalValue}
              >
                {formatPrice(subtotal)}
              </Text>
            </View>

            <Text style={styles.summaryNotice}>
              El subtotal corresponde únicamente a los
              productos agregados al carrito.
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F7FA',
    flex: 1,
  },
  header: {
    backgroundColor: '#0B1F3A',
    paddingBottom: 24,
    paddingHorizontal: 20,
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
    marginTop: 8,
  },
  subtitle: {
    color: '#C7D2E1',
    fontSize: 13,
    marginTop: 8,
  },
  list: {
    padding: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    color: '#0B1F3A',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 14,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E6EE',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
    padding: 14,
  },
  productRow: {
    flexDirection: 'row',
    gap: 14,
  },
  productImage: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    height: 100,
    width: 100,
  },
  imagePlaceholder: {
    alignItems: 'center',
    backgroundColor: '#EDF1F5',
    borderRadius: 12,
    height: 100,
    justifyContent: 'center',
    width: 100,
  },
  placeholderText: {
    color: '#718096',
    fontSize: 11,
    textAlign: 'center',
  },
  productInfo: {
    flex: 1,
  },
  brand: {
    color: '#718096',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  productName: {
    color: '#0B1F3A',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 5,
  },
  variant: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
  },
  price: {
    color: '#0B1F3A',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 9,
  },
  controlsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  quantityControl: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  quantityButton: {
    alignItems: 'center',
    backgroundColor: '#E8EEF5',
    borderRadius: 9,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  disabledButton: {
    opacity: 0.35,
  },
  quantitySymbol: {
    color: '#0B1F3A',
    fontSize: 20,
    fontWeight: '800',
  },
  quantity: {
    color: '#0B1F3A',
    fontSize: 16,
    fontWeight: '900',
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  removeText: {
    color: '#B42318',
    fontSize: 12,
    fontWeight: '800',
  },
  lineTotalRow: {
    borderTopColor: '#E7ECF2',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
  },
  lineTotalLabel: {
    color: '#68788D',
    fontSize: 12,
  },
  lineTotal: {
    color: '#0B1F3A',
    fontSize: 14,
    fontWeight: '900',
  },
  stockNotice: {
    color: '#B45309',
    fontSize: 11,
    marginTop: 10,
  },
  summary: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#DCE3EC',
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 22,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    color: '#68788D',
    fontSize: 13,
  },
  summaryValue: {
    color: '#0B1F3A',
    fontSize: 13,
    fontWeight: '800',
  },
  totalLabel: {
    color: '#0B1F3A',
    fontSize: 18,
    fontWeight: '900',
  },
  totalValue: {
    color: '#0B1F3A',
    fontSize: 22,
    fontWeight: '900',
  },
  summaryNotice: {
    color: '#718096',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 28,
  },
  emptyTitle: {
    color: '#0B1F3A',
    fontSize: 21,
    fontWeight: '900',
    textAlign: 'center',
  },
  emptyDescription: {
    color: '#68788D',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
    textAlign: 'center',
  },
});
