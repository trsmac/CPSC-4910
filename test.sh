#!/bin/bash

echo ""
echo "────────────────────────────────────────────"
echo "🚀 Starting Full RBAC, Auth, and Inventory Tests"
echo "────────────────────────────────────────────"

echo ""
echo "📦 Step 1: Verifying Django environment..."
python manage.py check || {
  echo "❌ Django check failed. Fix errors before running tests."
  exit 1
}

echo ""
echo "🧪 Step 2: Running Unit Tests..."
echo "   - 🔐 AuthTests"
echo "   - 🧱 RoleManagementTests"
echo "   - 📦 InventoryViewTests"
echo ""

python manage.py test trackalytics.tests.AuthTests
python manage.py test trackalytics.tests.RoleManagementTests
python manage.py test trackalytics.tests.InventoryViewTests

echo ""
echo "📊 Step 3: Summary"
echo "📄 Detailed logs written to test_logs.txt"
echo "✅ If you saw all test outputs as PASS above, you're good to go!"
echo "❌ Any failures? See 'test_logs.txt' or scroll above."
echo ""
echo "🏁 Test suite completed."
echo "────────────────────────────────────────────"
