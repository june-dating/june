import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInUp,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

interface InsightModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  icon: any;
  points: string[];
  color?: string;
  iconLibrary?: string;
  onEdit?: () => void;
  onSavePoints?: (newPoints: string[]) => void;
}

export default function InsightModal({
  visible,
  onClose,
  title,
  icon,
  points,
  color = "#C6B2FF",
  iconLibrary = "Ionicons",
  onEdit,
  onSavePoints,
}: InsightModalProps) {
  const insets = useSafeAreaInsets();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editablePoints, setEditablePoints] = useState<string[]>([]);

  useEffect(() => {
    setEditablePoints(points);
  }, [points]);

  const handleClose = () => {
    setIsEditMode(false);
    onClose();
  };

  const handleEdit = () => {
    setIsEditMode(true);
    if (onEdit) {
      onEdit();
    }
  };

  const handleSave = () => {
    const filteredPoints = editablePoints.filter(
      (point) => point.trim() !== ""
    );
    if (onSavePoints) {
      onSavePoints(filteredPoints);
    }
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setEditablePoints(points);
    setIsEditMode(false);
  };

  const updatePoint = (index: number, newText: string) => {
    const updatedPoints = [...editablePoints];
    updatedPoints[index] = newText;
    setEditablePoints(updatedPoints);
  };

  const addNewPoint = () => {
    setEditablePoints([...editablePoints, ""]);
  };

  const removePoint = (index: number) => {
    const updatedPoints = editablePoints.filter((_, i) => i !== index);
    setEditablePoints(updatedPoints);
  };

  const IconComponent =
    iconLibrary === "MaterialCommunityIcons"
      ? MaterialCommunityIcons
      : Ionicons;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={!isEditMode ? handleClose : undefined}
      >
        <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
        <Animated.View
          style={[
            styles.modalContainer,
            { marginTop: insets.top + height * 0.15 },
          ]}
          entering={SlideInDown.duration(400).easing(Easing.out(Easing.cubic))}
          exiting={SlideOutDown.duration(300).easing(Easing.in(Easing.cubic))}
        >
          <View style={styles.modalContent}>
            <Animated.View
              entering={FadeInUp.delay(200).duration(300)}
              exiting={SlideOutDown.duration(200)}
              style={styles.modalTopButtons}
            >
              {!isEditMode ? (
                <>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleEdit}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="create-outline" size={16} color="#fff" />
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleClose}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancel}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="checkmark" size={20} color="#fff" />
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </>
              )}
            </Animated.View>

            <Animated.View
              style={styles.modalHeader}
              entering={FadeInUp.delay(100).duration(400)}
            >
              <View
                style={[
                  styles.modalIconContainer,
                  { backgroundColor: color + "20" },
                ]}
              >
                <IconComponent name={icon} size={32} color={color} />
              </View>
              <Text style={[styles.modalTitle, { color: "#fff" }]}>
                {title}
              </Text>
            </Animated.View>

            <ScrollView
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
            >
              {editablePoints.map((point: string, idx: number) => (
                <Animated.View
                  key={idx}
                  style={styles.modalPointContainer}
                  entering={FadeInUp.delay(idx * 150 + 300).duration(500)}
                >
                  <View
                    style={[
                      styles.modalBulletContainer,
                      { backgroundColor: color },
                    ]}
                  >
                    <Text style={styles.modalBullet}>{idx + 1}</Text>
                  </View>

                  {!isEditMode ? (
                    <Text style={styles.modalPointText}>{point}</Text>
                  ) : (
                    <View style={styles.editPointContainer}>
                      <TextInput
                        style={styles.editPointInput}
                        value={point}
                        onChangeText={(text) => updatePoint(idx, text)}
                        placeholder="Enter point..."
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        multiline={true}
                        textAlignVertical="top"
                      />
                      <TouchableOpacity
                        style={styles.removePointButton}
                        onPress={() => removePoint(idx)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color="#FF6B6B"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </Animated.View>
              ))}

              {isEditMode && (
                <Animated.View
                  style={styles.addPointContainer}
                  entering={FadeInUp.delay(300).duration(500)}
                >
                  <TouchableOpacity
                    style={[styles.addPointButton, { borderColor: color }]}
                    onPress={addNewPoint}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add" size={24} color={color} />
                    <Text style={[styles.addPointText, { color: color }]}>
                      Add Point
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </ScrollView>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContainer: {
    width: width * 0.92,
    height: height * 0.7,
    maxHeight: height * 0.7,
  },
  modalContent: {
    flex: 1,
    backgroundColor: "rgba(40, 40, 40, 0.95)",
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  modalTopButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.4)",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  cancelButtonText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "600",
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 12,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    fontFamily: "Fraunces",
    lineHeight: 28,
  },
  modalScrollView: {
    flex: 1,
  },
  modalPointContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingRight: 8,
  },
  modalBulletContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    flexShrink: 0,
    marginTop: 2,
  },
  modalBullet: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  modalPointText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 24,
    fontWeight: "400",
    flex: 1,
  },
  editPointContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  editPointInput: {
    flex: 1,
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    minHeight: 48,
    fontWeight: "400",
  },
  removePointButton: {
    marginLeft: 8,
    padding: 4,
    marginTop: 8,
  },
  addPointContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
  addPointButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  addPointText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
