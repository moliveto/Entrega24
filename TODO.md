[x] falta desplegar la aplicación para probar en produccion
[x] falta agregar paginacion a la respuesta de GET /api/products
[x] faltan todos los controladores de la ruta /carts
[x] seria mejor si con fines de testeo puedas proporcionar una base de datos previamente cargada con productos ya que ahora se me dificulta esa parte de pruebas
[x] ticket tampoco se encuentra disponible, por lo que esto sumado a la ruta de carrito hace que no se pueda vivir la experiencia de compra
[ ] passport solo se encuentra integrado en /login, no se ve ningun otro tipo de implementación de passport como github 
[x] la recuperacion de contraseña al menos en local no funciona, el token siempre se presenta como invalido

Por otro lado, la estructura es prolija y la arquitectura sigue buenas practicas, por lo que en este sentido segui así ya que vas re bien, como tambien las tecnologías implementadas muchas estan muy bien incorporadas como winston y multer, la subidad de archivos funciona excelente

las rutas basicas de productos y usuario tambien estan bastante completas. 

[x] Como te habre dicho por chat, es importante que se pueda completar el proceso de compra.
[x] De paso, si en tu mongo atlas cargas un usuario admin con un correo falso para que pueda probar las demas funcionalidades con postman te lo agradeceria

GET /api/users

nombre, correo, rol

DELETE /api/users

limpiar los usuarios que no haya tenido conexion en los ultimos 2 dias
puedes probar con los ultimos 40 minutos

Crear una vista para modificar el rol de los usuarios solo debe ser accesible por el admin del ecomerce

* modificar el endpoint que elimina productos para avisarle al usuario premium que el producto fue eliminado