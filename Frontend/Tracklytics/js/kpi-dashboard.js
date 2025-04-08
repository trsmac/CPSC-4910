const COGS = 5000;


function calculateAverageInventory(inventory) {
  const totalQuantity = inventory.reduce((total, item) => total + item.quantity, 0);
  return totalQuantity / inventory.length;
}


function calculateInventoryTurnover(inventory) {
  const avgInventory = calculateAverageInventory(inventory);
  return COGS / avgInventory;
}


const inventoryTurnover = calculateInventoryTurnover(inventory);
console.log("Inventory Turnover:", inventoryTurnover);


function calculateOrderFulfillmentRate(orders) {
    const totalOrders = orders.length;
    const fulfilledOrders = orders.filter(order => order.status === "fulfilled").length;
 
    return (fulfilledOrders / totalOrders) * 100;
  }
 
  const orderFulfillmentRate = calculateOrderFulfillmentRate(orders);
  console.log("Order Fulfillment Rate:", orderFulfillmentRate.toFixed(2) + "%");
 


function calculateSupplierPerformance(suppliers) {
    return suppliers.map(supplier => {
      return {
        supplierName: supplier.supplierName,
        onTimeDeliveryRate: supplier.onTimeDelivery,
        qualityRate: supplier.qualityRate
      };
    });
  }
 
  const supplierPerformance = calculateSupplierPerformance(suppliers);
  console.log("Supplier Performance:", supplierPerformance);
