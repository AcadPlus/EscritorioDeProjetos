'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function LinkaHome() {
  const router = useRouter()

  const handleExploreClick = () => {
    router.push('/linka/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <Card className="max-w-2xl mx-auto shadow-lg rounded-lg p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardTitle className="text-3xl font-semibold text-center text-gray-900">
            Bem-vindo ao LINKA
          </CardTitle>
          <CardContent className="mt-4 text-center">
            <CardDescription className="text-gray-700 text-lg">
              A plataforma de parcerias para explorar startups, competências e laboratórios. Descubra novas oportunidades e conecte-se com a inovação na UFC.
            </CardDescription>
            <Button 
              onClick={handleExploreClick}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Explorar Vitrines
            </Button>
          </CardContent>
        </motion.div>
      </Card>
    </div>
  )
}
