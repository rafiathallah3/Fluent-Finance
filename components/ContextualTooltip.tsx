import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Modal, TouchableWithoutFeedback } from 'react-native';
import { CustomText as Text } from './CustomText';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { Pin } from 'lucide-react-native';

interface TooltipProps {
  term: string;
  explanation: string;
  metaphor: string;
  children: React.ReactNode;
  screenContext: string;
  forceOpenForDemo?: boolean;
}

export default function ContextualTooltip({
  term,
  explanation,
  metaphor,
  children,
  forceOpenForDemo = false,
}: TooltipProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpen = () => setModalVisible(true);
  const handleClose = () => setModalVisible(false);

  const renderTooltipCard = () => (
    <Animated.View
      entering={SlideInDown.duration(300).springify()}
      style={forceOpenForDemo ? styles.inlineCard : styles.tooltipCard}
    >
      <View style={styles.topPill} />
      
      <View style={styles.header}>
        <Pin size={20} color="#ec4899" fill="#ec4899" style={{ transform: [{ rotate: '45deg' }] }} />
        <Text style={styles.title}>{term}</Text>
      </View>
      
      <Text style={styles.explanation}>{explanation}</Text>
      
      <View style={styles.metaphorBox}>
        <Text style={styles.metaphorText}>"{metaphor}"</Text>
      </View>

      {!forceOpenForDemo && (
        <Pressable style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeButtonText}>LEARN MORE →</Text>
        </Pressable>
      )}
      
      {forceOpenForDemo && (
        <View style={{ alignItems: 'flex-start', marginTop: 16 }}>
          <Pressable style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>LEARN MORE →</Text>
          </Pressable>
        </View>
      )}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {!forceOpenForDemo && (
        <Pressable
          onPress={handleOpen}
          style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}
        >
          {typeof children === 'string' ? (
            <Text style={styles.triggerText}>{children}</Text>
          ) : (
            children
          )}
        </Pressable>
      )}

      {forceOpenForDemo ? (
        renderTooltipCard()
      ) : (
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleClose}
        >
          <TouchableWithoutFeedback onPress={handleClose}>
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              style={styles.modalOverlay}
            >
              <TouchableWithoutFeedback>
                <View style={styles.modalContentWrapper}>
                  {renderTooltipCard()}
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  trigger: {
    borderBottomWidth: 1,
    borderBottomColor: '#0ea5e9',
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 2,
    alignSelf: 'flex-start',
  },
  triggerPressed: {
    opacity: 0.7,
  },
  triggerText: {
    color: '#0ea5e9',
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end', // Bottom sheet style like the image
  },
  modalContentWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 40,
  },
  inlineCard: {
    width: '100%',
    backgroundColor: '#142337',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1e2f47',
    borderTopColor: '#0ea5e9', // top highlight
  },
  tooltipCard: {
    width: '95%',
    backgroundColor: '#142337',
    borderRadius: 24,
    padding: 24,
    borderTopWidth: 2,
    borderTopColor: '#0ea5e9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  topPill: {
    width: 40,
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0ea5e9', // Cyan color for tooltip titles
  },
  explanation: {
    fontSize: 15,
    color: '#cbd5e1',
    lineHeight: 22,
    marginBottom: 20,
  },
  metaphorBox: {
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#facc15',
  },
  metaphorText: {
    fontSize: 14,
    color: '#facc15', // Yellow text
    fontStyle: 'italic',
    lineHeight: 20,
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
