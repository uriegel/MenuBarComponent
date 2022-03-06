import '../src/index.js';
console.log("Started");
export const onHidden = (isChecked) => isHidden.checked = isChecked;
document.getElementById("onRename")?.addEventListener("menubar-action", (evt) => {
    console.log("Geklickt", evt);
});
document.getElementById("onDarkTheme")?.addEventListener("menubar-checkbox", (evt) => {
    console.log("Checked", evt.detail.isChecked);
});
const setHidden = document.getElementById("setHidden");
const isHidden = document.getElementById("isHidden");
const showProperties = document.getElementById("showProperties");
const properties = document.getElementById("properties");
isHidden.addEventListener("change", evt => {
    setHidden.isChecked = isHidden.checked;
    console.log("Hid", isHidden.checked);
});
showProperties.addEventListener("change", evt => {
    properties.isHidden = !showProperties.checked;
});
//# sourceMappingURL=index.js.map