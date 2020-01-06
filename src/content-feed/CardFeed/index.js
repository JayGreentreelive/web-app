import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'react-apollo'
import { get } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/fontawesome-pro-regular'

import {
    ContentContainer,
    Loader,
    ContentCard
} from '../../ui'
import ContentCardConnected from '../../content-card-connected'
import { GET_CONTENT_FEED } from '../queries'

const CardFeed = ({
    id,
    title,
    connection,
    urlBase,
    first
}) => {
    // we want to query at least one additional item just in case we get back the
    //  original item as a part of the child/sibling collection. Later on, we'll filter
    //  results to remove the original item from the list
    const calculatedFirst = first
        ? first + 1
        : null
    const { loading, error, data } = useQuery(GET_CONTENT_FEED, {
        variables: {
            itemId: id,
            first: calculatedFirst,
            child: connection === "child",
            sibling: connection === "sibling",
        }
    })

    if (loading) return (
        <ContentContainer>
            <Loader />
        </ContentContainer>
    )

    if (error) {
        console.log({ error })
        return null
    }

    let content = get(data, `node.${connection}ContentItemsConnection.edges`, []).map(
        edge => edge.node
    ).filter(n => n.id !== id)

    if (first) content = take(content, first)

    return (
        <div className="container-fluid max-width-1100 my-6 px-4">
            <div className="row">
                <div className="col">
                    <h3 className="text-dark align-self-start">
                        {title}
                    </h3>
                </div>
                {!!urlBase && urlBase !== '' &&
                    <div className="col text-right">
                        <a
                            href={`/${urlBase}`}
                            className="text-dark align-self-end"
                        >
                            See More
                        </a>
                    </div>
                }
            </div>
            <div className="row mx-n1">
                {content.map((n, i) => (
                    <ContentCardConnected
                        key={i}
                        contentId={n.id}
                        urlBase={urlBase}
                    />
                ))}
            </div>
        </div>
    )
}

CardFeed.propTypes = {
    id: PropTypes.string,
    connection: PropTypes.oneOf([
        'child',
        'sibling'
    ]),
    title: PropTypes.string,
    first: PropTypes.number,
}

CardFeed.defaultProps = {
    id: null,
    connection: 'child',
    first: null
}

export default CardFeed