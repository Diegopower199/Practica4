Practica 4 realizada por Guillermo Ariño y Diego González

Enunciado de la Practica 4:


Para esta tercera práctica se pide que desarrolléis una API en GraphQL para un concesionario de coches. 
Se deberá crear un .env con los siguientes campos

    - URL_MONGO = con la url al servidor de mongo
    - PORT = con el puerto para que corra el servidor

NO se puede subir el .env al repositorio, en este caso se deberá subir un .env.sample
La base de datos debera ser OBLIGATORIAMENTE con MongoDB y tendra las siguientes colecciones:

    - Vendedor
    - Coche
    - Concesionario

Las funciones que se piden son las siguientes
    - Crear vendedor
    - Crear coche
    - Crear Concesionario
    - Añadir Coche a un vendedor
    - Añadir Vendedor a un concesionario
    - Obtener coches
        - por Id
        - por rango de precio
    - Obtener Venderores
        - por id
        - por nombre
    - Obtener Concesionarios 
        - por id
        - por campo comun ex: Localidad (paginado)

Todas las peticiones para obtener datos podran ir encadenadas, es decir.
Si busco un Concesionario pode obtener el listado de Vendedores y a su vez el listado de coches de cada vendedor