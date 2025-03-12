# Utiliser Node.js 22 comme base
FROM node:22

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install -f --legacy-peer-deps

# Copier le reste des fichiers
COPY . .

# Exposer le port de Vite (par défaut 5173)
EXPOSE 5173

# Lancer l'application en mode développement
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
