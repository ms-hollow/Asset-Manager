<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { MonitorSmartphone, History, LogOut, User2 } from "lucide-vue-next";
import { useAuthStore } from "@/stores/apiStore";
import CookieService from "../../service/cookieService";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const currentRole = ref("");
const activeRole = ref("");
const cookieService = new CookieService();

onMounted(() => {
    authStore.fetchUser().then(() => {
        currentRole.value = authStore.user.role.toLowerCase();

        // Load persisted role if assetmanager
        const savedRole = localStorage.getItem("activeRole");
        if (currentRole.value === "assetmanager" && savedRole) {
            activeRole.value = savedRole;
        } else {
            activeRole.value = currentRole.value;
        }

        // Auto-redirect to proper dashboard if current route mismatches
        const dashboardPath =
            activeRole.value === "employee"
                ? "/employee/dashboard"
                : "/manager/dashboard";

        if (
            !route.path.includes("/employee") &&
            !route.path.includes("/manager")
        ) {
            router.push(dashboardPath);
        }
    });
});

const employeeLinks = [
    { name: "Asset", icon: MonitorSmartphone, path: "/employee/dashboard" },
    { name: "Requests History", icon: History, path: "/employee/requests" },
];

const assetManagerLinks = [
    { name: "Assets", icon: MonitorSmartphone, path: "/manager/dashboard" },
    { name: "Requests", icon: History, path: "/manager/requests" },
];

// Function to navigate to different routes
const goTo = (path) => {
    router.push(path);
};

const logout = async () => {
    try {
        await authStore.logout();
        cookieService.destroyCookie("access_token");
        router.push("/");
    } catch (error) {
        console.error("Logout failed:", error);
    }
};

// Function to toggle between employee and asset manager roles
const toggleRole = () => {
    // Prevent switching if real role is employee
    if (currentRole.value === "employee") return;

    activeRole.value =
        activeRole.value === "employee" ? "assetmanager" : "employee";

    localStorage.setItem("activeRole", activeRole.value);

    const path =
        activeRole.value === "employee"
            ? "/employee/dashboard"
            : "/manager/dashboard";

    router.push(path);
};
</script>

<template>
    <aside
        class="w-64 h-screen bg-white shadow-md flex flex-col p-6 fixed top-0 left-0 z-10"
    >
        <!-- Navigation Links -->
        <nav class="flex flex-col gap-4">
            <h1 class="text-xl font-semibold mb-4">
                {{ activeRole === "employee" ? "Employee" : "Asset Manager" }}
            </h1>
            <button
                v-for="link in activeRole === 'employee'
                    ? employeeLinks
                    : assetManagerLinks"
                :key="link.name"
                @click="goTo(link.path)"
                class="flex items-center gap-3 text-sm font-medium rounded-lg px-3 py-2 transition-colors"
                :class="{
                    'bg-gray-200 text-black': route.path === link.path,
                    'text-brand-tertiary hover:bg-gray-100':
                        route.path !== link.path,
                }"
            >
                <component :is="link.icon" class="w-5 h-5" />
                {{ link.name }}
            </button>
        </nav>

        <!-- Bottom Section -->
        <div class="mt-auto pt-6 border-t border-gray-200 flex flex-col gap-4">
            <!-- Show switch only for manager -->
            <button
                v-if="currentRole === 'assetmanager'"
                @click="toggleRole"
                class="flex items-center gap-3 text-sm font-medium text-black hover:text-brand-primary transition"
            >
                <User2 class="w-5 h-5" />
                Switch to
                {{ activeRole === "employee" ? "Asset Manager" : "Employee" }}
            </button>

            <!-- Logout Button -->
            <button
                @click="logout"
                class="flex items-center gap-3 text-sm font-medium text-red-500 hover:text-red-600 transition"
            >
                <LogOut class="w-5 h-5" />
                Logout
            </button>
        </div>
    </aside>
</template>
