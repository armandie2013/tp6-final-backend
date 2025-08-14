🎬 TP6 Final Backend
Backend desarrollado con Node.js, Express y MongoDB para manejo de autenticación y perfiles.
Deploy en Render: https://tp6-final-backend.onrender.com

🚀 Requisitos previos (para correr en local)
Node.js v20 o superior

npm o yarn

MongoDB Atlas o servidor MongoDB local

Postman o Insomnia para probar la API

📦 Instalación en local
Clonar el repositorio:

bash
Copiar
Editar
git clone https://github.com/usuario/tp6-final-backend.git
cd tp6-final-backend
Instalar dependencias:

bash
Copiar
Editar
npm install
Crear un archivo .env en la raíz del proyecto con el siguiente contenido:

env
Copiar
Editar
MONGODB_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/<base>
JWT_SECRET=clave_secreta_segura
PORT=3000
Iniciar en desarrollo:

bash
Copiar
Editar
npm run dev
📚 Dependencias principales
express → Framework web

mongoose → ODM para MongoDB

dotenv → Variables de entorno

bcryptjs → Hash de contraseñas

jsonwebtoken → Autenticación con JWT

morgan → Logger HTTP

cors → Configuración de CORS

nodemon (dev) → Recarga automática en desarrollo

📡 Endpoints
🔹 Todos los endpoints funcionan tanto en local como en Render.
Solo cambia la URL base:

Local: http://localhost:3000

Render: https://tp6-final-backend.onrender.com

🔐 Autenticación
Registro de usuario
bash
Copiar
Editar
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "123456"
}
Respuesta exitosa (201)

json
Copiar
Editar
{
  "message": "Usuario registrado con éxito"
}
Login de usuario
pgsql
Copiar
Editar
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "123456"
}
Respuesta exitosa (200)

json
Copiar
Editar
{
  "token": "<JWT_TOKEN>"
}
👤 Perfiles (requiere autenticación)
Incluir cabecera:

makefile
Copiar
Editar
Authorization: Bearer <JWT_TOKEN>
Crear perfil
pgsql
Copiar
Editar
POST /profiles
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Adulto",
  "type": "adult"
}
Listar perfiles
sql
Copiar
Editar
GET /profiles
Authorization: Bearer <token>
Obtener un perfil
bash
Copiar
Editar
GET /profiles/:id
Authorization: Bearer <token>
Editar un perfil
bash
Copiar
Editar
PUT /profiles/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Niño",
  "type": "kid"
}
Eliminar un perfil
bash
Copiar
Editar
DELETE /profiles/:id
Authorization: Bearer <token>
🛠 Herramientas recomendadas para pruebas
Postman → Descargar

Insomnia → Descargar

📌 Tip:
Podés usar directamente la URL de Render en Postman para probar:

bash
Copiar
Editar
https://tp6-final-backend.onrender.com/auth/register
https://tp6-final-backend.onrender.com/auth/login
https://tp6-final-backend.onrender.com/profiles
📌 Notas
Contraseñas cifradas con bcrypt

Autenticación con JWT (enviar en header Authorization)

Listo para deploy en Render
