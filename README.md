# Instagram Follow Checker

A Chrome extension that scans Instagram's visible Followers and Following lists and compares them to find accounts that don't follow you back.

## Features

* Scan Instagram Followers
* Scan Instagram Following
* Handles Instagram's lazy-loaded lists
* Automatically scrolls through long lists
* Please wait until it checkes whole Followers and Following
* You'll get Followers and Following Numbers, Then Click Compare
* Removes duplicate usernames
* Saves scanned data locally
* Compares Followers and Following
* Shows accounts that don't follow you back
* No Instagram password required
* No automated follow/unfollow actions

## Project Structure

```text
instagram-checker/
├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── style.css
└── README.md
```

## How It Works

1. Open Instagram in Chrome.
2. Open your Followers list.
3. Open the extension.
4. Click **Scan Followers**.
5. Wait until the scan finishes.
6. Close the extension.
7. Open your Following list.
8. Open the extension again.
9. Click **Scan Following**.
10. Click **Compare**.

The extension stores the scanned lists locally using Chrome Storage and compares the usernames to find accounts you follow that do not appear in your Followers list.

## Installation

### 1. Download or clone the repository

```bash
git clone https://github.com/mkmanthra/instagram-checker.git
```

### 2. Open Chrome Extensions

Open:

```text
chrome://extensions
```

### 3. Enable Developer Mode

Turn on **Developer mode**.

### 4. Load the extension

Click **Load unpacked** and select the `instagram-checker` folder.

### 5. Open Instagram

Go to:

```text
https://www.instagram.com/
```

Refresh the page after installing the extension.

## Usage

### Scan Followers

Open Instagram → Followers → Open the extension → **Scan Followers**.

### Scan Following

Open Instagram → Following → Open the extension → **Scan Following**.

### Compare

After both lists have been scanned, click **Compare**.

The extension displays accounts that you follow but that were not found in your Followers list.

## Important Notes

Instagram uses dynamically loaded and virtualized lists. The extension therefore waits for additional accounts to load while scrolling instead of relying only on the usernames initially visible on screen.

The extension depends on Instagram's current website structure. If Instagram changes its interface or DOM structure, scanning may need to be updated.

This project is intended for use with the user's own Instagram account and visible Instagram data. It does not request Instagram passwords or perform automated follow/unfollow actions.

## Technologies

* HTML
* CSS
* JavaScript
* Chrome Extensions Manifest V3
* Chrome Storage API
* DOM APIs

## License

This project is for educational and personal use.
