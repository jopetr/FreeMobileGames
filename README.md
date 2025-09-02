# FreeMobileGames

## Adding games

• Add game files to games/ folder

• Add relevant info to games.csv

## Testing on Mobile Devices

After running live server, replace 5500 with Port # and run:
echo "Open on your phone: http://$(ipconfig getifaddr en0 2>/dev/null || ip -4 addr show wlan0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}'):5500/index.html"