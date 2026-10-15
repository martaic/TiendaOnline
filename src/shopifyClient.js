import { shopifyConfig } from './shopifyConfig';

const endpoint = `https://${shopifyConfig.storeDomain}/api/${shopifyConfig.apiVersion}/graphql.json`;

async function shopifyFetch(query, variables = {}) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': shopifyConfig.publicAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify respondió con el estado ${response.status}`);
  }

  return response.json();
}

// La colección se pasa como variable de GraphQL (más seguro que meterla en el texto)
const COLLECTION_PRODUCTS_QUERY = `
  query CollectionProducts($handle: String!) {
    collection(handle: $handle) {
      products(first: 100) {
        edges {
          node {
            id
            title
            handle
            description

            featuredImage {
              # Shopify nos da la foto ya reducida a 800 px: la web carga mucho más rápido
              url(transform: { maxWidth: 800 })
              altText
            }

            variants(first: 20) {
              nodes {
                id
                title
                availableForSale
                price {
                  amount
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getCollectionProducts(handle) {
  const result = await shopifyFetch(COLLECTION_PRODUCTS_QUERY, { handle });

  if (result.errors) {
    console.error('ERROR SHOPIFY:', result.errors);
  }

  return (
    result?.data?.collection?.products?.edges?.map(({ node }) => ({
      id: node.id,
      nombre: node.title,
      descripcion: node.description,
      imagen_url: node.featuredImage?.url || '',
      imagen_alt: node.featuredImage?.altText || '',
      variantes: node.variants.nodes,
    })) || []
  );
}