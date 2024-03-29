
# stage1 as builder
FROM node:18-alpine as builder
WORKDIR /app
# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install
# Copy rest of the files
COPY . .
# Build the project
RUN npm run build


FROM nginx:alpine as production-build
COPY nginx.conf /etc/nginx/nginx.conf
## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*
# Copy from the stage 1
COPY --from=builder /app/dist /usr/share/nginx/html/shopping-mall/admin/
EXPOSE 6300
ENTRYPOINT ["nginx", "-g", "daemon off;"]