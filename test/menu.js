import { onHidden } from './index.js'

window.onRename = () => alert("Rename")
window.onExtendedRename = () => alert("Extended Rename")
window.onCopy = () => alert("Copy Files")
window.onMove = () => console.log("Move Files")
window.onProperties = () => console.log("onProperties")

window.onDarkTheme = isChecked => {
    if (isChecked)
        document.body.classList.add("darkTheme")
    else
        document.body.classList.remove("darkTheme")
}

window.selectAll = () => console.log("selectAll")
window.selectNone = () => console.log("selectNone")

window.onHidden = isChecked => onHidden(isChecked)

window.onDevTools = isChecked => {
    console.log(`Dev tools ${isChecked}`)
}

window.onClose = () => close()