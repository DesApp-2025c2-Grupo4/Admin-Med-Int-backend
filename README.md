# Backend: 🩺 Aplicación de Administración de Medicina Integral ()

## 📋 Descripción general
La aplicación **Administración de Medicina Integral** tiene como propósito gestionar la información de **afiliados** y **prestadores médicos**, incluyendo la administración de grupos familiares, agendas de turnos y horarios de atención.  
Está diseñada para ser utilizada por el **personal administrativo** de la empresa, permitiendo realizar altas, bajas, modificaciones y consultas.

---

## 🚀 Tecnologías utilizadas

### Backend
- **Node.js** – entorno de ejecución para el servidor.
- **Express.js** – framework para la creación de la API REST.
- **Sequelize ORM** – para la interacción con la base de datos.
- **PostgreSQL** – base de datos relacional.
- **Joi** – validación de datos a nivel de request.
- **Redis** – (opcional) para caché y optimización de consultas.
- **Swagger** – documentación interactiva de la API.


## ⚙️ Funcionalidades principales

### 👨‍👩‍👧 Afiliados y grupos familiares
Permite gestionar afiliados y sus grupos familiares, incluyendo:

- Alta, baja y modificación de afiliados.
- Incorporación de nuevos integrantes a grupos familiares existentes.
- Registro de:
  - Tipo y número de documento  
  - Nombre y apellido  
  - Fecha de nacimiento  
  - Teléfonos, mails y direcciones (múltiples por persona)  
  - Parentesco dentro del grupo familiar  
  - Situaciones terapéuticas  
  - Plan médico (210, 310, 410, 510, etc.)  
- Generación automática de:
  - **Número de afiliado (7 dígitos)**  
  - **Número de integrante (01–99)**  
- Vigencia configurable (pasada o futura) para altas y bajas.

---

### 🏥 Prestadores
Gestión completa de prestadores médicos:

- Alta, baja, modificación y consulta.
- Datos manejados:
  - CUIT/CUIL  
  - Nombre completo  
  - Especialidades (múltiples)  
  - Tipo (Centro médico o profesional independiente)  
  - Centro médico asociado (si aplica)  
  - Teléfonos, mails y direcciones (múltiples lugares de atención)  
  - Horarios de atención por lugar  
- Búsquedas avanzadas por:
  - CUIT/CUIL  
  - Nombre  
  - Código postal  
  - Especialidad  
  - Día de atención  

---

### 📅 Agendas de turnos
Cada agenda se asocia a un prestador, especialidad y lugar de atención:

- CRUD completo de agendas.  
- Definición de duración de turno (en minutos) y horarios semanales.  
- Validaciones automáticas:
  - La especialidad debe estar asociada al prestador.
  - El lugar de atención debe ser válido.
  - Los horarios deben coincidir con los definidos para ese lugar.

---

### 📊 Consultas y reportes
Consultas adicionales disponibles:

- Altas de afiliados por período.
- Altas de prestadores por período.
- Cantidad de prestadores por especialidad y código postal.
- Reporte de situaciones terapéuticas por afiliado (incluyendo grupo familiar).
- Prestadores sin agendas de turnos cargadas.
- Horarios de atención de prestadores sin turnos definidos.

---

## 🧩 Arquitectura del sistema
La aplicación se divide en **dos módulos principales**:

### 1. Backend (API REST)
- Define modelos y relaciones en Sequelize.
- Controladores modulares para cada entidad (`Afiliado`, `Prestador`, `Agenda`, etc.).
- Validaciones con Joi y documentación con Swagger.
- Manejo de caché con Redis.

### 2. Frontend (React)
- Formularios controlados para altas y modificaciones.
- Listados filtrables con búsqueda dinámica.
- Comunicación con la API mediante funciones centralizadas.
- Uso de componentes reutilizables (tablas, modales, etc.).

---

## 🛠️ Instalación y ejecución del backend

### Requisitos previos
- Tener instalado y corriendo:
  - Docker. 
  - Node.js.


### Pasos
```bash
# Clonar el repositorio
git clone https://github.com/DesApp-2025c2-Grupo4/Admin-Med-Int-backend

# Una vez dentro del repositorio, instalar dependencias del backend
npm install

# Levantar la base en Docker
docker-compe up -d 

# Configurar variables de entorno (.env)
DB_HOST=localhost
DB_USER=postgres
DB_PASS=tu_clave
DB_NAME=medicina
DB_PORT=5432

# Ejecutar migraciones y seeders
npx sequelize db:migrate
npx sequelize db:seed:all

# Iniciar servidor
npm run dev
```

## 🛠️ Instalación y ejecución del backend

### Requisitos previos
- Tener instalado y corriendo:
  - Docker. 
  - Node.js.


### Fron-End disponible en: 
```bash
 https://github.com/DesApp-2025c2-Grupo4/Admin-Med-Int-frontend
```

## 📚 Documentación de la API

La documentación interactiva de la API se encuentra disponible a través de **Swagger**.  
Permite visualizar los endpoints, probar requests y conocer los parámetros esperados de cada ruta.

Una vez levantado el servidor, podés acceder desde: PONER ENLACE

---

## 📚 DER - Base de datos

![Diagrama Entidad-Relación](./db_admin_med_integral%20-%20public.png)

---


📅 Proyecto desarrollado en el marco de la materia **Desarrollo de Aplicaciones - Universidad Nacional de Hurlingham**.  

👩‍💻 Equipo: Brenda Lera, Alvaro Bravo, Alexis Giorda, Luana Arias y Rocío Pagliarulo.