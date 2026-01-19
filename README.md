# N5 Permissions Challenge

Este proyecto fue desarrollado como parte del challenge técnico de N5.
Consiste en una Web API en ASP.NET Core para gestionar permisos de usuarios,
con persistencia en SQL Server y Elasticsearch, y un frontend en React.

---

## 📦 Requisitos previos

Antes de comenzar, asegurarse de tener instalado:

### Backend
- .NET SDK 8.0 o superior https://dotnet.microsoft.com/download
- SQL Server (LocalDB, Express o instancia normal)
- Docker Desktop
https://www.docker.com/products/docker-desktop/

### 🐳 Elasticsearch con Docker

Para facilitar la ejecución del proyecto, Elasticsearch se ejecuta mediante Docker.

Ejecutar el siguiente comando:

```bash
docker run -d \
  --name elasticsearch-n5 \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  docker.elastic.co/elasticsearch/elasticsearch:8.12.0
```

Verificar que esté corriendo:
http://localhost:9200

---
 
### Frontend
- Node.js 18 o superior  
  https://nodejs.org/

---

## ⚙️ Backend – Configuración y ejecución

### 1️⃣ Configurar SQL Server

Editar el archivo `appsettings.json` del proyecto backend y configurar
la cadena de conexión (o dejar de forma rápida la localdb y correr sql en esa instancia) :


"ConnectionStrings": {
   "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=N5PermissionsDb;Trusted_Connection=True;"
}

## Ejecutar migraciones

Desde la carpeta del proyecto backend:
dotnet ef database update

## Asegurarse de que Elasticsearch esté corriendo en:

http://localhost:9200

No es necesario crear el índice manualmente.
El índice permissions se crea automáticamente al insertar permisos.

## Frontend – Configuración y ejecución
###  1️⃣ Instalar dependencias

Desde la carpeta del frontend:
npm install

###  2️⃣ Configurar endpoint del backend

Verificar el archivo de configuración de Axios y que apunte a:

http://localhost:5000
