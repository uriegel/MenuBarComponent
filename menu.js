import { setHiddenCallback } from "./index.js"

window.onRename = () => {
    alert("Rename")
}

window.onExtendedRename = () => {
    alert("Extended Rename")
}

window.onCopy = () => {
    alert("Copy Files")
}

window.onMove = () => {
    console.log("Move Files")
}

window.onHidden = isChecked => {
    console.log(`Show hidden ${isChecked}`)
}

window.setHidden = mi => setHiddenCallback(isChecked => mi.isChecked = isChecked)

window.onDevTools = isChecked => {
    console.log(`Dev tools ${isChecked}`)
}