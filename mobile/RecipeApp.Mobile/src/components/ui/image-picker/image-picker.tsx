import { toastService } from "@/services/toast-service";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ExpoImagePicker from "expo-image-picker";
import { Text, TouchableOpacity, View } from "react-native";

interface ImagePickerProps {
  imageUri?: string;
  onChange: (uri: string) => void;
}

export function ImagePicker({ imageUri, onChange }: ImagePickerProps) {
  const pickImage = async () => {
    const permission =
      await ExpoImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      toastService.error(
        "Image permission required",
        "Please allow access to your photos to select an image.",
      );

      return;
    }

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (result.canceled) return;

    onChange(result.assets[0].uri);
  };

  return (
    <View>
      <Text className="mb-3 text-base font-semibold text-text">
        Recipe Image
      </Text>

      <TouchableOpacity
        onPress={pickImage}
        activeOpacity={0.9}
        className="items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-surface"
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            contentFit="cover"
            className="h-56 w-full"
          />
        ) : (
          <View className="h-56 items-center justify-center">
            <Ionicons name="camera-outline" size={42} color="#E85D04" />

            <Text className="mt-3 text-base font-semibold text-text">
              Select Image
            </Text>

            <Text className="mt-1 text-sm text-muted">
              Tap to choose a photo
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {imageUri ? (
        <TouchableOpacity onPress={pickImage}>
          <Text className="mt-3 text-center font-semibold text-primary">
            Change Image
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
