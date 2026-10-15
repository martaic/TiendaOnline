import { shopifyConfig } from '../shopifyConfig.js';

const endpoint = `https://${shopifyConfig.storeDomain}/api/${shopifyConfig.apiVersion}/graphql.json`;

const VARIANT_PREFIX = 'gid://shopify/ProductVariant/';

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Crea un carrito en Shopify con los productos de nuestra web
 * y devuelve la URL de la página de pago de Shopify.
 */
export async function createShopifyCheckout(cartItems) {
  // Solo aceptamos IDs de VARIANTE reales de Shopify.
  // (Antes se intentaba "arreglar" un ID de producto cambiando el texto, pero eso no funciona:
  //  el ID de un producto y el de su variante son números distintos.)
  // (El mix de gildas usa "variantId" porque su "id" incluye la composición)
  const varianteDe = (item) => String(item.variantId || item.id || '');
  const invalidos = cartItems.filter((item) => !varianteDe(item).startsWith(VARIANT_PREFIX));
  if (invalidos.length > 0) {
    console.error('Productos con ID no válido en el carrito:', invalidos);
    throw new Error(
      `Hay productos en el carrito que no se pueden comprar: ${invalidos
        .map((i) => i.title || i.nombre)
        .join(', ')}`
    );
  }

  const lines = cartItems.map((item) => {
    const line = {
      merchandiseId: varianteDe(item),
      quantity: item.quantity,
    };

    // Datos extra que verán los dueños en el pedido (p. ej. composición del mix de gildas)
    if (item.descripcion) {
      line.attributes = [{ key: 'Composición', value: String(item.descripcion) }];
    }

    return line;
  });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': shopifyConfig.publicAccessToken,
    },
    body: JSON.stringify({
      query: CART_CREATE_MUTATION,
      variables: {
        input: {
          lines,
          buyerIdentity: { countryCode: 'ES' }, // precios y envíos para España
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Shopify respondió con el estado ${response.status}`);
  }

  const result = await response.json();

  if (result.errors?.length) {
    throw new Error(result.errors[0].message);
  }

  const userErrors = result.data?.cartCreate?.userErrors || [];
  if (userErrors.length > 0) {
    throw new Error(userErrors[0].message);
  }

  const checkoutUrl = result.data?.cartCreate?.cart?.checkoutUrl;
  if (!checkoutUrl) {
    throw new Error('Shopify no ha devuelto la página de pago.');
  }

  return checkoutUrl;
}