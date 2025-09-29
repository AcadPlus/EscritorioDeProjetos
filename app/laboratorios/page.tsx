import { LaboratorioShowcase } from "./components/laboratorio-showcase"
import { fetchPublicLaboratoriosForServer } from "@/lib/api/laboratorio"
import type { LaboratorioResponse } from "@/lib/types/laboratorioTypes"

export default async function LaboratorioShowcasePage() {
  const initialLaboratorios: LaboratorioResponse[] | null = await fetchPublicLaboratoriosForServer({ visivel: true })
  return <LaboratorioShowcase initialLaboratorios={initialLaboratorios} />
}
