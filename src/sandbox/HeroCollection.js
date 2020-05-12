import React from 'react';
import { useQuery } from 'react-apollo';
import { get, drop, first } from 'lodash';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import { useSandbox } from '.';
import { ContentCard, HighlightCard, Media } from '../ui';
import { GET_CONTENT_FEED } from '../content-feed';
import ContentCardConnected from '../content-card-connected';

const RATIO_MAP = {
    '-1': '4by3',
    0: { xs: '1by1', lg: '16by9' },
    1: '21by9',
};

const cardLoadingObject = {
    id: 'fake_id',
    title: '',
    coverImage: [],
    ratio: RATIO_MAP[0],
};

const StyledHighlightCard = ({ style, ...props }) => <HighlightCard {...props} style={{ maxHeight: 450, ...style }} />;
const ColumnHighlightCard = ({ style, ...props }) => (
    <div className={classnames('col-12',
        'col-md-6',
        'col-lg-4',
        'px-2',
        'pt-2')}
    >
        <HighlightCard {...props} style={{ ...style, height: '100%' }} ratio="1by1" />
    </div>
);

const THEME_CARD_MAP = {
    default: ContentCard,
    highlight: ColumnHighlightCard,
};

const HeroCollection = ({
    itemId,
}) => {
    const {
        loading,
        error,
        data,
    } = useQuery(GET_CONTENT_FEED, {
        fetchPolicy: 'cache-and-network',
        variables: {
            itemId,
            child: true,
            sibling: false,
        },
    });
    if (loading || error) return null;
    const content = get(data, 'node.childContentItemsConnection.edges', []).map(({ node }) => node);
    const hero = first(content);
    const items = drop(content);

    return (
        <div>
            <Media
                imageUrl={get(hero, 'images[0].sources[0].uri')}
                ratio={{ xs: '1by1', lg: '21by9' }}
                overlay="black"
                forceRatio
            >
                <div
                    className={
                        classnames(
                            'px-2',
                            'py-3',
                            'py-lg-4',
                            'w-100',
                            'max-width-1100',
                        )
                    }
                    style={{
                        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                    }}
                >
                    <h1 className="text-white">{hero.title}</h1>
                    <h3 className="text-light">{hero.summary}</h3>
                    <button className={classnames('btn', 'btn-primary')}>Learn More</button>
                </div>
            </Media>
            {items.length > 0 && (
                <div className="container-fluid">
                    <div className="row pb-2">
                        {items.map(({ id }) => <ContentCardConnected contentId={id} />)}
                    </div>
                </div>
            )}

        </div>
    );
};

export default HeroCollection;