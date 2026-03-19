document.addEventListener('DOMContentLoaded', function() {
        
  // --- 0. GESTION DU LOGIN FICTIF ---
  const loginForm = document.getElementById('login-form');
  const loginScreen = document.getElementById('login-screen');
  const dashboardScreen = document.getElementById('dashboard-screen');
  const loginError = document.getElementById('login-error');
  const btnLogout = document.getElementById('btn-logout');

  // Quand on soumet le formulaire de connexion
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Empêche le rechargement de la page
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === 'admin') {
      // Succès : On cache le login et on affiche le dashboard
      loginScreen.classList.add('d-none');
      dashboardScreen.classList.remove('d-none');
      
      // On déclenche le chargement des données seulement après connexion
      loadDashboardData();
    } else {
      // Échec : On affiche l'erreur
      loginError.classList.remove('d-none');
    }
  });

  // Quand on clique sur le bouton Déconnexion
  btnLogout.addEventListener('click', function() {
    dashboardScreen.classList.add('d-none');
    loginScreen.classList.remove('d-none');
    // On vide les champs
    document.getElementById('password').value = '';
    loginError.classList.add('d-none');
  });

  // --- FONCTION POUR CHARGER LES DONNÉES JSON ---
  function loadDashboardData() {
    
    // 1. CHARGEMENT DU DASHBOARD
    fetch('dashboard.json')
      .then(res => res.json())
      .then(data => {
        document.getElementById('stat-ventes').textContent = data.stats.ventesMois;
        document.getElementById('stat-inscrits').textContent = data.stats.nouveauxInscrits;
        document.getElementById('stat-trafic').textContent = data.stats.traficSite;

        const objContainer = document.getElementById('objectifs-container');
        objContainer.innerHTML = ''; 
        data.objectifs.forEach(obj => {
          objContainer.innerHTML += `
            <div class="progress" role="progressbar" style="width: ${obj.pourcentage}%" aria-valuenow="${obj.pourcentage}" aria-valuemin="0" aria-valuemax="100">
              <div class="progress-bar progress-bar-striped progress-bar-animated ${obj.couleur}">
                ${obj.nom} (${obj.pourcentage}%)
              </div>
            </div>
          `;
        });
        document.getElementById('notes-rapides').textContent = data.notes;
      })
      .catch(err => console.error('Erreur Dashboard:', err));

    // 2. CHARGEMENT DES VENTES
    const tableBody = document.getElementById('sales-table-body');
    function getStatusBadge(statut) {
      switch (statut) {
        case 'Payée': return 'bg-success';
        case 'En attente': return 'bg-warning text-dark';
        case 'Annulée': return 'bg-danger';
        default: return 'bg-secondary';
      }
    }

    fetch('vente.json')
      .then(res => res.json())
      .then(data => {
        tableBody.innerHTML = '';
        data.forEach(vente => {
          tableBody.innerHTML += `
            <tr>
              <td>${vente.idCommande}</td>
              <td class="d-flex align-items-center"><img src="${vente.avatarUrl}" class="table-avatar">${vente.client}</td>
              <td>${vente.date}</td>
              <td><strong>${vente.montant} €</strong></td>
              <td><span class="badge ${getStatusBadge(vente.statut)}">${vente.statut}</span></td>
              <td><button class="btn btn-sm btn-outline-primary">Voir</button></td>
            </tr>
          `;
        });
      })
      .catch(err => console.error('Erreur Ventes:', err));

    // 3. CHARGEMENT DES UTILISATEURS
    const usersContainer = document.getElementById('users-container');
    fetch('utilisateurs.json')
      .then(res => res.json())
      .then(data => {
        usersContainer.innerHTML = ''; // Vide le spinner de chargement
        data.forEach(user => {
          usersContainer.innerHTML += `
            <div class="col-md-6 col-lg-4 mb-4">
              <div class="card shadow-sm h-100 text-center p-3">
                <img src="${user.avatarUrl}" class="avatar mx-auto mb-3" alt="${user.nom}">
                <h5 class="card-title mb-1">${user.nom}</h5>
                <p class="text-muted small mb-3">${user.role}</p>
                <button class="btn btn-outline-secondary btn-sm w-100">Éditer profil</button>
              </div>
            </div>
          `;
        });
      })
      .catch(err => console.error('Erreur Utilisateurs:', err));
  }
});