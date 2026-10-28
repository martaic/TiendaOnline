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

// Convierte un producto de Shopify al formato que usa la web
function adaptarProducto(node) {
  return {
    id: node.id,
    nombre: node.title,
    descripcion: node.description,
    imagen_url: node.featuredImage?.url || '',
    imagen_alt: node.featuredImage?.altText || '',
    variantes: node.variants.nodes,
  };
}

export async function getCollectionProducts(handle) {
  const result = await shopifyFetch(COLLECTION_PRODUCTS_QUERY, { handle });

  if (result.errors) {
    console.error('ERROR SHOPIFY:', result.errors);
  }

  return result?.data?.collection?.products?.edges?.map(({ node }) => adaptarProducto(node)) || [];
}

// ================= BUSCADOR =================
// En lugar de usar el buscador de Shopify (que también mira descripciones e ingredientes,
// y por eso "acei" encontraba todo lo que lleva "aceite"), descargamos la lista de
// productos una vez y buscamos nosotros SOLO en el nombre. Con un par de cientos de
// productos es instantáneo.
const ALL_PRODUCTS_QUERY = `
  query TodosLosProductos($cursor: String) {
    products(first: 250, after: $cursor, sortKey: TITLE) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        title
        handle
        description

        featuredImage {
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
`;

// Guardamos la lista para no descargarla en cada letra que se escribe
let catalogoGuardado = null;

async function obtenerCatalogo() {
  if (catalogoGuardado) return catalogoGuardado;

  const productos = [];
  let cursor = null;

  // Shopify da como mucho 250 productos por petición: si hay más, pedimos la siguiente página
  for (let pagina = 0; pagina < 10; pagina += 1) {
    const result = await shopifyFetch(ALL_PRODUCTS_QUERY, { cursor });

    if (result.errors) {
      console.error('ERROR SHOPIFY (catálogo):', result.errors);
      throw new Error('Error cargando los productos');
    }

    const datos = result?.data?.products;
    productos.push(...(datos?.nodes || []).map(adaptarProducto));

    if (!datos?.pageInfo?.hasNextPage) break;
    cursor = datos.pageInfo.endCursor;
  }

  catalogoGuardado = productos;
  return productos;
}

// Quita tildes y mayúsculas: "Piña" -> "pina", "AZÚCAR" -> "azucar"
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Raíz de cada palabra buscada, para que "aceitunas" encuentre "Aceituna gordal"
// (quita el plural: -es / -s; y -ces pasa a -z, como nueces -> nuez).
function palabrasClave(texto) {
  return normalizar(texto)
    .split(/\s+/)
    .filter(Boolean)
    .map((palabra) => {
      if (palabra.length <= 4) return palabra;
      if (palabra.endsWith('ces')) return palabra.slice(0, -3) + 'z'; // nueces -> nuez
      return palabra.replace(/(es|s)$/, '');
    });
}

export async function buscarProductos(texto) {
  const claves = palabrasClave(texto);
  if (claves.length === 0) return [];

  const catalogo = await obtenerCatalogo();

  // Un producto sale si su NOMBRE contiene todas las palabras buscadas
  const encontrados = catalogo.filter((producto) => {
    const nombre = normalizar(producto.nombre);
    return claves.every((clave) => nombre.includes(clave));
  });

  // Primero los que tienen stock, luego los agotados
  const hayStock = (producto) => producto.variantes.some((v) => v.availableForSale !== false);
  return [...encontrados.filter(hayStock), ...encontrados.filter((p) => !hayStock(p))];
}