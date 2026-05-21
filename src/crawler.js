(function () {
	// Ein Set verhindert automatisch, dass Texte doppelt gespeichert werden
	window.discoveredTexts = new Set();

	// Rekursive Funktion: Sucht in einem Element und all seinen Unterelementen nach Text
	function scanForTexts(node) {
		if (node.nodeType === 3) {
			// nodeType 3 bedeutet: Es ist ein reiner Text-Knoten
			let text = node.nodeValue.trim();

			// Ignoriere leere Texte, reine Zahlen oder Euro-Beträge (mit regulärem Ausdruck)
			if (text.length > 1 && !/^[\d.,€\s]+$/.test(text)) {
				window.discoveredTexts.add(text); // Text zum Speicher hinzufügen
			}
		} else if (
			// nodeType 1 bedeutet: Es ist ein HTML-Element (z.B. <div>, <span>)
			node.nodeType === 1 &&
			node.tagName !== "SCRIPT" && // Code-Blöcke ignorieren
			node.tagName !== "STYLE" // Design-Blöcke ignorieren
		) {
			// Wenn es ein normales HTML-Element ist, durchsuche alle Kinder-Elemente darin
			node.childNodes.forEach(scanForTexts);
		}
	}

	// Der MutationObserver überwacht die Webseite live auf Veränderungen
	// (z.B. wenn neue Inhalte durch Klicks geladen werden, ohne die Seite neu zu laden)
	const crawlerObserver = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			// Wenn neue HTML-Elemente auf der Seite auftauchen...
			if (mutation.addedNodes) {
				// ...schicke sie durch unsere Suchfunktion
				mutation.addedNodes.forEach(scanForTexts);
			}
		});

		// Konsole aufräumen und die aktuelle, komplette Liste aller gefundenen Texte anzeigen
		console.clear();
		console.log("Gefundene Texte (kopiere die englischen heraus):");
		console.log(Array.from(window.discoveredTexts).join("\n"));
	});

	// 1. Initialer Scan der Seite, wie sie jetzt gerade aussieht
	scanForTexts(document.body);

	// 2. Observer scharfschalten: Beobachte den <body> auf alle zukünftigen Änderungen
	crawlerObserver.observe(document.body, {
		childList: true, // Achte auf neue direkte Kinder-Elemente
		subtree: true, // Achte auch auf Elemente tief unten in der Hierarchie
		characterData: true, // Achte auf geänderte Texte
	});

	console.log("Crawler aktiv! Klick dich jetzt durch alle Menüpunkte.");
})();
