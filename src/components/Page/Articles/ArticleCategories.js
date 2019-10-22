import React from 'react'
import {
  useQuery
} from 'react-apollo'
import classnames from 'classnames'
import {
  get
} from 'lodash'

import {
  Button
} from '../../../ui'
import {
  GET_ARTICLE_CATEGORIES,
} from './queries'


const ArticleCategories = ({ id }) => {
  const { loading, error, data } = useQuery(GET_ARTICLE_CATEGORIES,
    {
      variables: { id },
      fetchPolicy: "cache-and-network"
    })

  if (loading) return null

  if (error) {
    console.log({ error })
    return null
  }

  const categories = get(data, 'node.categories', [])

  return (
    categories.map((n, i) =>
      <Button
        key={i}
        title={n}
        type="dark"
        size="sm"
        className={classnames(
          { 'mx-2': i !== 0 }
        )}
        disabled
      />
    )
  )
}

ArticleCategories.propTypes = {
}

ArticleCategories.defaultProps = {
}

export default ArticleCategories
