# 🧑‍🤝‍🧑 Red social

Esta es una aplicación web tipo red social desarrollada con **Angular** en el frontend y **NestJS** en el backend. Permite a los usuarios registrarse, iniciar sesión, publicar contenido, interactuar con otras personas y gestionar su perfil. Simula ser como una especie de Instagram.

Link a la app -> [Frandly](https://francisco-martinez-balian-tp-2-prog.vercel.app/)

---

## 📸 Funcionalidades principales

- Registro y autenticación de usuarios (JWT).
- Publicación de posts (texto / imágenes).
- Comentarios y "me gusta".
- Perfil personal con información.
- Feed de publicaciones.
- Paginación de publicaciones.

## 🛠️ Tecnologías usadas

### Frontend
- Angular
- TypeScript
- Bootstrap
- RxJS
- JWT Auth Interceptor
- Angular Router

### Backend
- NestJS
- MongoDB
- Bcrypt para hashing de contraseñas

## 📌 Requisitos

- Angular 17 o superior
- Typescript
- Boostrap
- NestJS
- MongoDB

## 👨‍💻 Ejecución

En el front ->
```bash
npm install
ng serve -o
```

En el back ->
```bash
npm install
nest start
```

## ❕ Aclaración

Como este proyecto fue deployado en Render (el back), puede que las imagenes no carguen correctamente o que se eliminen después de un cierto tiempo. Aparte, la interacción con la aplicación luego de mas de un día sin utilizar, puede ser tardía al principio.
