# VotAI - Test de Afinidad Programatica

**Descubre con cual candidato presidencial coincides mas, segun sus propuestas reales.**

VotAI es una plataforma civica colombiana para las elecciones presidenciales de 2026. Responde 10 preguntas sobre los temas que importan y el sistema compara tus respuestas con las propuestas oficiales de cada candidato.

> **Importante:** VotAI NO es una encuesta electoral. No pregunta por quien vas a votar. Mide que tan parecido piensas a cada candidato basandose en sus programas de gobierno.

---

## Como funciona

### 1. Te presentas (sin datos personales)
Seleccionas tu rango de edad, region y preferencia inicial. No pedimos nombre, cedula ni email. Todo es anonimo.

### 2. Respondes 10 preguntas
Cada pregunta es sobre un tema diferente: economia, salud, educacion, seguridad, ambiente, politica social, politica exterior, reforma politica, empleo y tecnologia.

Para cada pregunta respondes del 1 al 5 (totalmente en desacuerdo a totalmente de acuerdo) y dices que tan importante es ese tema para ti.

**Las preguntas son aleatorias.** Hay un banco de 30 preguntas y cada persona recibe una combinacion diferente (siempre cubriendo los 10 temas). Esto evita que bots manipulen los resultados.

### 3. Recibes tu resultado
El sistema te muestra:
- Un ranking de los 6 candidatos, del mas afin al menos afin
- Un porcentaje de afinidad con cada uno
- Una explicacion de por que coincides o no en cada tema
- Citas textuales de los programas de gobierno con numero de pagina

### 4. Compartes tu resultado
Puedes descargar una imagen con tu top 3 y compartirla en WhatsApp, Twitter/X o cualquier red social.

---

## Los candidatos

| Candidato | Partido |
|-----------|---------|
| Ivan Cepeda | Pacto Historico |
| Abelardo de la Espriella | Defensores de la Patria |
| Paloma Valencia | Centro Democratico / Gran Coalicion |
| Claudia Lopez | Con Claudia, imparables |
| Sergio Fajardo | Dignidad y Compromiso |
| Roy Barreras | La Fuerza / Frente por la Vida |

---

## La matematica detras del resultado

No hay magia ni IA decidiendo tu resultado. Es una formula transparente:

1. Cada candidato tiene una postura del 1 al 5 en cada tema (sacada de su programa de gobierno)
2. Tus respuestas tambien son del 1 al 5
3. Se mide la distancia entre tu respuesta y la postura de cada candidato
4. Se multiplica por la importancia que le diste a cada tema
5. Se suman todos los temas y sale un porcentaje de 0 a 100

Si un candidato piensa igual que tu en los temas que mas te importan, su porcentaje sera alto. Asi de simple.

---

## Privacidad y cumplimiento legal

- **No almacenamos datos personales** (nombre, cedula, email, IP)
- Los datos demograficos son rangos genericos y voluntarios
- Cada sesion tiene un codigo aleatorio no vinculable a ninguna persona
- Puedes borrar tus datos en cualquier momento
- Cumplimos con la Ley 1581 de 2012 (Habeas Data)
- Durante el silencio electoral (8 dias antes de elecciones) las estadisticas se bloquean automaticamente

---

## Estadisticas publicas

Con suficientes usuarios, la plataforma muestra datos agregados como:
- Que candidato tiene mayor afinidad general
- Como varia la afinidad por region y edad
- Cuantas personas descubren que su candidato preferido no es con quien mas coinciden
- Cuales son los temas que mas dividen a los colombianos

Nunca se cruzan multiples datos demograficos para evitar identificar a alguien.

---

## Tecnologia

- **Frontend:** Next.js 16, React, TypeScript, Tailwind CSS
- **Backend:** NestJS, Supabase (PostgreSQL), Redis, Bull
- **IA:** Anthropic Claude (solo para generar resumenes en lenguaje natural, NO para calcular resultados)

---

## Para desarrolladores

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local

# Iniciar en modo desarrollo
pnpm dev
```

Variables de entorno necesarias:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_SHOW_PUBLIC_STATS=true
NEXT_PUBLIC_ELECTORAL_SILENCE=false
```

---

## Nota legal

VotAI es una herramienta educativa y civica. Mide afinidad programatica, no intencion de voto. No esta afiliada a ningun partido politico ni candidato. Las posiciones de los candidatos se extraen de sus programas de gobierno oficiales y son verificables con numero de pagina.

Desarrollado en Colombia para Colombia.
