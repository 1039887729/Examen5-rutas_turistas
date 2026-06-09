Rutas Turísticas — README

## Inicio Rápido (Opción Recomendada)
1. Asegúrate de que PostgreSQL está corriendo
2. Crea la base de datos: ejecuta `DDL_RutasTuristicas.sql`
3. Carga datos de prueba: ejecuta `DML_RutasTuristicas.sql`
4. Ejecuta: `java -jar api-0.0.1-SNAPSHOT.jar`
5. Abre: http://localhost:8080/

## Requisitos
- Java 17+ (OpenJDK 17 o superior)
- PostgreSQL (base de datos `rutasturisticas`)
- Maven (incluido: `mvnw.cmd`)

## Configurar Base de Datos
Edita `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/rutasturisticas
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
```

Luego ejecuta los scripts SQL:
- `DDL_RutasTuristicas.sql` — crear tablas
- `DML_RutasTuristicas.sql` — insertar datos de ejemplo (15 ciudades, rutas, paradas)

## Funcionalidades
✓ Gestión de ciudades (15 ciudades con países)
✓ Gestión de rutas turísticas por ciudad
✓ Gestión de paradas (coordenadas GPS)
✓ Mapa interactivo Leaflet.js (OpenStreetMap)
✓ CRUD completo (Create, Read, Update, Delete)
✓ UI responsiva con Bootstrap 4

## Compilar desde Código Fuente
```bash
mvnw.cmd clean package -DskipTests
java -jar target\api-0.0.1-SNAPSHOT.jar
```

## Endpoints API Principales
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/` | GET | UI Web (AngularJS) |
| `/api/ciudades/` | GET | Listar ciudades |
| `/api/rutas/ciudad/{id}` | GET | Rutas de una ciudad |
| `/api/paradas/ruta/{id}` | GET | Paradas de una ruta |
| `/api/rutas/` | POST/PUT/DELETE | CRUD rutas |
| `/api/paradas/` | POST/PUT/DELETE | CRUD paradas |

## Stack Tecnológico
- Backend: Spring Boot 4.0.6, Spring Data JPA, Hibernate
- Database: PostgreSQL
- Frontend: AngularJS 1.8.3, Bootstrap 4.6.2, Leaflet.js 1.9.4
- Mapas: OpenStreetMap

## Notas
- La BD se crea automáticamente si falta (`ddl-auto=update`)
- CORS habilitado en todos los endpoints
- Server corre en puerto 8080
- Datos de ejemplo se cargan automáticamente al arrancar

