import { categoryService } from "@/services/category-service";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Home() {
  useEffect(() => {
    categoryService
      .getAll()
      .then((res) => console.log("Categories:", res.data))
      .catch((err) => console.log("API Error:", err.message));
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>RecipeApp</Text>
    </View>
  );
}
