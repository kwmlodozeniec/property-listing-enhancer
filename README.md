# Property Listing Enhancer

A Chrome extension that enhances property listing pages by displaying postcodes and providing quick access to property information services.

## Features

- **Postcode Display**: Shows the property postcode inline next to the title
- **Click to Copy**: Click the postcode badge to copy it to your clipboard
- **EPC Certificate Link**: Quick access to Energy Performance Certificate search
- **Flood Risk Check**: Opens GOV.UK flood risk service with postcode auto-copied
- **Clean Design**: Styled buttons that integrate seamlessly with Rightmove

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the `rm-postcode` folder

## How It Works

1. The extension runs on `https://www.rightmove.co.uk/properties/*` pages
2. Automatically extracts the postcode from the page's JavaScript data
3. Injects an interactive toolbar next to the property title with:
   - Clickable postcode badge (copies on click)
   - EPC button (opens Energy Performance Certificate search)
   - Flood Risk button (copies postcode and opens flood risk checker)

## Example

**Before:**
```
5 bedroom detached house for sale in Filleigh, Barnstaple, Devon
```

**After:**
```
5 bedroom detached house for sale in Filleigh, Barnstaple, Devon  [EX32 0RE] [EPC] [Flood Risk]
```

### Button Functions

- **Postcode Badge** (Dark): Click to copy postcode to clipboard
- **EPC Button** (Green): Opens GOV.UK Energy Performance Certificate search
- **Flood Risk Button** (Blue): Copies postcode and opens GOV.UK flood risk checker

## Files

- `manifest.json` - Chrome extension manifest (Manifest V3)
- `content.js` - Content script that extracts and injects the postcode toolbar
- `icons/` - Extension icons in multiple sizes

## Privacy

This extension:
- Runs only on Rightmove property pages
- Does not collect or transmit any data
- Does not make external API calls
- Only reads publicly available data from the page

## Testing

Visit any Rightmove property page, e.g.:
https://www.rightmove.co.uk/properties/88802241

The postcode toolbar should appear next to the title automatically.

## Version

1.0 - Initial release

## License

GNU General Public License v3.0 (GPL-3.0). You are free to use, modify, and distribute this software, but any derivative work must also be released under the GPL-3.0. See [LICENSE](LICENSE) for full details.
