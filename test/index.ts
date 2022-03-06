import '../src/index.js'
import { MenuItem } from '../src/index.js'
console.log("Started")

export const onHidden = (isChecked: boolean) => isHidden.checked = isChecked


document.getElementById("onRename")?.addEventListener("menubar-action", (evt: Event) => {
    console.log("Geklickt", evt)
})
document.getElementById("onDarkTheme")?.addEventListener("menubar-checkbox", (evt: Event) => {
    console.log("Checked", (evt as CustomEvent).detail.isChecked)
})

const setHidden = document.getElementById("setHidden") as MenuItem
const isHidden = document.getElementById("isHidden") as HTMLInputElement
const showProperties = document.getElementById("showProperties") as HTMLInputElement
const properties = document.getElementById("properties") as MenuItem

isHidden.addEventListener("change", evt => {
    setHidden.isChecked = isHidden.checked
    console.log("Hid" , isHidden.checked)
})
showProperties.addEventListener("change", evt => {
    properties.isHidden = !showProperties.checked
})
 
