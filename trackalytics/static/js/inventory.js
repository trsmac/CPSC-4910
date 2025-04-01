class InventoryManager {
    constructor(options) {
        this.options = options;
        this.initElements();
        this.bindEvents();
        this.loadInitialData();
    }

    initElements() {
        this.addForm = document.querySelector(this.options.addForm);
        this.removeForm = document.querySelector(this.options.removeForm);
        this.editForm = document.querySelector(this.options.editForm);
        this.tableBody = document.querySelector(this.options.tableBody);
        this.modal = document.querySelector(this.options.modal);
        this.refreshBtn = document.querySelector('#refreshInventory');
        this.exportBtn = document.querySelector('#exportCsv');
        this.closeModal = document.querySelector('.close-modal');
    }

    bindEvents() {
        // Form submissions
        this.addForm?.addEventListener('submit', (e) => this.handleAddInventory(e));
        this.removeForm?.addEventListener('submit', (e) => this.handleRemoveInventory(e));
        this.editForm?.addEventListener('submit', (e) => this.handleEditInventory(e));
        
        // Table actions
        this.tableBody?.addEventListener('click', (e) => {
            if (e.target.closest('.edit-item')) {
                this.showEditModal(e.target.closest('.edit-item').dataset.id);
            }
            if (e.target.closest('.delete-item')) {
                this.confirmDelete(e.target.closest('.delete-item').dataset.id);
            }
        });
        
        // Other UI actions
        this.refreshBtn?.addEventListener('click', () => this.refreshInventory());
        this.exportBtn?.addEventListener('click', () => this.exportInventory());
        this.closeModal?.addEventListener('click', () => this.closeEditModal());
    }

    async loadInitialData() {
        try {
            const response = await fetch(this.options.apiUrl, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            const data = await response.json();
            this.updateInventoryTable(data.inventory);
            this.checkLowStock(data.low_stock);
        } catch (error) {
            console.error('Error loading inventory:', error);
            this.showToast('Error loading inventory data', 'error');
        }
    }

    async handleAddInventory(e) {
        e.preventDefault();
        const formData = new FormData(this.addForm);
        
        try {
            const response = await fetch(this.options.apiUrl, {
                method: 'POST',
                body: formData,
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            const data = await response.json();
            
            if (data.success) {
                this.showToast('Inventory item added successfully', 'success');
                this.addForm.reset();
                this.updateInventoryTable(data.inventory);
                this.checkLowStock(data.low_stock);
            } else {
                this.showToast(data.error || 'Error adding inventory', 'error');
            }
        } catch (error) {
            console.error('Error adding inventory:', error);
            this.showToast('Error adding inventory item', 'error');
        }
    }

    async handleRemoveInventory(e) {
        e.preventDefault();
        const formData = new FormData(this.removeForm);
        
        try {
            const response = await fetch(this.options.apiUrl, {
                method: 'POST',
                body: formData,
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            const data = await response.json();
            
            if (data.success) {
                this.showToast('Inventory item removed successfully', 'success');
                this.removeForm.reset();
                this.updateInventoryTable(data.inventory);
                this.checkLowStock(data.low_stock);
            } else {
                this.showToast(data.error || 'Error removing inventory', 'error');
            }
        } catch (error) {
            console.error('Error removing inventory:', error);
            this.showToast('Error removing inventory item', 'error');
        }
    }

    async showEditModal(itemId) {
        try {
            const response = await fetch(`${this.options.apiUrl}?id=${itemId}`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            const data = await response.json();
            
            if (data.success) {
                document.getElementById('editItemId').value = itemId;
                document.getElementById('editQuantity').value = data.item.quantity;
                document.getElementById('editLocation').value = data.item.location || '';
                this.modal.style.display = 'block';
            }
        } catch (error) {
            console.error('Error loading item data:', error);
            this.showToast('Error loading item details', 'error');
        }
    }

    async handleEditInventory(e) {
        e.preventDefault();
        const formData = new FormData(this.editForm);
        
        try {
            const response = await fetch(this.options.apiUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Inventory-Action': 'edit'
                }
            });
            const data = await response.json();
            
            if (data.success) {
                this.showToast('Inventory item updated successfully', 'success');
                this.closeEditModal();
                this.updateInventoryTable(data.inventory);
                this.checkLowStock(data.low_stock);
            } else {
                this.showToast(data.error || 'Error updating inventory', 'error');
            }
        } catch (error) {
            console.error('Error updating inventory:', error);
            this.showToast('Error updating inventory item', 'error');
        }
    }

    async confirmDelete(itemId) {
        if (confirm('Are you sure you want to delete this inventory item?')) {
            try {
                const response = await fetch(this.options.apiUrl, {
                    method: 'POST',
                    body: JSON.stringify({ id: itemId, action: 'delete' }),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                const data = await response.json();
                
                if (data.success) {
                    this.showToast('Inventory item deleted successfully', 'success');
                    this.updateInventoryTable(data.inventory);
                } else {
                    this.showToast(data.error || 'Error deleting inventory', 'error');
                }
            } catch (error) {
                console.error('Error deleting inventory:', error);
                this.showToast('Error deleting inventory item', 'error');
            }
        }
    }

    async refreshInventory() {
        try {
            this.showToast('Refreshing inventory...', 'info');
            await this.loadInitialData();
            this.showToast('Inventory refreshed', 'success');
        } catch (error) {
            console.error('Error refreshing inventory:', error);
            this.showToast('Error refreshing inventory', 'error');
        }
    }

    async exportInventory() {
        try {
            const response = await fetch(this.options.exportUrl, {
                method: 'POST',
                body: JSON.stringify({ format: 'CSV' }),
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'inventory_export.csv';
                document.body.appendChild(a);
                a.click();
                a.remove();
                this.showToast('Export completed', 'success');
            } else {
                const error = await response.json();
                this.showToast(error.error || 'Export failed', 'error');
            }
        } catch (error) {
            console.error('Error exporting inventory:', error);
            this.showToast('Error exporting inventory', 'error');
        }
    }

    updateInventoryTable(inventoryData) {
        if (!inventoryData) return;
        
        this.tableBody.innerHTML = inventoryData.map(item => `
            <tr data-id="${item.id}" class="${item.quantity <= this.options.lowStockThreshold ? 'low-stock' : ''}">
                <td>${item.product_name}</td>
                <td>${item.batch_number || '-'}</td>
                <td>${item.serial_number}</td>
                <td class="quantity-cell">${item.quantity}</td>
                <td>${item.location || '-'}</td>
                <td>${new Date(item.last_updated).toLocaleString()}</td>
                <td>
                    <button class="btn-icon edit-item" data-id="${item.id}">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="btn-icon delete-item" data-id="${item.id}">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    checkLowStock(lowStockItems) {
        if (lowStockItems && lowStockItems.length > 0) {
            const message = `Low stock alert for ${lowStockItems.length} item(s)`;
            this.showToast(message, 'warning');
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }, 100);
    }

    closeEditModal() {
        this.modal.style.display = 'none';
        this.editForm.reset();
    }
}