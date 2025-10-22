# IoT PWA Dashboard

Une Progressive Web App (PWA) pour surveiller des capteurs IoT et l’état de toilettes connectées.  
Le projet est conçu pour fonctionner en offline grâce à un **Service Worker**, et fournit un tableau de bord interactif avec filtres et notifications.

---

## Fonctionnalités principales

- Affichage en temps réel des **capteurs (sondes et ponts)**.
- Surveillance des **toilettes connectées** avec état "Libre / Occupé".
- Mode **offline** grâce au Service Worker.
- Notifications push simulant l’état des toilettes.
- Mode sombre activable dynamiquement.
- Interface **réactive et responsive**.

---

## Technologies utilisées

- **React 18** + **Vite**
- **JavaScript / JSX**
- **CSS** pour le styling
- **Service Worker** pour PWA et notifications
- API REST pour récupérer les données (`/sondes`, `/toilettes`, `/bridges`, `/events`, `/alerts`)

---

## Installation

1. **Cloner le projet :**
```bash 
git clone <URL_DU_REPO>
cd iot-pwa 
```
2. **Installer les dépendances :**
```bash
npm install
```
3. **Configurer les variables d'environnement**
## Scripts utiles
1. **Lancer le serveur de développement :**
```bash
npm run dev
```
2. **Builder la PWA pour production :**
```bash
npm run build
```
3.**Prévisualiser la build :**
```bash
npm run preview
```
4.**Documentation JS**
```bash
npx serve docs
```