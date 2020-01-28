import {remote } from "electron"

// menu
const Menu = remote.Menu;

const InputMenu = Menu.buildFromTemplate([{
    label: 'Undo',
    role: 'undo',
}, {
    label: 'Redo',
    role: 'redo',
}, {
    type: 'separator',
}, {
    label: 'Cut',
    role: 'cut',
}, {
    label: 'Copy',
    role: 'copy',
}, {
    label: 'Paste',
    role: 'paste',
}, {
    type: 'separator',
}, {
    label: 'Select all',
    role: 'selectAll',
}, ]);


export default function(element: HTMLElement) {
    element.addEventListener('contextmenu', (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        let node = e.target as HTMLInputElement;

        while (node) {
            if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
            InputMenu.popup({
                window: remote.getCurrentWindow()
            });
            break;
            }
            node = node.parentNode as HTMLInputElement;
        }
    });
}