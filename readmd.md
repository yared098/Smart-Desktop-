# Choose the right Electron version

# Electron v19.x is usually safe for Windows 7.

You can install it like this:

npm install electron@19 --save-dev


Avoid the latest versions (v25+) — they won’t run on Windows 7.

# 2️⃣ Install Electron Forge
npm install --save-dev @electron-forge/cli
npx electron-forge import

# Build the Windows 7 compatible installer
npm run make