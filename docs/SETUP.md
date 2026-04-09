# FinCove - Guía de Configuración

## 1. Crear Proyecto en Supabase (Free Tier)

1. Ve a https://supabase.com y crea una cuenta gratuita
2. Crea un nuevo proyecto (gratis forever tier)
3. Guarda:
   - Project URL
   - anon public key
   - service_role key (sección API)

## 2. Configurar Google OAuth

1. Ve a https://console.cloud.google.com
2. Crea un proyecto nuevo
3. Ir a APIs & Services > Credentials
4. Crear OAuth 2.0 Client ID
5. Configurar Authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (para desarrollo)
6. Copiar Client ID y añadir a Supabase Auth > Providers > Google

## 3. Configurar Base de Datos

Ejecutar el SQL en Supabase SQL Editor:

```sql
-- Ver archivo supabase/migrations/001_initial_schema.sql
```

## 4. Configurar Storage (Bóveda)

1. Ir a Storage en Supabase Dashboard
2. Crear bucket "vault" (público)
3. Configurar policies para uploads solo de usuarios autenticados

## 5. Variables de Entorno

Copiar `.env.example` a `.env.local` y completar valores.

## 6. Instalar y Ejecutar

```bash
npm install
npm run dev
```

## 7. Deploy en Vercel

1. Subir código a GitHub
2. Importar en https://vercel.com
3. Configurar variables de entorno
4. Deploy automático
