import { categoryService } from "@/services/category-service";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Home() {
  useEffect(() => {
    categoryService
      .getAll()
      .then((res) => console.log(res.data))
      .catch(console.error);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>RecipeApp</Text>
    </View>
  );
}
