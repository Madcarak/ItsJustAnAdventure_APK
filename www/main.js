document.addEventListener("DOMContentLoaded", () => {
  console.log("JS OK");
});

// Duplication des actions PC vers mobile
document.getElementById("btn-save-mobile")?.addEventListener("click", () => {
    document.getElementById("btn-save")?.click();
});

document.getElementById("btn-load-mobile")?.addEventListener("click", () => {
    document.getElementById("btn-load")?.click();
});

document.getElementById("btn-reset-mobile")?.addEventListener("click", () => {
    document.getElementById("btn-reset")?.click();
});

document.getElementById("btn-help-mobile")?.addEventListener("click", () => {
    document.getElementById("btn-help")?.click();
});
