<script setup>
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Tag from "primevue/tag";
import { computed, onMounted, ref } from "vue";
import { getEmployeeRentals, putRentalStatus } from "../../api/rentalApi";

const buttons = [
    "All",
    "Confirmed Request",
    "Pending Request",
    "Returned Assets",
];
const selected = ref("All");
const rents = ref([]);

const fetchRents = async () => {
    try {
        const response = await getEmployeeRentals();
        rents.value = response.data;
        console.log("Fetched Rents:", rents.value);
    } catch (error) {
        console.error("Error fetching rents:", error);
    }
};

// Dynamic filtering based on selected button
const products = computed(() => {
    if (selected.value === "All") return rents.value;
    if (selected.value === "Confirmed Request")
        return rents.value.filter((p) => p.rentalStatus === "Confirmed");
    if (selected.value === "Pending Request")
        return rents.value.filter((p) => p.rentalStatus === "Pending");
    if (selected.value === "Returned Assets")
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
    await fetchRents();
});

function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

// Function to update the status of an item
async function updateStatus(item, newStatus) {
    try {
        await putRentalStatus(item.id, newStatus);
        await fetchRents();
    } catch (error) {
        console.error("Failed to update status", error);
    }
}
</script>

<template>
    <div class="px-16 py-4">
        <h1 class="text-2xl font-semibold">Asset Requests</h1>
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
                <Column field="employeeName" header="Employee Name"></Column>
                <Column field="assetName" header="Item Name"></Column>

                <Column field="startDate" header="Start Date">
                    <template #body="slotProps">
                        {{ formatDate(slotProps.data.borrowedStart) }}
                    </template>
                </Column>

                <Column field="date" header="End Date">
                    <template #body="slotProps">
                        {{ formatDate(slotProps.data.borrowedEnd) }}
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

                <Column header="Action">
                    <template #body="slotProps">
                        <div class="flex gap-2">
                            <Button
                                v-if="
                                    slotProps.data.rentalStatus === 'Pending'
                                "
                                label="Approve"
                                severity="danger"
                                size="small"
                                text
                                @click="
                                    updateStatus(slotProps.data, 'Approved')
                                "
                            />

                            <Button
                                v-else-if="
                                    slotProps.data.rentalStatus ===
                                    'Confirmed'
                                "
                                label="Return"
                                severity="warning"
                                size="small"
                                text
                                @click="
                                    updateStatus(slotProps.data, 'Returned')
                                "
                            />

                            <Button
                                v-else-if="
                                    slotProps.data.rentalStatus ===
                                    'Returned'
                                "
                                label="Completed"
                                severity="success"
                                size="small"
                                text
                                disabled
                            />
                        </div>
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
