import { shopifyConfig } from './shopifyConfig';

async function shopifyFetch(query) {
  const response = await fetch(
    `https://${shopifyConfig.storeDomain}/api/${shopifyConfig.apiVersion}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token':
          shopifyConfig.publicAccessToken,
      },
      body: JSON.stringify({ query }),
    }
  );

  return response.json();
}

export async function getCollectionProducts(handle) {
  const query = `
  {
    collection(handle: "${handle}") {
      products(first: 100) {
        edges {
          node {
            id
            title
            handle
            description

            featuredImage {
              url
            }

            variants(first: 20) {
              nodes {
                id
                title
                price {
                  amount
                }
              }
            }
          }
        }
      }
    }
  }`;

  const result = await shopifyFetch(query);


if (result.errors) {
  console.error('ERROR SHOPIFY:', result.errors);
}

  return (
    result?.data?.collection?.products?.edges?.map(({ node }) => ({
      id: node.id,
      nombre: node.title,
      descripcion: node.description,
      imagen_url: node.featuredImage?.url || '',
      variantes: node.variants.nodes
    })) || []
  );
}