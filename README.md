# Nombre del Proyecto

Entrega de Proyecto Final

## Instalación

1. Clona el repositorio.
2. Ejecuta `npm install` para instalar las dependencias.

## Uso

1. Ejecuta `npm run start:dev` para iniciar la aplicación.
2. Crea un archivo local .env.dev.local con el siguiente contenido:
''
ENV=dev

PORT=5000
CLIENT_URL=http://localhost:5000

PERSISTENCE=MONGO
DB_HOST=localhost
DB_PORT=27017
DB_NAME=entrega23

API_KEY=yourapikey
API_SECRET=yoursecretkey

JWT_SECRET=jwtsecret
JWT_RESET_EXPIRE_IN=1h
JWT_EXPIRE_IN=1h

GOOGLE_APP_EMAIL=tu.email@gmail.com
GOOGLE_APP_PW=abcd abcd abcd abcd
''

3. Abre tu navegador y visita `CLIENT_URL`.
4. Registrate en el sitio
5. La documentacion de swagger se encuentra en  `CLIENT_URL/docs`

## Contribución

Si deseas contribuir a este proyecto, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza los cambios necesarios y haz commit (`git commit -am 'Agrega nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un pull request en GitHub.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
