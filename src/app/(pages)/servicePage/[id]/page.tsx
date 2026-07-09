import ContentContainer from '@/components/common-ui/containers/ContentContainer'
import ContentText from '@/components/common-ui/contentText/ContentText'
import PageHeading from '@/components/common-ui/headers/PageHeading'
import HeroImage from '@/components/sections/home/heroSection/HeroImage'
import FeatureChecklist from '@/components/sections/service/FeatureChecklist'
import { serviceData } from '@/data/service/service'
import React from 'react'

export async function generateStaticParams() {
    return serviceData.cards.map((service) => ({
        id: service.id.toString(),
    }))
}
// export const dynamicParams = true;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params

    const filteredData = serviceData.cards.filter((item) => item.id.toString() === id)
    return (
        <div>
            <ContentContainer>
                {/* <div className="text-white bg-primary p-4 text-center">
                    <Image src="/images/teeth.svg" alt="teeth" width={100} height={100} />
                </div> */}
                {
                    filteredData.map((item) => (
                        <div key={item.id} className=' flex space-y-8  flex-col '>
                            <div className='flex flex-col items-center space-y-4'>
                                <PageHeading children={item.title} motionProps={{ animate: { opacity: 1, y: 0 } }} />
                                <div className='text-center w-[30rem]'>
                                    <ContentText children={item.description} className='px-6' motionProps={{ animate: { opacity: 1, y: 0 } }} />
                                </div>
                            </div>
                            <HeroImage src={item.imgSrc} alt={item.title} className='max-w-full h-[90vh]' motionProps={{ animate: { opacity: 1, scale: 1 } }} />
                            <div className='flex flex-col space-y-8 lg:px-20 '>
                                {
                                    item?.detailsPageData?.map((detail, idx) => (
                                        <div key={idx} className='flex flex-col  space-y-6 lg:mt-10 '>
                                            <PageHeading children={detail.title} className='text-5xl' />
                                            {
                                                detail?.description?.map((desc, idx) => (
                                                    <ContentText key={idx} children={desc} className='' />
                                                ))
                                            }
                                        </div>
                                    ))
                                }

                                {item.featureChecklist && <FeatureChecklist items={item.featureChecklist} />}
                            </div>

                        </div>

                    ))
                }

            </ContentContainer>

        </div>
    )
}

export default Page