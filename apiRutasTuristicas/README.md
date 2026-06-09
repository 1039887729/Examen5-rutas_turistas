Rutas Turísticas — README

Requisitos
- Java 17+ (o OpenJDK 17+)
- Maven (se usa el wrapper `mvnw.cmd` incluido)
- PostgreSQL con base de datos `rutasturisticas` 

Configurar base de datos
- Ajusta `src/main/resources/application.properties` con la URL, usuario y contraseña de Postgres.
- Si necesitas ejecutar los scripts DDL/DML, usa los archivos en la carpeta raíz:
  - `DDL_RutasTuristicas.sql`
  - `DML_RutasTuristicas.sql`

Comandos rápidos
- Compilar y empaquetar (genera `target/api-0.0.1-SNAPSHOT.jar`):
```bash
cd apiRutasTuristicas
mvnw.cmd package -DskipTests
```
- Ejecutar desde el código fuente (arranca en `http://localhost:8080`):
```bash
cd apiRutasTuristicas
mvnw.cmd spring-boot:run
```
- Ejecutar el jar generado:
```bash
java -jar target\api-0.0.1-SNAPSHOT.jar
```

Endpoints principales
- UI: `/` (index.html)
- Tipos: `/api/tipos/`
- Paises: `/api/paises/`
- Ciudades: `/api/ciudades/`
- Rutas: `/api/rutas/` (POST/PUT/DELETE) y `/api/rutas/ciudad/{id}`
- Paradas: `/api/paradas/` (POST/PUT/DELETE) y `/api/paradas/ruta/{id}`

Notas
- La aplicación usa `spring.jpa.hibernate.ddl-auto=update`, por lo que crea/ajusta tablas automáticamente si la conexión a la BD está correcta.
