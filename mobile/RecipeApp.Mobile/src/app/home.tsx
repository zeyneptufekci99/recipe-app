import { useGetCategoriesQuery } from "@/features/category/category-api";
import { Text, View } from "react-native";

export default function HomeScreen() {
  const { data, isLoading, error } = useGetCategoriesQuery();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Category error</Text>;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home</Text>

      {data?.map((category) => (
        <Text key={category.id}>{category.name}</Text>
      ))}
    </View>
  );
}
