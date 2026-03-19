document.addEventListener('DOMContentLoaded', async () => {
    try {
        const [headerRes, footerRes] = await Promise.all([
            fetch("header.html"),
            fetch("footer.html")
        ]);

        if (headerRes.ok) {
            document.getElementById("header-container").innerHTML = await headerRes.text();
            
            const path = window.location.pathname;
            const titleMap = {
                "portfolio": "Portfolio",
                "service": "Services",
                "faq": "FAQ"
            };
            
            const currentKey = Object.keys(titleMap).find(key => path.includes(key));
            const title = currentKey ? titleMap[currentKey] : "Accueil";
            
            const titleElement = document.getElementById("page-title");
            if (titleElement) titleElement.textContent = title;
        }

        if (footerRes.ok) {
            document.getElementById("footer-container").innerHTML = await footerRes.text();
        }
    } catch (error) {
        console.error("Erreur lors du chargement des composants de mise en page:", error);
    }
});