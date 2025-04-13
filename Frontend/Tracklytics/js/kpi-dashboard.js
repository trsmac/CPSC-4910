// Sample data — replace with your dynamic data sources
const inventoryData = [
    { sku: "A1", quantity: 50 },
    { sku: "B1", quantity: 30 }
];

const unitsSold = 120;
const unitsReceived = 150;
const beginningInventory = 100;
const endingInventory = 80;
const unsellableStock = 20;
const availableStock = 200;

const returns = [
    { reason: "Damaged" },
    { reason: "Missing" },
    { reason: "Returned" },
    { reason: "Damaged" },
    { reason: "Checked-out" }
];

// Calculations
const sellThroughRate = (unitsSold / unitsReceived) * 100;
const avgInventory = (beginningInventory + endingInventory) / 2;
const deadStockRate = (unsellableStock / availableStock) * 100;
const returnRate = (returns.length / unitsSold) * 100;

function calcReturnReasonFreq(reason) {
    const count = returns.filter(r => r.reason === reason).length;
    return (count / returns.length) * 100;
}

// Populate values into HTML
document.getElementById("sellThroughValue").textContent = `${sellThroughRate.toFixed(1)}%`;
document.getElementById("avgInventoryValue").textContent = `${avgInventory.toFixed(0)} units`;
document.getElementById("deadStockValue").textContent = `${deadStockRate.toFixed(1)}%`;

document.getElementById("returnRateValue").textContent = `${returnRate.toFixed(1)}%`;
document.getElementById("damagedValue").textContent = `${calcReturnReasonFreq("Damaged").toFixed(1)}%`;
document.getElementById("missingValue").textContent = `${calcReturnReasonFreq("Missing").toFixed(1)}%`;
document.getElementById("returnedValue").textContent = `${calcReturnReasonFreq("Returned").toFixed(1)}%`;
document.getElementById("checkedOutValue").textContent = `${calcReturnReasonFreq("Checked-out").toFixed(1)}%`;
