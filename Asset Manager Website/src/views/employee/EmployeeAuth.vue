<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import EmployeeSignUpModal from "@/components/employee/EmployeeSignUpModal.vue";
import { useAppToast } from "../../composables/useAppToast";
import { useAuthStore } from "../../stores/apiStore";

const { success, error } = useAppToast();

const router = useRouter();
const authStore = useAuthStore();

function goToManager() {
    router.push("/manager");
}

function onClickLogin() {
    router.push("/");
}

async function handleRegister(employeeData) {
    try {
        await authStore.registerEmployee(employeeData.values);
        success("Registration successful!");
        router.push("/employee/dashboard");
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
            @click="goToManager"
            class="absolute top-8 right-8 text-sm font-bold text-black cursor-pointer"
        >
            Manager Sign Up
        </div>

        <div
            class="flex flex-col items-center gap-6 rounded-2xl shadow-2xl p-10"
        >
            <employee-sign-up-modal @register="handleRegister" />
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
