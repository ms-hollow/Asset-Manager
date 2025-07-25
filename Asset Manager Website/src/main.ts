import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import router from "./router";
import { definePreset } from "@primeuix/themes";
import { createPinia } from "pinia";
import "primeicons/primeicons.css";
import "./styles/style.css";

//PrimeVue Components
import Button from "primevue/button";
import Card from "primevue/card";
import DatePicker from "primevue/datepicker";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";

import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";

const app = createApp(App);

const MyPreset = definePreset(Aura, {
    semantic: {
        colorScheme: {
            primary: {
                50: "{violet.50}",
                100: "{violet.100}",
                200: "{violet.200}",
                300: "{violet.300}",
                400: "{violet.400}",
                500: "{violet.500}", // button bg
                600: "{violet.600}", // hover
                700: "{violet.700}",
                800: "{violet.800}",
                900: "{violet.900}",
                950: "{violet.950}",
            },
            light: {
                surface: {
                    0: "{neutral.50}",
                    50: "{zinc.50}",
                    100: "{zinc.100}",
                    200: "{zinc.200}",
                    300: "{zinc.300}",
                    400: "{zinc.400}",
                    500: "{zinc.500}",
                    600: "{zinc.600}",
                    700: "{zinc.700}",
                    800: "{zinc.800}",
                    900: "{zinc.900}",
                    950: "{zinc.950}",
                },
            },
        },
    },
});

app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: false,
            colorScheme: "light",
        },
    },
});

app.component("Button", Button);
app.component("Card", Card);
app.component("DatePicker", DatePicker);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("Tag", Tag);

const pinia = createPinia();
app.use(ToastService);
app.component("Toast", Toast);
app.use(pinia);
app.use(router);
app.mount("#app");
