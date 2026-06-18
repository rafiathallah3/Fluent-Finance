import { View, StyleSheet, ScrollView } from 'react-native';
import { CustomText as Text } from '../../components/CustomText';

export default function TermsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text weight="bold" style={styles.title}>Terms & Policy</Text>
      <Text style={styles.text}>
        This is a placeholder for the terms and conditions and privacy policy. 
        Please insert the actual legal content here.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#94a3b8',
    lineHeight: 24,
  },
});
