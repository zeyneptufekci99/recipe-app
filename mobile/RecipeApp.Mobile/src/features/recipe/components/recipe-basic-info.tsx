import { Text, TextInput, View } from "react-native";

interface RecipeBasicInfoProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function RecipeBasicInfo({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: RecipeBasicInfoProps) {
  return (
    <>
      <View>
        <Text className="mb-2 text-base font-semibold text-text">Title</Text>

        <TextInput
          value={title}
          onChangeText={onTitleChange}
          placeholder="Recipe title"
          className="rounded-xl border border-border bg-surface px-4 py-4 text-text"
        />
      </View>

      <View>
        <Text className="mb-2 text-base font-semibold text-text">
          Description
        </Text>

        <TextInput
          value={description}
          onChangeText={onDescriptionChange}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          placeholder="Describe your recipe..."
          className="min-h-32 rounded-xl border border-border bg-surface px-4 py-4 text-text"
        />
      </View>
    </>
  );
}
