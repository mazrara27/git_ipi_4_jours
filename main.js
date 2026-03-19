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

document.addEventListener("DOMContentLoaded", () => {
    const faqContainer = document.getElementById("faqAccordion");

    // 1. Fetcher les données du fichier JSON
    fetch("faq.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors du chargement du JSON");
            }
            return response.json();
        })
        .then(data => {
            renderFAQ(data);
        })
        .catch(error => {
            console.error("Erreur:", error);
            faqContainer.innerHTML = "<p class='text-center text-danger'>Impossible de charger la FAQ pour le moment.</p>";
        });

    // 2. Fonction pour générer le HTML de l'accordéon
    function renderFAQ(faqs) {
        faqContainer.innerHTML = faqs.map((item, index) => {
            const isFirst = index === 0;
            return `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading${item.id}">
                        <button class="accordion-button ${isFirst ? '' : 'collapsed'}" 
                                type="button" 
                                data-bs-toggle="collapse" 
                                data-bs-target="#collapse${item.id}" 
                                aria-expanded="${isFirst ? 'true' : 'false'}" 
                                aria-controls="collapse${item.id}">
                            ${item.question}
                        </button>
                    </h2>
                    <div id="collapse${item.id}" 
                         class="accordion-collapse collapse ${isFirst ? 'show' : ''}" 
                         aria-labelledby="heading${item.id}" 
                         data-bs-parent="#faqAccordion">
                        <div class="accordion-body">
                            ${item.answer}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
});