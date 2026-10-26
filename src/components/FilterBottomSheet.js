
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export const EMPTY_FILTERS = {
  categoria: '',
  marca: '',
  precioMin: '',
  precioMax: '',
  talla: '',
};

export default function FilterBottomSheet({
  visible,
  filters,
  categories = [],
  brands = [],
  sizes = [],
  onApply,
  onClose,
}) {
  const [draft, setDraft] = useState(() => ({
  ...EMPTY_FILTERS,
  ...filters,
    }));
    const [error, setError] = useState('');

   const update = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setError('');
  };

  const apply = () => {
    const min = draft.precioMin.trim();
    const max = draft.precioMax.trim();

    if (
      (min !== '' && (!Number.isFinite(Number(min)) || Number(min) < 0)) ||
      (max !== '' && (!Number.isFinite(Number(max)) || Number(max) < 0)) ||
      (min !== '' && max !== '' && Number(min) > Number(max))
    ) {
      setError('Ingresa un rango de precios válido.');
      return;
    }

    onApply(draft);
  };

  const clear = () => {
    setDraft({ ...EMPTY_FILTERS });
    setError('');
  };

  const renderOptions = (field, options) => (
    <View style={styles.options}>
      <Pressable
        testID={`filter-${field}-all`}
        onPress={() => update(field, '')}
        style={[styles.chip, !draft[field] && styles.chipActive]}
      >
        <Text style={[styles.chipText, !draft[field] && styles.chipTextActive]}>
          Todos
        </Text>
      </Pressable>

      {options.map((option) => (
        <Pressable
          key={String(option)}
          testID={`filter-${field}-${option}`}
          onPress={() => update(field, String(option))}
          style={[styles.chip, draft[field] === String(option) && styles.chipActive]}
        >
          <Text
            style={[
              styles.chipText,
              draft[field] === String(option) && styles.chipTextActive,
            ]}
          >
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          testID="filter-close-overlay"
          style={styles.backdrop}
          onPress={onClose}
        />

        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Filtros de productos</Text>
            <Pressable testID="filter-close" onPress={onClose}>
              <Text style={styles.close}>Cerrar</Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.sectionTitle}>Categoría</Text>
            {renderOptions('categoria', categories)}

            <Text style={styles.sectionTitle}>Marca</Text>
            {renderOptions('marca', brands)}

            <Text style={styles.sectionTitle}>Precio mínimo</Text>
            <TextInput
              testID="filter-price-min"
              style={styles.input}
              keyboardType="decimal-pad"
              placeholder="Ej. 500"
              value={draft.precioMin}
              onChangeText={(value) => update('precioMin', value)}
            />

            <Text style={styles.sectionTitle}>Precio máximo</Text>
            <TextInput
              testID="filter-price-max"
              style={styles.input}
              keyboardType="decimal-pad"
              placeholder="Ej. 3000"
              value={draft.precioMax}
              onChangeText={(value) => update('precioMax', value)}
            />

            <Text style={styles.sectionTitle}>Talla</Text>
            {renderOptions('talla', sizes)}

            {error ? (
              <Text testID="filter-error" style={styles.error}>
                {error}
              </Text>
            ) : null}
          </ScrollView>

          <View style={styles.actions}>
            <Pressable
              testID="filter-clear"
              onPress={clear}
              style={styles.clearButton}
            >
              <Text style={styles.clearText}>Limpiar filtros</Text>
            </Pressable>

            <Pressable
              testID="filter-apply"
              onPress={apply}
              style={styles.applyButton}
            >
              <Text style={styles.applyText}>Aplicar filtros</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    backgroundColor: '#F5F7FA',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '88%',
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: '#DCE3EC',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  title: {
    color: '#0B1F3A',
    fontSize: 19,
    fontWeight: '900',
  },
  close: {
    color: '#405169',
    fontWeight: '700',
  },
  content: {
    padding: 20,
    paddingBottom: 28,
  },
  sectionTitle: {
    color: '#0B1F3A',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
    marginTop: 12,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCE3EC',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
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
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCE3EC',
    borderRadius: 12,
    borderWidth: 1,
    color: '#0B1F3A',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  error: {
    color: '#B42318',
    marginTop: 14,
  },
  actions: {
    borderTopColor: '#DCE3EC',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  clearButton: {
    alignItems: 'center',
    borderColor: '#0B1F3A',
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 14,
  },
  clearText: {
    color: '#0B1F3A',
    fontWeight: '800',
  },
  applyButton: {
    alignItems: 'center',
    backgroundColor: '#0B1F3A',
    borderRadius: 12,
    flex: 1,
    paddingVertical: 14,
  },
  applyText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
