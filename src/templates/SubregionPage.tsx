import { FC } from 'react'
import { StaticImage } from 'gatsby-plugin-image'
import slugify from 'utils/slugify'

import { Region, Subregion } from '@components/regions/RegionComponentTypes'

import SimpleLayout from 'layouts/Simple'
import UpdateList from '@components/list/UpdateList'
import MarkdownContent from '@components/markdown/MarkdownContent'
import SmartLink from '@components/link/SmartLink'

type TemplateProps = {
  pageContext: {
    subregion: Subregion
  }
}

const RegionPage: FC<TemplateProps> = ({ pageContext: { subregion } }) => {
  return (
    <SimpleLayout
      pageTitle={`Subregion: ${subregion.name} (${subregion.region.name})`}
    >
      <h1 className="text-2xl font-semibold text-gray-800">
        {subregion.name}
        <small>
          <SmartLink
            className="link"
            href={`/regions/${slugify(subregion.region.name)}`}
          >
            {subregion.region.name}
          </SmartLink>
        </small>
      </h1>

      <h2>Overview</h2>
      <MarkdownContent content={subregion.overview} />

      <UpdateList list={subregion.newsUpdates} />
    </SimpleLayout>
  )
}

export default RegionPage
