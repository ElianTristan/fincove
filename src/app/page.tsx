'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Wallet,
  Receipt,
  Users,
  Shield,
  Smartphone,
  TrendingUp,
  ArrowRight,
  Check,
  Zap,
  Lock,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: Receipt,
    title: 'Control de Gastos',
    description: 'Registra y categoriza tus gastos familiares con OCR inteligente.',
  },
  {
    icon: Users,
    title: 'Tandas',
    description: 'Organiza tandas familiares con seguimiento de turnos y pagos.',
  },
  {
    icon: Shield,
    title: 'Bóveda Digital',
    description: 'Almacena todos tus tickets y comprobantes en un solo lugar.',
  },
  {
    icon: TrendingUp,
    title: 'Reportes',
    description: 'Visualiza tu progreso con gráficas detalladas y análisis.',
  },
  {
    icon: Smartphone,
    title: 'PWA Ready',
    description: 'Instala como app en tu teléfono y usa sin conexión.',
  },
  {
    icon: Lock,
    title: 'Seguridad',
    description: 'Tus datos protegidos con encriptación de nivel bancario.',
  },
]

const steps = [
    { step: '01', title: 'Crea tu cuenta', description: 'Regístrate gratis en segundos con Google o email.' },
    { step: '02', title: 'Crea o únete a un grupo', description: 'Forma un grupo familiar con código de invitación de 6 dígitos.' },
    { step: '03', title: 'Comienza a gestionar', description: 'Registra gastos, crea tandas y visualiza reportes.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-8"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary-500"></span>
              <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                100% Gratis - Sin costos ocultos
              </span>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            >
              Gestión financiera{' '}
              <span className="gradient-text">familiar</span>
              <br />
              simplificada
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10"
            >
              Controla gastos, organiza tandas y mantén tus finanzas familiares
              en orden con una app simple, segura y completamente gratuita.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/register">
                <Button size="lg" className="btn-glow text-lg px-8 py-4">
                  Comenzar gratis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Iniciar sesión
                </Button>
              </Link>
            </motion.div>

            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute left-10 top-1/2 hidden xl:block"
            >
              <div className="glass rounded-2xl p-4 shadow-xl animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ahorro este mes</p>
                    <p className="text-lg font-bold">$12,450</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute right-10 top-1/3 hidden xl:block"
            >
              <div className="glass rounded-2xl p-4 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tanda activa</p>
                    <p className="text-lg font-bold">5 participantes</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Todo lo que necesitas
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Herramientas completas para gestionar las finanzas de tu familia
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-gray-50 dark:bg-dark-700 card-hover"
              >
                <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Como funciona</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Comienza en minutos con estos simples pasos
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-gray-200 dark:text-dark-600 mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ¿Listo para tomar el control?
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Únete a miles de familias que ya gestionan sus finanzas de manera
              inteligente con FinCove.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-gray-100 text-lg px-8"
                >
                  Crear cuenta gratis
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-primary-200">
              No requiere tarjeta de crédito • Free tier permanente
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FinCove</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 FinCove. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
