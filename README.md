🚀 Cómo Ejecutar el Proyecto en tu PC (VS Code)
Abre el Proyecto: Abre Visual Studio Code, ve a Archivo > Abrir carpeta y selecciona la carpeta extraída de tu archivo ZIP.
Instala las Dependencias: Abre una nueva terminal integrada en VS Code (con Ctrl + `) y ejecuta el comando:
code
Bash
npm install
Configura tu Clave de API:
Copia el archivo .env.example y renómbralo a .env.
Adentro, pega tu clave API de Gemini en la propiedad GEMINI_API_KEY="..." (puedes conseguirla gratis en Google AI Studio).
Ponlo a Correr: En la terminal, ejecuta:
code
Bash
npm run dev
¡Listo! Abre tu navegador en http://localhost:3000 para interactuar con tu tutor de ciencias sociales.
