# ETAPA 1: Construcción
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ETAPA 2: Servidor de producción
FROM nginx:stable-alpine
# Copiamos los archivos de la carpeta dist (Vite genera 'dist', no 'build')
COPY --from=build /app/dist /usr/share/nginx/html
# Copiamos una configuración de Nginx para manejar rutas de React (opcional pero recomendado)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]