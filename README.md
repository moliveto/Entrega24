# Nombre del Proyecto

## Entrega de Proyecto Final NodeJS

#### Nombre: Marcelo Adrian Oliveto

#### Institucion: Coderhouse

#### Curso: BackEnd

#### Comision: 50040

#### Profesor: Rabindranath Ferreira Villamizar

#### Tutor: Allan Reynoso Naranjo

## Instalación

1. Clona el repositorio.
2. Ejecuta `npm install` para instalar las dependencias.

## Uso

1. Ejecuta `npm run start:dev` para iniciar la aplicación.
2. Crea un archivo local `.env.dev.local` con el siguiente contenido:

    ```env
    # Environment variables for development
    ENV=dev
    
    # App configuration
    PORT=5000
    CLIENT_URL=http://localhost:5000
    
    # Database configuration
    PERSISTENCE=MONGO
    DB_HOST=localhost
    DB_PORT=27017
    DB_NAME=entrega23
    DB_URI=
    
    # Session Configuration
    SESSION_SECRET=clave
    SESSION_LIMIT=600000
    
    COOKIE_SECRET=clave
    
    # JWT configuration
    JWT_SECRET=clave
    JWT_RESET_EXPIRE_IN=1h
    JWT_EXPIRE_IN=1h
    
    # Mail configuration
    GOOGLE_APP_EMAIL=email@gmail.com
    GOOGLE_APP_PW=1234 1234 1234 1234
    
    GITHUB_CLIENT_ID=
    GITHUB_CLIENT_SECRET=
    ```

3. Abre tu navegador y visita `http://localhost:5000`.
4. Regístrate en el sitio.
5. La documentación de Swagger se encuentra en `http://localhost:5000/docs`.

## Preview

Puedes ver el proyecto desplegado en el siguiente link:
[https://entrega24-production.up.railway.app/](https://entrega24-production.up.railway.app/)

## Contribución

Si deseas contribuir a este proyecto, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza los cambios necesarios y haz commit (`git commit -am 'Agrega nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un pull request en GitHub.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](https://raw.githubusercontent.com/git/git-scm.com/main/MIT-LICENSE.txt) para más detalles.

## API Workflow

[src/workflow.rest](https://github.com/moliveto/Entrega24/blob/main/flow.rest)