import { FC } from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import SimpleLayout from '@layouts/Simple'
import { Region } from '@components/regions/RegionComponentTypes'
import { Card } from '@components/card/Card'
import SmartLink from '@components/link/SmartLink'
import MarkdownContent from '@components/markdown/MarkdownContent'
import slugify from 'utils/slugify'
import { getOxfordCommaSeparator } from 'utils/strings'
type Props = {
  data: {
    regions: {
      nodes: Region[]
    }
  }
}

const RegionsPage: FC<Props> = ({
  data: {
    regions: { nodes: regions },
  },
}) => {
  const createRegionHref = (region: Region) => {
    const regionSlug = slugify(region.name)
    return `/regions/${regionSlug}`
  }

  // totals up and returns the population count for a region
  const getRegionPopulationCount = (region: Region): string => {
    const populationCount = region.subregions
      .reduce((count: number, subregion) => {
        return count + subregion.population.count
      }, 0)
      .toLocaleString()
    return populationCount
  }

  // creates subregion links for a given region
  const createSubregionLinks = (region: Region): JSX.Element[] => {
    const regionHref = createRegionHref(region)
    return region.subregions.map((subregion, index, array) => {
      const subregionSlug = slugify(subregion.name)
      const subregionHref = `${regionHref}/${subregionSlug}`
      const seperator = getOxfordCommaSeparator(index, array)
      return (
        <span key={subregion.name}>
          {seperator}
          <SmartLink className="link" href={subregionHref}>
            {subregion.name}
          </SmartLink>
        </span>
      )
    })
  }

  // generate the header for each Card
  const createRegionsCardHeader = (region: Region): JSX.Element => {
    return (
      <GatsbyImage
        key={region.name}
        image={region.map.gatsbyImageData}
        alt={`Map highlighting the ${region.name} region.`}
        className="mb-4 w-full"
      />
    )
  }

  const createRegionsCardBody = (region: Region): JSX.Element => {
    return (
      <>
        <p className="mb-3">
          <strong>Population:</strong> {getRegionPopulationCount(region)}
        </p>
        <div className="mb-3 space-y-2 line-clamp-3">
          <MarkdownContent content={region.overview} />
        </div>
      </>
    )
  }

  return (
    <SimpleLayout pageTitle="Regions">
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 lg:px-8 py-12 lg:py-24 max-w-7xl mx-auto">
        {regions.map((region) => (
          <Card
            key={region.name}
            header={createRegionsCardHeader(region)}
            title={region.name}
            additionalHeaderContent={createSubregionLinks(region)}
            body={createRegionsCardBody(region)}
            actions={[
              {
                url: createRegionHref(region),
                label: 'View Region',
              },
            ]}
          />
        ))}
      </section>
    </SimpleLayout>
  )
}

export default RegionsPage

export const pageQuery = graphql`
  query RegionsQuery {
    regions: allDaRegion {
      nodes {
        name
        map {
          gatsbyImageData
        }
        overview
        subregions {
          name
          population {
            count
          }
        }
      }
    }
  }
`
