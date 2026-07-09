// src/app/(pages)/dentist/[id]/page.tsx

import { notFound } from 'next/navigation'
import { getDentistById, dentistsData } from '@/data/dentists/dentists'
import ContentContainer from '@/components/common-ui/containers/ContentContainer'
import DentistDetailClient from '@/components/sections/dentists/DentistDetailClient'

export async function generateStaticParams() {
  return dentistsData.dentists.map((dentist) => ({
    id: dentist.id.toString(),
  }))
}

interface PageProps {
  params: Promise<{ id: string }>
}
// export const dynamicParams = true;

export default async function DentistDetailPage({ params }: PageProps) {
  const { id: dentistId } = await params

  const dentist = getDentistById(dentistId)

  const relatedDentists = dentistsData.dentists
    .filter(d => d.id !== dentist?.id)
    .slice(0, 3)

  if (!dentist) {
    notFound()
  }

  return (
    <>
      <ContentContainer>
        <DentistDetailClient dentist={dentist} relatedDentists={relatedDentists} />
      </ContentContainer>

    </>
  )
}