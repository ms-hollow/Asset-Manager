<script setup>
import AssetCard from "@/components/common/AssetCard.vue";
import CategoryCard from "@/components/common/CategoryCard.vue";
import AssetModal from "@/components/employee/AssetModal.vue";
import { XCircle } from "lucide-vue-next";
import Paginator from "primevue/paginator";
import { computed, onMounted, ref } from "vue";
import { getAllAssets } from "../../api/assetApi";
import categories from "../../assets/data/categoryDummy.json";

const selectedCategory = ref(null);
const first = ref(0);
const itemsPerPage = 10;
const searchQuery = ref("");
const showModal = ref(false);
const selectedAsset = ref(null);
const assets = ref([]);

const filteredAssets = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return selectedCategory.value
        ? assets.value.filter(
              (asset) =>
                  asset.category === selectedCategory.value &&
                  asset.name.toLowerCase().includes(query)
          )
        : assets.value.filter((asset) =>
              asset.name.toLowerCase().includes(query)
          );
});

const paginatedAssets = computed(() => {
    return filteredAssets.value.slice(first.value, first.value + itemsPerPage);
});

const fetchAssets = async () => {
    const res = await getAllAssets();
    assets.value = res.data;
};

onMounted(async () => {
    // Fetch all assets from the API
    await fetchAssets();
});

function onPageChange(newFirst) {
    first.value = newFirst;
}

function selectCategory(categoryName) {
    selectedCategory.value = categoryName;
    first.value = 0;
}

function resetCategory() {
    selectedCategory.value = null;
    first.value = 0;
    searchQuery.value = "";
}

function openModal(asset) {
    selectedAsset.value = asset;
    showModal.value = true;
}

const currentRange = computed(() => {
    return {
        start: first.value + 1,
        end: Math.min(first.value + itemsPerPage, filteredAssets.value.length),
    };
});
</script>

<template>
    <div class="px-16 py-4">
        <!-- Category Section -->
        <div class="mt-6 w-full px-4 sm:px-6 lg:px-8">
            <h2 class="text-lg text-brand-black font-semibold font-ubuntu mb-2">
                Category
            </h2>
            <div
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4"
            >
                <CategoryCard
                    v-for="(cat, i) in categories"
                    :key="i"
                    :name="cat.name"
                    :image="cat.image"
                    @click="selectCategory(cat.name)"
                />
            </div>
        </div>

        <!-- Assets Section -->
        <div class="mt-8 px-4 sm:px-6 lg:px-8">
            <h2 class="text-lg text-brand-black font-semibold font-ubuntu mb-2">
                Available Assets
            </h2>

            <!-- Search Input -->
            <div class="flex items-center justify-between mb-4 flex-wrap gap-4">
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search assets..."
                    class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 w-full sm:max-w-xs"
                />
                <button
                    v-if="selectedCategory"
                    @click="resetCategory"
                    class="flex items-center px-4 py-2 border border-brand-primary text-brand-primary text-xs rounded-full"
                >
                    <XCircle class="inline-block w-4 h-4 mr-2" />
                    Clear
                </button>
            </div>

            <!-- Asset Grid -->
            <div
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
                <AssetCard
                    v-for="item in paginatedAssets"
                    :key="item.id"
                    :name="item.name"
                    :description="item.description"
                    :image="item.imageUrl"
                    @click="openModal(item)"
                />
            </div>

            <div class="mt-6 flex justify-center">
                <Paginator
                    :rows="itemsPerPage"
                    :totalRecords="filteredAssets.length"
                    :first="first"
                    @update:first="onPageChange"
                />
            </div>
        </div>
    </div>

    <!-- Asset Modal Component -->
    <AssetModal v-model="showModal" :asset="selectedAsset" />
</template>
