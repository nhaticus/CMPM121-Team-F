// localization.js

const translations = {
    en: {
        POPUP_SLEEP: "Would you like to go to sleep?",
        HARVESTED_ALL: "You Harvested Every Type of Plant!",
        SAVE_SLOT: "Select a Save Slot.",
        YES: "Yes",
        NO: "No",
        DAY_TEXT: "Day: ", // Example dynamic text
        HARVEST: "Harvest",
        WATER: "Water",
        SAVE : "Save",
        CLOSE: "Close",
        DAYS_PLANTED: "Days Planted: ",
        WATER_LEVEL: "Water Level: ",
        CURRENT_SUNLIGHT: "Current Sunlight: ",
        REQUIREMENTS: "Requirements: ",
        PLANT_LEVEL: "Plant Level: ",
        SURROUND: "Surrounding Plants: ",
        SUN_REQ: "Sunlight: ",
        WATER_REQ: "Water: ",

        // Add more keys as needed
    },
    // Add additional languages here
};

// Default language
let currentLanguage = "en";

// Translation function
function t(key) {
    return translations[currentLanguage][key] || key;
}

// Function to change the current language
function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        console.log(`Language set to: ${lang}`);
    } else {
        console.warn(`Language ${lang} is not available.`);
    }
}

// Export everything for use in other files
//export { t, setLanguage, currentLanguage, translations };
