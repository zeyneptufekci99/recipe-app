import { AppCard, AppScreen } from "@/components";
import { useGetCategoriesQuery } from "@/features/category/category-api";
import { CategoryList } from "@/features/category/components/category-list";
import { RecipeCardSkeleton } from "@/features/recipe/components/recipe-card-skeleton";
import { RecipeList } from "@/features/recipe/components/recipe-list";
import { RecipeSearchBar } from "@/features/recipe/components/recipe-search-bar";
import { SortSelector } from "@/features/recipe/components/sort-selector";
import { useRecipes } from "@/features/recipe/hooks/use-recipes";
import { useDebounce } from "@/hooks/use-debounce";
import type { RecipeSort } from "@/types/recipe";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface QuickActionProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export default function HomeScreen() {
  const [sortBy, setSortBy] = useState<RecipeSort>("created_desc");

  const [search, setSearch] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >();

  const debouncedSearch = useDebounce(search, 500);

  const { data: categories } = useGetCategoriesQuery();

  const { recipes, isLoading, isFetching, error, loadMore, refresh } =
    useRecipes({
      search: debouncedSearch,
      categoryId: selectedCategoryId,
      sortBy,
    });

  if (isLoading) {
    return (
      <AppScreen>
        <View className="mb-3 h-8 w-28 rounded-full bg-border" />
        <View className="mb-6 h-5 w-52 rounded-full bg-border" />

        <View className="mb-6 h-44 rounded-3xl bg-border" />

        <View className="mb-6 flex-row gap-3">
          <View className="h-28 flex-1 rounded-2xl bg-border" />
          <View className="h-28 flex-1 rounded-2xl bg-border" />
        </View>

        <View className="mb-5 h-12 rounded-2xl bg-border" />

        <View className="gap-4">
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
        </View>
      </AppScreen>
    );
  }

  if (error) {
    return (
      <AppScreen>
        <View className="flex-1 items-center justify-center px-6">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-danger/10">
            <Ionicons name="alert-circle-outline" size={30} color="#D9480F" />
          </View>

          <Text className="mt-4 text-xl font-bold text-text">
            Tarifler yüklenemedi
          </Text>

          <Text className="mt-2 text-center text-sm leading-5 text-muted">
            Bağlantını kontrol edip tekrar deneyebilirsin.
          </Text>

          <TouchableOpacity
            onPress={refresh}
            activeOpacity={0.85}
            className="mt-5 rounded-xl bg-primary px-6 py-3"
          >
            <Text className="font-bold text-white">Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="pb-6"
      >
        <View className="mb-6">
          <Text className="text-4xl font-bold text-text">Cooksy</Text>

          <Text className="mt-1 text-base text-muted">
            AI destekli tarif asistanın
          </Text>
        </View>

        <AppCard className="mb-6 overflow-hidden bg-primary p-5">
          <View className="flex-row items-start">
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <Ionicons name="sparkles" size={25} color="#FFFFFF" />
            </View>

            <View className="ml-4 flex-1">
              <Text className="text-xl font-bold text-white">
                Bugün ne pişireceğiz?
              </Text>

              <Text className="mt-2 text-sm leading-5 text-white/80">
                Elindeki malzemelerle tarif oluşturabilir veya kişisel haftalık
                yemek planını AI ile hazırlayabilirsin.
              </Text>
            </View>
          </View>

          <View className="mt-5 flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push("/generate-recipe")}
              activeOpacity={0.85}
              className="flex-1 items-center rounded-xl bg-white px-3 py-3"
            >
              <Text className="text-sm font-bold text-primary">
                AI Tarif Oluştur
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/meal-planner")}
              activeOpacity={0.85}
              className="flex-1 items-center rounded-xl border border-white/40 px-3 py-3"
            >
              <Text className="text-sm font-bold text-white">Plan Oluştur</Text>
            </TouchableOpacity>
          </View>
        </AppCard>

        <View className="mb-6">
          <Text className="mb-3 text-xl font-bold text-text">
            Hızlı İşlemler
          </Text>

          <View className="flex-row gap-3">
            <QuickAction
              title="Yeni Tarif"
              description="Kendi tarifini ekle"
              icon="add-circle-outline"
              onPress={() => router.push("/recipe/create")}
            />

            <QuickAction
              title="URL'den Aktar"
              description="İnternetten tarif al"
              icon="link-outline"
              onPress={() => router.push("/import-recipe")}
            />
          </View>

          <View className="mt-3 flex-row gap-3">
            <QuickAction
              title="Yemek Planı"
              description="Haftanı planla"
              icon="calendar-outline"
              onPress={() => router.push("/meal-planner")}
            />

            <QuickAction
              title="Koleksiyonlar"
              description="Tariflerini grupla"
              icon="albums-outline"
              onPress={() => router.push("/collections")}
            />
          </View>
        </View>

        <View className="mb-5">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-text">Tariflerin</Text>

            <Text className="text-sm font-semibold text-primary">
              {recipes.length} tarif
            </Text>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <RecipeSearchBar value={search} onChangeText={setSearch} />
            </View>

            <SortSelector value={sortBy} onChange={setSortBy} />
          </View>
        </View>

        <View className="mb-5">
          <CategoryList
            categories={categories ?? []}
            selectedCategoryId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />
        </View>

        {recipes.length === 0 ? (
          <AppCard className="items-center py-10">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Ionicons name="restaurant-outline" size={29} color="#E85D04" />
            </View>

            <Text className="mt-4 text-lg font-bold text-text">
              Tarif bulunamadı
            </Text>

            <Text className="mt-2 px-6 text-center text-sm leading-5 text-muted">
              Arama veya kategori filtrelerini değiştirerek tekrar
              deneyebilirsin.
            </Text>
          </AppCard>
        ) : (
          <RecipeList
            recipes={recipes}
            refreshing={isFetching && !isLoading}
            onRefresh={refresh}
            onEndReached={loadMore}
          />
        )}
      </ScrollView>
    </AppScreen>
  );
}

function QuickAction({ title, description, icon, onPress }: QuickActionProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="flex-1 rounded-2xl border border-border bg-surface p-4"
    >
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
        <Ionicons name={icon} size={22} color="#E85D04" />
      </View>

      <Text className="mt-4 font-bold text-text">{title}</Text>

      <Text className="mt-1 text-xs leading-5 text-muted">{description}</Text>
    </TouchableOpacity>
  );
}
