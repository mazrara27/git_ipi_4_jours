# Définir le nom du fichier de sortie
$outputFile = "links.json"

# Récupérer les fichiers .html du dossier courant
# On exclut navigation.html pour éviter qu'il ne se pointe lui-même
$files = Get-ChildItem -Filter *.html | Where-Object { $_.Name -ne "navigation.html" } | Select-Object Name

# Convertir en format JSON et sauvegarder
$files | ConvertTo-Json | Out-File -FilePath $outputFile -Encoding utf8

Write-Host "Fichier $outputFile généré avec succès ! ($($files.Count) liens trouvés)" -ForegroundColor Green