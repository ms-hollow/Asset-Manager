<script setup>
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Tag from "primevue/tag";
import { computed, onMounted, ref } from "vue";
import { getEmployeeRentals } from "../../api/rentalApi";
import { useAuthStore } from "../../stores/apiStore";

const buttons = ["All", "Active Request", "Past Request"];
const selected = ref("All");
const rents = ref([]);

const authStore = useAuthStore();
const employeeId = ref(authStore.user?.id || "");

const fetchRents = async (id) => {
    try {
        const response = await getEmployeeRentals(id);
        rents.value = response.data;
    } catch (error) {
        console.error("Error fetching rents:", error);
    }
};

// Dynamic filtering based on selected button
const products = computed(() => {
    if (selected.value === "All") return rents.value;
    if (selected.value === "Active Request")
        return rents.value.filter((p) =>
            ["Pending", "Confirmed"].includes(p.rentalStatus)
        );
    if (selected.value === "Past Request")
        return rents.value.filter((p) => p.rentalStatus === "Returned");
    return [];
});

// Severity for PrimeVue Tag
const getSeverity = (product) => {
    switch (product.rentalStatus) {
        case "Returned":
            return "success";
        case "Confirmed":
            return "warning";
        case "Pending":
            return "danger";
        default:
            return null;
    }
};

onMounted(async () => {
    if (employeeId.value) {
        fetchRents(employeeId.value);
    }
});

// Optional: formatter helpers
function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

function formatCurrency(value) {
    const num = Number(value);
    if (isNaN(num)) return "€ 0.00";
    return `€ ${num.toFixed(2)}`;
}
</script>

<template>
    <div class="px-16 py-4">
        <h1 class="text-2xl font-semibold">My Requests</h1>
        <div class="flex gap-2 mt-4">
            <Button
                v-for="btn in buttons"
                :key="btn"
                :label="btn"
                @click="selected = btn"
                :class="[
                    'rounded-full px-4 py-2 text-sm',
                    selected === btn
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-gray-300 hover:bg-gray-100',
                ]"
                :outlined="selected !== btn"
            />
        </div>

        <div class="mt-6">
            <DataTable :value="products" tableStyle="min-width: 50rem">
                <template #header>
                    <div
                        class="flex flex-wrap items-center justify-between gap-2"
                    >
                        <span class="text-xl font-bold">Products</span>
                        <Button icon="pi pi-refresh" rounded raised />
                    </div>
                </template>
                <Column field="assetName" header="Name" />
                <Column header="Image">
                    <template #body="slotProps">
                        <img
                            :src="slotProps.data.imageUrl"
                            :alt="slotProps.data.name"
                            class="w-24 h-24 object-cover rounded"
                        />
                    </template>
                </Column>
                <Column field="date" header="Date">
                    <template #body="slotProps">
                        {{ formatDate(slotProps.data.borrowedStart) }}
                    </template>
                </Column>
                <Column field="price" header="Price">
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.amount) }}
                    </template>
                </Column>
                <Column header="Status">
                    <template #body="slotProps">
                        <Tag
                            :value="slotProps.data.rentalStatus"
                            :severity="getSeverity(slotProps.data)"
                        />
                    </template>
                </Column>
                <template #footer>
                    In total there are
                    {{ products ? products.length : 0 }} products.
                </template>
            </DataTable>
        </div>
    </div>
</template>
