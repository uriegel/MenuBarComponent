import '../src/index.js'
import './menu.js'
console.log("Started")

export const onHidden = isChecked => isHidden.checked = isChecked

var setHidden = document.getElementById("setHidden")
var isHidden = document.getElementById("isHidden")
var showProperties = document.getElementById("showProperties")
var properties = document.getElementById("properties")

isHidden.addEventListener("change", evt => {
    setHidden.isChecked = isHidden.checked
    console.log("Hid" , isHidden.checked)
})
showProperties.addEventListener("change", evt => {
    properties.isHidden = !showProperties.checked
})
 
