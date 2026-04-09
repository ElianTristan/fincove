# FinCove - Gestión Financiera Familiar

Aplicación web FinTech PWA para gestión financiera familiar. 100% gratuita, construida con Next.js 14, Supabase y herramientas open-source.

## Features

- **Dashboard**: Gráficas e indicadores de gastos
- **Gastos**: CRUD completo con tipos (crédito, MSI, fijos)
- **OCR**: Escaneo de tickets con Tesseract.js (100% gratuito)
- **Bóveda**: Almacenamiento de comprobantes
- **Tandas**: Sistema de ahorro rotativo
- **Grupos Familiares**: Código de invitación de 6 dígitos
- **PWA**: Instalable, funciona offline

## Stack Tecnológico

- **Frontend**: Next.js 14 + TypeScript + TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **OCR**: Tesseract.js (local, sin costos)
- **Gráficas**: Recharts
- **Animaciones**: Framer Motion
- **Deploy**: Vercel (Free Plan)

## Instalación Local

1. **Clonar y entrar al directorio**:
```bash
cd fincove
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase.

4. **Ejecutar en desarrollo**:
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Configuración de Supabase

1. Crea una cuenta gratuita en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto (Free Tier)
3. Ve a SQL Editor y ejecuta el contenido de `supabase/migrations/001_initial_schema.sql`
4. Configura Google OAuth en Authentication > Providers
5. Crea un bucket llamado "vault" en Storage

## Configuración de Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un proyecto y habilita Google OAuth 2.0
3. Configura las URIs de redirección:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback`
4. Copia el Client ID a Supabase

## Deploy en Vercel

1. Sube el código a GitHub
2. Importa el repositorio en [vercel.com](https://vercel.com)
3. Configura las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
4. Deploy automático en cada push

## Estructura del Proyecto

```
fincove/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── dashboard/    # Dashboard pages
│   │   ├── api/          # API routes
│   │   ├── login/        # Auth pages
│   │   └── ...
│   ├── components/       # React components
│   │   ├── ui/           # UI components
│   │   ├── charts/       # Chart components
│   │   └── layout/       # Layout components
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilities
│   └── types/            # TypeScript types
├── supabase/             # SQL migrations
└── public/               # Static assets
```

## Costos

Este proyecto está diseñado para funcionar 100% gratis usando:

- **Vercel**: Free tier (hobby)
- **Supabase**: Free tier (500MB DB, 1GB storage)
- **Tesseract.js**: OCR local sin costos
- **Google OAuth**: Gratis hasta 10,000 usuarios/mes

## Licencia

MIT - Libre para usar y modificar.

## Soporte

Para preguntas o problemas, abre un issue en GitHub.
