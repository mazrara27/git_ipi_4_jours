// --- Charger le Header ---
fetch("header.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("header-container").innerHTML = data;

        // Définir le titre selon la page
        const path = window.location.pathname;
        let title = "Accueil";

        if (path.includes("portfolio")) title = "Portfolio";
        if (path.includes("service")) title = "Services";
        if (path.includes("faq")) title = "FAQ";

        const titleElement = document.getElementById("page-title");
        if (titleElement) titleElement.textContent = title;
    });

// --- Charger le Footer ---
fetch("footer.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("footer-container").innerHTML = data;
    });