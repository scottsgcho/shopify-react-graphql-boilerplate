import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { 
    Card,
    ResourceList,
    Stack,
    TextStyle,
    Thumbnail,
} from '@shopify/polaris';
//Using local storage for this demo app. Should use a database in a production app
import localStorage from 'store-js';

const GET_PRODUCTS_BY_ID = gql`
    query getProducts($ids: [ID!]!) {
        nodes(ids: $ids) {
            ... on Product {
                title
                handle
                descriptionHtml
                id
                images(first: 1) {
                        edges {
                        node {
                            originalSrc
                            altText
                        }
                    }
                }
                variants(first: 1) {
                        edges {
                        node {
                            price
                            id
                        }
                    }
                }
            }
        }
    }
`;

class ResourceListWithProducts extends React.Component {
    // Apollo’s components use the render props pattern in React to show loading and error states.     
    render() {
        // The sample embedded app discounts products for two weeks, so we define a variable for twoWeeksFromNow
        const twoWeeksFromNow = new Date(Date.now() + 12096e5).toDateString();        
        return (
            //Using local storage for this demo app. Should use a database in a production app
            //Sending an array of IDs inside a dictionary with key "ids" because gql specified so above
            <Query query={GET_PRODUCTS_BY_ID} variables={{ids: localStorage.get('ids')}}>
                {({ data, loading, error }) => {
                    if (loading) return <div>Loading…</div>;
                    if (error) return <div>{error.message}</div>;
                    console.log(data);
                    return (
                        <Card sectioned>
                            <ResourceList
                                showHeader
                                resourceName={{ singular: 'Product', plural: 'Products' }}
                                items={data.nodes}
                                renderItem={item => {
                                    const media = (
                                    <Thumbnail
                                        source={
                                        item.images.edges[0]
                                            ? item.images.edges[0].node.originalSrc
                                            : ''
                                        }
                                        alt={
                                        item.images.edges[0]
                                            ? item.images.edges[0].node.altText
                                            : ''
                                        }
                                    />
                                    );
                                    const price = item.variants.edges[0].node.price;
                                    return (
                                    <ResourceList.Item
                                        id={item.id}
                                        media={media}
                                        accessibilityLabel={`View details for ${item.title}`}
                                    >
                                        <Stack>
                                        <Stack.Item fill>
                                            <h3>
                                            <TextStyle variation="strong">
                                                {item.title}
                                            </TextStyle>
                                            </h3>
                                        </Stack.Item>
                                        <Stack.Item>
                                            <p>${price}</p>
                                        </Stack.Item>
                                        <Stack.Item>
                                            <p>Expires on {twoWeeksFromNow} </p>
                                        </Stack.Item>
                                        </Stack>
                                    </ResourceList.Item>
                                    );
                                }}
                            />
                        </Card>
                    );
                }}
            </Query>
        );
    }
}
    
export default ResourceListWithProducts;