# StayAI Translations – Case Study

## Überblick

Dieses Repository enthält eine mögliche Lösung für die Case Study **„StayAI Translations“**.

Ziel der Aufgabe ist es, fehlende deutsche Übersetzungen innerhalb der Shopify-App *StayAI* zu ergänzen sowie fehlerhafte Formatierungen für Datum, Uhrzeit und Währungen clientseitig zu korrigieren — ausschließlich über die innerhalb der App verfügbaren HTML-, CSS- und JavaScript-Felder.

Die Lösung wurde so umgesetzt, dass sie:

- ohne Änderungen am Backend funktioniert
- direkt über Browser- bzw. DOM-Manipulation arbeitet
- leicht über die Browser-Konsole testbar ist
- unabhängig von der ursprünglichen App-Implementierung eingesetzt werden kann

## link:

https://metaflow-x-casestudy.lovable.app/?name=Name

## Übersicht des AI Chatverlaufs:
- Überblick verschaffen und ein Script generieren
- Die Ergebnisse der KI evaluieren – Fokus auf case-insensitive Übersetzungen, Datums- und Währungsformate
- Da die Ergebnisse weiterhin nicht korrekt waren, wurde der HTML-Body zur Verbesserung von Kontext und Verständnis bereitgestellt
- Das Split-Node-Problem identifiziert und behoben
- Einen Text-Crawler entwickelt, um alle zu übersetzenden Nodes zu finden
- translator.js weiter angepasst – u. a. für „th“ in „17th June“ sowie Regex-Optimierungen für intelligente Word-Boundaries
- Eine weitere Evaluationsrunde durchgeführt
- Preis-Marker für dynamische Preisänderungen ergänzt

