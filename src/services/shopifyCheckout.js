import { shopifyConfig } from '../shopifyConfig.js';

const endpoint = `https://${shopifyConfig.storeDomain}/api/${shopifyConfig.apiVersion}/graphql.json`;

const VARIANT_PREFIX = 'gid://shopify/ProductVariant/';

const PAGO_PENDIENTE_KEY = 'elpuesto-pago-pendiente';

const CART_QUERY = `
  query cart($id: ID!) {
    cart(id: $id) {
      id
    }
  }
`;

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

  const cart = result.data?.cartCreate?.cart;
  if (!cart?.checkoutUrl) {
    throw new Error('Shopify no ha devuelto la página de pago.');
  }

  // Apuntamos qué carrito de Shopify se está pagando, para saber luego si la compra terminó
  try {
    localStorage.setItem(PAGO_PENDIENTE_KEY, cart.id);
  } catch {
    // Navegación privada: no pasa nada, simplemente no se vaciará solo
  }

  return cart.checkoutUrl;
}

/**
 * Comprueba si el último pago iniciado ya se completó.
 * Cuando un cliente termina de pagar, Shopify "cierra" ese carrito y deja de devolverlo.
 * Devuelve true si la compra se completó (y hay que vaciar el carrito de la web).
 */
export async function comprobarCompraTerminada() {
  let cartId = null;
  try {
    cartId = localStorage.getItem(PAGO_PENDIENTE_KEY);
  } catch {
    return false;
  }
  if (!cartId) return false;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': shopifyConfig.publicAccessToken,
      },
      body: JSON.stringify({ query: CART_QUERY, variables: { id: cartId } }),
    });
    if (!response.ok) return false; // si Shopify no responde, no tocamos nada

    const result = await response.json();
    if (result.errors?.length) return false;

    // Si Shopify ya no devuelve el carrito, la compra se ha completado
    if (result.data?.cart === null) {
      localStorage.removeItem(PAGO_PENDIENTE_KEY);
      return true;
    }
    return false; // el cliente aún no ha pagado: dejamos su carrito como está
  } catch {
    return false;
  }
}