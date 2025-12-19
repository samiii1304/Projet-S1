# StudyBuddy+ – Guide d'installation et de lancement
## Prérequis
***
1. **SQLite**  
   Télécharger et installer les outils SQLite pour Windows :  
   [SQLite Tools](https://www.sqlite.org/2025/sqlite-tools-win-arm64-3510100.zip)

2. **Python 3**  
   Assurez-vous que Python 3 est installé sur votre machine.

3. **Packages Python nécessaires**  
   Installer Flask et Flask-CORS :  
   ```bash
   pip install Flask Flask-Cors
   pip install flask-cors
## Installation
***
### Database
1. **Initialisation BD**
    ```sh
    python.exe ./web/backend/init_db.py
    ./sqlite-tools-win-x64-3510100/sqlite3.exe ./database.db
    ```
2. **Si besoin de delete la BD**
    ```sql    
    SELECT 'DROP TABLE IF EXISTS "' || name || '";'
    FROM sqlite_master
    WHERE type = 'table';
    ```
### **Intaller le Back/Front**
1. **BackEnd (Flask)**
    ```sh
    python.exe ./web/backend/app.py
    ```
2. **Frontend (HTML/JS)**
    Commande à lancer à la racine du projet :
    ```sh
    python -m http.server 5500
    ```
    Accès local : http://127.0.0.1:5500/web/html/presentation.html

## Notes importantes
- Servir le frontend via HTTP est nécessaire pour que le cookie de session fonctionne correctement.
- Si vous modifiez la structure de la base, assurez-vous d’initialiser à nouveau avec le script init_db.py.
- Utilisez un navigateur moderne pour tester toutes les fonctionnalités JavaScript et les sessions.