# Etapa 1: Construir la aplicación
FROM node:18-alpine AS build

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos necesarios
COPY package.json yarn.lock ./

# Instalar dependencias
RUN yarn install

# Copiar el resto del código
COPY . .

# Compilar la app para producción
RUN yarn build

# Etapa 2: Servir la app con Nginx
FROM nginx:alpine

# Copiar la compilación al directorio donde Nginx sirve los archivos
COPY --from=build /app/build /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto: iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
