# Erklärvideo: Planen wie bisher vs. Planen mit KI + MCP

20 s · 1920×1080 · 30 fps · H.264/MP4, ohne Ton (die Botschaft ist ohne Ton verständlich)

| Datei | Inhalt |
|---|---|
| `out/ki-mcp-erklaervideo.mp4` | fertiges Video |
| `out/sfx-marker.txt` / `.json` | optionale Soundeffekt-Marker mit Zeitstempeln |
| `storyboard/` | Standbilder der Schlüsselszenen + Storyboard-Übersicht |
| `index.html` | Animation (SVG, deterministisch über `renderFrame(t)`); im Browser öffnen = Vorschau-Player (Leertaste, ←/→) |
| `render.js` | rendert Standbilder oder das MP4 über Playwright + ffmpeg |

## Neu rendern

```bash
node render.js video                      # → out/ki-mcp-erklaervideo.mp4
node render.js stills 1.8 5.2 8.6 12.5    # → storyboard/still_*.png
```

Voraussetzungen: Node, Playwright mit Chromium, ffmpeg, Schrift „Inter“.

## Anpassen (in `index.html`)

- Werte: `LEFT_DAYS` (15 Tage), `rightMinutes` (8 Min), Texte in `sceneCompare`
- Prompt-Text: `PROMPT`, Regelwerke: `RULES`
- Logo/Name: `sceneOutro` (Platzhalter „Ihr Logo“, „Name · Unternehmen“)
- Farben: Objekt `C`

Die Zeitwerte sind illustrative Beispielwerte.
