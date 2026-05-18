(function () {
	"use strict";

	// 1. Alle Übersetzungen (inklusive der neuen Modal-Texte)
	const textTranslations = {
		// --- Modal & Pop-up Texte ---
		"pause subscription": "Abonnement pausieren",
		"select a date until when you want to pause your subscription.":
			"Wähle ein Datum, bis zu dem du dein Abonnement pausieren möchtest.",
		"pause until": "Pausieren bis",
		close: "Schließen",

		// --- Navigation & Allgemein ---
		dashboard: "Übersicht",
		subscriptions: "Abonnements",
		subscription: "Abonnement",
		"new subscription": "Neues Abonnement",
		active: "Aktiv",
		weeks: "Wochen",
		cancel: "Abbrechen",

		// --- Status & Lieferungen ---
		"started on": "Gestartet am",
		"skipped until": "Übersprungen bis",
		skipped: "Übersprungen",
		"paused until": "Pausiert bis",
		"paused subscriptions": "Pausierte Abonnements",
		paused: "Pausiert",
		"next delivery:": "Nächste Lieferung:",
		"next delivery": "Nächste Lieferung",

		// --- Adress- & Kontoverwaltung ---
		"delivery address": "Lieferadresse",
		"update your delivery address for subscriptions":
			"Aktualisiere deine Lieferadresse für Abonnements",
		"street address": "Straße und Hausnummer",
		city: "Stadt",
		"postal code": "Postleitzahl",
		country: "Land",
		germany: "Deutschland",
		"edit address": "Adresse bearbeiten",
		"save address": "Adresse speichern",
		"address updated": "Adresse aktualisiert",

		// --- Auswahl & Preise ---
		"you have selected": "Du hast",
		for: "für",
		of: "von",
		selected: "Ausgewählte",
		flavors: "Geschmacksrichtungen",
		"billed every": "Abgerechnet alle",
		"subscription resumed": "Abonnement fortgesetzt",
		"subscription preis:": "Abonnement-Preis:",

		// --- Wochentage ---
		monday: "Montag",
		tuesday: "Dienstag",
		wednesday: "Mittwoch",
		thursday: "Donnerstag",
		friday: "Freitag",
		saturday: "Samstag",
		sunday: "Sonntag",
		Su: "So",
		Mo: "Mo",
		Tu: "Di",
		We: "Mi",
		Th: "Do",
		Fr: "Fr",
		Sa: "Sa",

		// --- Monate ---
		January: "Januar",
		February: "Februar",
		March: "März",
		April: "April",
		May: "Mai",
		June: "Juni",
		July: "Juli",
		August: "August",
		September: "September",
		October: "Oktober",
		November: "November",
		December: "Dezember",
	};

	// 2. Erweitertes Monats-Wörterbuch
	const monthMap = {
		jan: "Jan.",
		january: "Januar",
		feb: "Feb.",
		february: "Februar",
		mar: "März",
		march: "März",
		apr: "Apr.",
		april: "April",
		may: "Mai",
		jun: "Juni",
		june: "Juni",
		jul: "Juli",
		july: "Juli",
		aug: "Aug.",
		august: "August",
		sep: "Sep.",
		september: "September",
		oct: "Okt.",
		october: "Oktober",
		nov: "Nov.",
		november: "November",
		dec: "Dez.",
		december: "Dezember",
	};

	function processTextNode(node) {
		let text = node.nodeValue;
		let originalText = text;

		// --- A. WÄHRUNGSFORMAT (React Split-Node Fix) ---
		if (text.trim() === "€") {
			let nextNode = node.nextSibling;
			while (
				nextNode &&
				nextNode.nodeType === 3 &&
				nextNode.nodeValue.trim() === ""
			) {
				nextNode = nextNode.nextSibling;
			}
			if (nextNode && nextNode.nodeType === 3) {
				const nextText = nextNode.nodeValue;
				const numberRegex = /^\s*(\d+)\.(\d{2})\s*$/;
				if (numberRegex.test(nextText)) {
					node.nodeValue = text.replace("€", "");
					nextNode.nodeValue = nextText.replace(numberRegex, "$1,$2 €");
					return;
				}
			}
		}
		text = text.replace(/€\s*(\d+)\.(\d{2})/g, "$1,$2 €");

		// --- B. DATUMSFORMAT ---
		// Format 1: "May 15, 2026" ODER "June 17th, 2026"
		// (?:st|nd|rd|th)? ignoriert die englischen Endungen beim Extrahieren der Zahlen
		text = text.replace(
			/\b([a-zA-Z]{3,})\s+(\d{1,2})(?:st|nd|rd|th)?,\s+(\d{4})\b/g,
			(match, monthEng, dayNum, year) => {
				const monthDe = monthMap[monthEng.toLowerCase()] || monthEng;
				return `${dayNum}. ${monthDe} ${year}`;
			},
		);

		// Format 2: "29 May"
		text = text.replace(
			/\b(\d{1,2})\s+([a-zA-Z]{3,})\b/g,
			(match, dayNum, monthEng) => {
				const monthKey = monthEng.toLowerCase();
				if (monthMap[monthKey]) {
					return `${dayNum}. ${monthMap[monthKey]}`;
				}
				return match;
			},
		);

		// --- C. DYNAMISCHE SÄTZE ---
		text = text.replace(
			/Selected flavors:\s*\(\s*(\d+)\s+flavors for\s+(\d+)\s+weeks\s*\)/gi,
			"Ausgewählte Sorten: ($1 Sorten für $2 Wochen)",
		);

		// --- D. TEXTÜBERSETZUNGEN (Längen-sortiert) ---
		const sortedKeys = Object.keys(textTranslations).sort(
			(a, b) => b.length - a.length,
		);

		for (const english of sortedKeys) {
			// Sonderzeichen (wie den Punkt) für Regex maskieren
			const escapedEnglish = english.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

			// Intelligente Boundaries: \b nur setzen, wenn es Sinn macht
			// Testet, ob der Key mit einem Buchstaben/Zahl anfängt (\w)
			const startBoundary = /^\w/.test(english) ? "\\b" : "";
			// Testet, ob der Key mit einem Buchstaben/Zahl endet (\w)
			const endBoundary = /\w$/.test(english) ? "\\b" : "";

			const regex = new RegExp(
				`${startBoundary}${escapedEnglish}${endBoundary}`,
				"gi",
			);

			text = text.replace(regex, textTranslations[english]);
		}

		// --- DOM AKTUALISIEREN ---
		if (text !== originalText) {
			node.nodeValue = text;
		}
	}

	// 3. DOM Durchlauf
	function walkDOM(node) {
		if (node.nodeType === 3) {
			if (
				node.parentNode &&
				(node.parentNode.tagName === "SCRIPT" ||
					node.parentNode.tagName === "STYLE")
			) {
				return;
			}
			if (node.nodeValue.trim() !== "") {
				processTextNode(node);
			}
		} else {
			for (let i = 0; i < node.childNodes.length; i++) {
				walkDOM(node.childNodes[i]);
			}
		}
	}

	// 4. Start
	walkDOM(document.body);

	// 5. Observer
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
				mutation.addedNodes.forEach((newNode) => {
					walkDOM(newNode);
				});
			} else if (mutation.type === "characterData") {
				processTextNode(mutation.target);
			}
		});
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
		characterData: true,
	});

	console.log("StayAI React-Optimized Translation Script geladen.");
})();
