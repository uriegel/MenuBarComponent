import '../src/index.js'
import { MenuItem } from '../src/index.js'
console.log("Started")

export const onHidden = (isChecked: boolean) => isHidden.checked = isChecked

var setHidden = document.getElementById("setHidden") as MenuItem
var isHidden = document.getElementById("isHidden") as HTMLInputElement
var showProperties = document.getElementById("showProperties") as HTMLInputElement
var properties = document.getElementById("properties") as MenuItem

isHidden.addEventListener("change", evt => {
    setHidden.isChecked = isHidden.checked
    console.log("Hid" , isHidden.checked)
})
showProperties.addEventListener("change", evt => {
    properties.isHidden = !showProperties.checked
})
 
