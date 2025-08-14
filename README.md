# 🎬 TP6 Final Backend

Backend desarrollado con **Node.js**, **Express** y **MongoDB** para manejo de autenticación y perfiles.

🌐 **Deploy en Render:**  
https://tp6-final-backend.onrender.com

---

## 📌 Requisitos

- [Node.js](https://nodejs.org/) v20 o superior  
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)  
- [MongoDB Atlas](https://www.mongodb.com/atlas) o MongoDB local  
- [Postman](https://www.postman.com/) o [Insomnia](https://insomnia.rest/) para probar la API  

---

## ⚙️ Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/usuario/tp6-final-backend.git
cd tp6-final-backend

# Instalar dependencias
npm install
```
---

## 📦 Dependencias principales
express → Framework web

mongoose → ODM para MongoDB

dotenv → Variables de entorno

bcryptjs → Hash de contraseñas

jsonwebtoken → Autenticación JWT

morgan → Logger HTTP

cors → Configuración CORS

nodemon (dev) → Recarga automática

---

## 📡 Endpoints
🔹 Cambiar solo la URL base según dónde lo pruebes:

Local: http://localhost:3000

Render: https://tp6-final-backend.onrender.com

## 🔐 Autenticación
## Registro
```
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "123456"
}
```
## Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "123456"
}
```
## Respuesta de login:
```
{
  "token": "<JWT_TOKEN>"
}
```
## 👤 Perfiles (requiere autenticación)
```
Authorization: Bearer <JWT_TOKEN>
```
## Crear perfil
```
POST /profiles
{
  "name": "Adulto",
  "type": "adult"
}
```
## Listar perfiles
```
GET /profiles
```
## Obtener un perfil
```
GET /profiles/:id
```
## Editar perfil
```
PUT /profiles/:id
{
  "name": "Niño",
  "type": "kid"
}
```
## Eliminar perfil
```
DELETE /profiles/:id
```
---
## 🧪 Pruebas rápidas con Postman
-  Abrir Postman
-  Crear nueva request
-  Probar directamente en producción usando:
```
https://tp6-final-backend.onrender.com/auth/register
https://tp6-final-backend.onrender.com/auth/login
https://tp6-final-backend.onrender.com/profiles
```
- Usar el token devuelto en el login para acceder a rutas protegidas.
 ## 📜 Notas
- Contraseñas cifradas con bcryptjs
- Autenticación mediante JWT
- Proyecto listo para deploy en Render




