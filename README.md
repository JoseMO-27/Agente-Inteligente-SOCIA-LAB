# 🚀 SOCIA-LAB Colombia — Plataforma Educativa Inteligente

**SOCIA-LAB Colombia** es un agente pedagógico inteligente especializado en Ciencias Sociales, diseñado siguiendo los lineamientos pedagógicos e institucionales de la educación colombiana (Ley 115, Estándares de Competencia EBC y Derechos Básicos de Aprendizaje DBA del Ministerio de Educación Nacional). 

La plataforma funciona como un tutor socrático interactivo que fomenta el pensamiento crítico, la ciudadanía activa y el análisis multicausal en los estudiantes de educación básica y media, integrando tecnologías modernas de Inteligencia Artificial mediante **Vite, React, Express y la API oficial de Google Gemini**.

---

## 🛠️ Requisitos Previos

Antes de poner en marcha tu servidor local, asegúrate de tener instalado lo siguiente en tu sistema:

1. **Node.js (Versión 18 o superior)**
   - Descárgalo e instálalo desde [nodejs.org](https://nodejs.org/).
   - Verifica su instalación abriendo una terminal (Consola) y ejecutando:
     ```bash
     node -v
     npm -v
     ```
2. **Visual Studio Code (VS Code)**
   - El editor recomendado para gestionar el proyecto. Descárgalo desde [code.visualstudio.com](https://code.visualstudio.com/).
3. **Clave de API de Google Gemini (Google AI Studio Key)**
   - Consíguela ingresando a tu cuenta en [Google AI Studio](https://aistudio.google.com/) y haciendo clic en **"Get API Key"**.

---

## 🚀 Paso a Paso: Cómo Ejecutar el Proyecto en tu PC

Sigue estos sencillos pasos para ver correr tu aplicación localmente en Visual Studio Code:

### Paso 1: Instalar dependencias
En la terminal integrada de VS Code (abre la terminal con `Ctrl + \``), ejecuta:
```bash
npm install

---

### Paso 2: Crear el archivo de configuración .env
Crea un archivo .env

---

### Paso 3: Configurar tu API Key de Gemini
Abre el archivo recién creado .env e ingresa tu secreto de API de Google Gemini:
```bash
Env
GEMINI_API_KEY="TU_CLAVE_API_DE_GOOGLE_STUDIO_AQUÍ"
APP_URL="http://localhost:3000"

---

### Paso 4: Ejecutar el servidor de desarrollo
Una vez guardado el archivo .env, enciende el servidor Express con Vite integrado escribiendo:
```Bash
npm run dev
