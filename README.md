```markdown
# Trackalytics - GitHub Codespaces Setup Guide

## Prerequisites
- GitHub account with Codespaces access
- Trackalytics repository cloned in Codespaces
  - Must contain `run.sh` script
  - Must contain `trackalytics_project` directory
- Basic terminal/command line familiarity

## Setup Instructions

### 1. Launch GitHub Codespaces
1. Navigate to your Trackalytics repository on GitHub
2. Click the **Code** button (green button near repo top)
3. Select **Codespaces > Create codespace on main**
   - (Or select your preferred branch)
4. Wait for environment initialization
   - This typically takes 1-2 minutes
   - Creates cloud-based VS Code environment

### 2. Verify Project Structure
In the terminal (automatically opens in Codespaces):
```bash
ls
```
Expected output:
```
run.sh  trackalytics_project  [other files]
```

### 3. Make Script Executable
```bash
chmod +x run.sh
```

### 4. Execute Setup Script
```bash
./run.sh
```

## Script Execution Process
The script performs these automated steps:
1. 📦 **Dependency Installation**
   - Installs Django package
   - Updates requirements.txt
2. 🗂 **Project Navigation**
   - Changes to trackalytics_project directory
3. 🧹 **Database Reset**
   - Removes existing db.sqlite3
   - Clears migration files
4. ⚙️ **Migrations**
   - Creates new migrations
   - Applies migrations to database
5. 🔍 **Database Verification**
   - Lists all created tables
   - Displays table schema
6. 🚀 **Server Launch**
   - Starts Django development server
   - Binds to port 8000

## Accessing the Application
After server starts (look for 🚀 emoji):

### Option 1: Notification Popup
1. Click "Open in Browser" in the VS Code notification
2. Automatically opens new tab with application

### Option 2: Ports Panel
1. Open VS Code "Ports" tab (left sidebar)
2. Locate port 8000 in the list
3. Set visibility to "Public" if needed
4. Click the URL under "Local Address"

## Monitoring Operation
### Successful Indicators
- ✅ Green success messages
- Color-coded emoji status updates
- "Starting development server" final message

### Error Handling
- ❌ Red error messages for failures
- Common issues highlighted:
  - Missing directories
  - Database errors
  - Port conflicts

## Shutting Down
To stop the development server:
1. Focus on the terminal window
2. Press `Ctrl+C`
3. Wait for shutdown confirmation:
   ```
   🎉 Application Successfully Closed! 🎉
   ```

## Troubleshooting
If you encounter issues:
1. Verify all files exist in correct locations
2. Check terminal for specific error messages
3. Ensure port 8000 isn't already in use
4. Try full reset:
   ```bash
   rm -rf db.sqlite3 trackalytics_project/migrations/
   ./run.sh
   ```

> **Note**: All commands assume default configuration. Contact maintainers if your setup differs.
```
