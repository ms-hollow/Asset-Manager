<script setup>
import { useRouter } from "vue-router";
import ManagerSignUpModal from "../../components/manager/ManagerSignUpModal.vue";
import { useAppToast } from "../../composables/useAppToast";
import { useAuthStore } from "../../stores/apiStore";

const { success, error } = useAppToast();

const router = useRouter();
const authStore = useAuthStore();

function goToEmployee() {
    router.push("/employee");
}

function onClickLogin() {
    router.push("/");
}

async function handleRegister(managerData) {
    try {
        await authStore.registerManager(managerData.values);
        success("Registration successful!");
        router.push("/manager/dashboard");
    } catch (err) {
        const errors = err?.response?.data?.errors;
        if (errors) {
            const messages = Object.values(errors).flat();
            messages.forEach((msg) => error(msg));
        } else {
            error("Something went wrong during registration.");
        }
        console.error("Registration failed:", err);
    }
}
</script>

<template>
    <div class="flex items-center justify-center min-h-screen">
        <div
            @click="goToEmployee"
            class="absolute top-8 right-8 text-sm font-ubuntu font-bold text-black cursor-pointer"
        >
            Employee Sign Up
        </div>

        <div
            class="flex flex-col items-center gap-6 rounded-2xl shadow-2xl p-10"
        >
            <manager-sign-up-modal @register="handleRegister" />
            <div class="text-center">
                Already have an account?
                <span
                    class="text-violet-500 cursor-pointer"
                    @click="onClickLogin"
                    >Login</span
                >
            </div>
        </div>
    </div>
</template>
