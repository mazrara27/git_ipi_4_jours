document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        loginForm: document.getElementById('login-form'),
        loginScreen: document.getElementById('login-screen'),
        dashboardScreen: document.getElementById('dashboard-screen'),
        loginError: document.getElementById('login-error'),
        btnLogout: document.getElementById('btn-logout'),
        usernameInput: document.getElementById('username'),
        passwordInput: document.getElementById('password'),
        statVentes: document.getElementById('stat-ventes'),
        statInscrits: document.getElementById('stat-inscrits'),
        statTrafic: document.getElementById('stat-trafic'),
        objContainer: document.getElementById('objectifs-container'),
        notesRapides: document.getElementById('notes-rapides'),
        salesTableBody: document.getElementById('sales-table-body'),
        usersContainer: document.getElementById('users-container')
    };

    elements.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = elements.usernameInput.value.trim();
        const pass = elements.passwordInput.value.trim();

        if (user === 'admin' && pass === 'admin') {
            elements.loginScreen.classList.add('d-none');
            elements.dashboardScreen.classList.remove('d-none');
            loadDashboardData();
        } else {
            elements.loginError.classList.remove('d-none');
        }
    });

    elements.btnLogout.addEventListener('click', () => {
        elements.dashboardScreen.classList.add('d-none');
        elements.loginScreen.classList.remove('d-none');
        elements.passwordInput.value = '';
        elements.loginError.classList.add('d-none');
    });

    const getStatusBadge = (statut) => {
        const badges = {
            'Payée': 'bg-success',
            'En attente': 'bg-warning text-dark',
            'Annulée': 'bg-danger'
        };
        return badges[statut] || 'bg-secondary';
    };

    const loadDashboardData = async () => {
        try {
            const [dashboardRes, salesRes, usersRes] = await Promise.all([
                fetch('dashboard.json'),
                fetch('vente.json'),
                fetch('utilisateurs.json')
            ]);

            if (dashboardRes.ok) {
                const dashboardData = await dashboardRes.json();
                elements.statVentes.textContent = dashboardData.stats.ventesMois;
                elements.statInscrits.textContent = dashboardData.stats.nouveauxInscrits;
                elements.statTrafic.textContent = dashboardData.stats.traficSite;
                
                elements.objContainer.innerHTML = dashboardData.objectifs.map(obj => `
                    <div class="progress" role="progressbar" style="width: ${obj.pourcentage}%" aria-valuenow="${obj.pourcentage}" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar progress-bar-striped progress-bar-animated ${obj.couleur}">
                            ${obj.nom} (${obj.pourcentage}%)
                        </div>
                    </div>
                `).join('');
                
                elements.notesRapides.textContent = dashboardData.notes;
            }

            if (salesRes.ok) {
                const salesData = await salesRes.json();
                elements.salesTableBody.innerHTML = salesData.map(vente => `
                    <tr>
                        <td>${vente.idCommande}</td>
                        <td class="d-flex align-items-center"><img src="${vente.avatarUrl}" class="table-avatar">${vente.client}</td>
                        <td>${vente.date}</td>
                        <td><strong>${vente.montant} €</strong></td>
                        <td><span class="badge ${getStatusBadge(vente.statut)}">${vente.statut}</span></td>
                        <td><button class="btn btn-sm btn-outline-primary">Voir</button></td>
                    </tr>
                `).join('');
            }

            if (usersRes.ok) {
                const usersData = await usersRes.json();
                elements.usersContainer.innerHTML = usersData.map(user => `
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="card shadow-sm h-100 text-center p-3">
                            <img src="${user.avatarUrl}" class="avatar mx-auto mb-3" alt="${user.nom}">
                            <h5 class="card-title mb-1">${user.nom}</h5>
                            <p class="text-muted small mb-3">${user.role}</p>
                            <button class="btn btn-outline-secondary btn-sm w-100">Éditer profil</button>
                        </div>
                    </div>
                `).join('');
            }

        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        }
    };
});