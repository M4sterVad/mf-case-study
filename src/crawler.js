(function () {
	window.discoveredTexts = new Set();

	function scanForTexts(node) {
		if (node.nodeType === 3) {
			let text = node.nodeValue.trim();
			// Ignoriere leere Texte, reine Zahlen oder Euro-Beträge
			if (text.length > 1 && !/^[\d.,€\s]+$/.test(text)) {
				window.discoveredTexts.add(text);
			}
		} else if (
			node.nodeType === 1 &&
			node.tagName !== "SCRIPT" &&
			node.tagName !== "STYLE"
		) {
			node.childNodes.forEach(scanForTexts);
		}
	}

	// Einen Observer starten, der beim Herumklicken alle neuen Texte sammelt
	const crawlerObserver = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.addedNodes) {
				mutation.addedNodes.forEach(scanForTexts);
			}
		});
		// Gibt bei jeder Änderung die aktuelle Liste in der Konsole aus
		console.clear();
		console.log("Gefundene Texte (kopiere die englischen heraus):");
		console.log(Array.from(window.discoveredTexts).join("\n"));
	});

	// Initialer Scan
	scanForTexts(document.body);

	crawlerObserver.observe(document.body, {
		childList: true,
		subtree: true,
		characterData: true,
	});
	console.log("Crawler aktiv! Klick dich jetzt durch alle Menüpunkte.");
})();
