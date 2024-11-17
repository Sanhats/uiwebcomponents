// Importaciones locales
import { Tree } from './smart.tree.js';
import { Window } from './smart.window.js';
import { Grid } from './smart.grid.js';

// Componente del panel izquierdo
class LeftPanel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <smart-tree id="navigation-tree"></smart-tree>
        `;

        const tree = this.shadowRoot.querySelector('#navigation-tree');
        tree.dataSource = [
            {
                label: 'RDBMS',
                items: [
                    {
                        label: 'Oracle',
                        items: [
                            {
                                label: 'TESTDB',
                                items: [
                                    { label: 'Tables', items: [{ label: 'Employee' }, { label: 'Department' }] },
                                    { label: 'Views', items: [{ label: 'Emp_View' }, { label: 'Dept_View' }] }
                                ]
                            },
                            {
                                label: 'QADB',
                                items: [
                                    { label: 'Tables', items: [{ label: 'T1' }, { label: 'T2' }] },
                                    { label: 'Views', items: [{ label: 'V1' }, { label: 'V2' }] }
                                ]
                            }
                        ]
                    },
                    { label: 'SQLServer' }
                ]
            },
            // ... (resto de la estructura del árbol)
        ];
    }
}

// Componente del panel central
class CenterPanel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <div id="content">
                <h2>Select an item from the tree</h2>
            </div>
        `;
    }

    updateContent(item) {
        const content = this.shadowRoot.querySelector('#content');
        content.innerHTML = `
            <h2>${item.label}</h2>
            <p>Details for ${item.label}</p>
            <button id="show-details">Show Details</button>
        `;

        const showDetailsButton = content.querySelector('#show-details');
        showDetailsButton.addEventListener('click', () => {
            const event = new CustomEvent('show-details', { detail: item });
            this.dispatchEvent(event);
        });
    }
}

// Componente del panel derecho
class RightPanel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <smart-window id="details-dialog" modal="true" visible="false">
                <div id="dialog-content"></div>
            </smart-window>
        `;

        const dialog = this.shadowRoot.querySelector('#details-dialog');
        dialog.addEventListener('close', () => {
            dialog.visible = false;
        });
    }

    showDetails(item) {
        const dialog = this.shadowRoot.querySelector('#details-dialog');
        const dialogContent = this.shadowRoot.querySelector('#dialog-content');
        dialogContent.innerHTML = `
            <h3>${item.label} Details</h3>
            <form>
                <label for="name">Name:</label>
                <input type="text" id="name" value="${item.label}"><br><br>
                <label for="type">Type:</label>
                <input type="text" id="type" value="${item.type || 'N/A'}"><br><br>
                <button type="submit">Save</button>
            </form>
        `;
        dialog.visible = true;
    }
}

// Componente del panel inferior
class BottomPanel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <smart-grid id="data-grid"></smart-grid>
        `;

        const grid = this.shadowRoot.querySelector('#data-grid');
        grid.dataSource = [
            { id: 1, name: 'John Doe', age: 30 },
            { id: 2, name: 'Jane Smith', age: 25 },
            { id: 3, name: 'Bob Johnson', age: 35 }
        ];
        grid.columns = [
            { label: 'ID', dataField: 'id' },
            { label: 'Name', dataField: 'name' },
            { label: 'Age', dataField: 'age' }
        ];
    }
}

// Registrar componentes personalizados
customElements.define('left-panel', LeftPanel);
customElements.define('center-panel', CenterPanel);
customElements.define('right-panel', RightPanel);
customElements.define('bottom-panel', BottomPanel);

// Inicializar componentes
document.getElementById('left-panel').appendChild(new LeftPanel());
document.getElementById('center-panel').appendChild(new CenterPanel());
document.getElementById('right-panel').appendChild(new RightPanel());
document.getElementById('bottom-panel').appendChild(new BottomPanel());

// Conectar componentes
const leftPanel = document.querySelector('left-panel');
const centerPanel = document.querySelector('center-panel');
const rightPanel = document.querySelector('right-panel');

leftPanel.shadowRoot.querySelector('#navigation-tree').addEventListener('change', (event) => {
    const selectedItem = event.detail.item;
    centerPanel.updateContent(selectedItem);
});

centerPanel.addEventListener('show-details', (event) => {
    rightPanel.showDetails(event.detail);
});