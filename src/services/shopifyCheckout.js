import { shopifyConfig } from '../shopifyConfig.js';

const endpoint = `https://${shopifyConfig.storeDomain}/api/${shopifyConfig.apiVersion}/graphql.json`;

export async function createShopifyCheckout(cartItems) {
  // Aseguramos que el ID que se envía empiece por 'gid://shopify/ProductVariant/'
  // Si tus páginas envían un ID numérico suelto o un ID de producto base, lo convertimos/corregimos
  const lines = cartItems.map(item => {
    let cleanId = item.id;

    // Si el ID viene como "Product", lo forzamos a "ProductVariant" para que Shopify lo acepte
    if (cleanId && cleanId.includes('gid://shopify/Product/')) {
      cleanId = cleanId.replace('gid://shopify/Product/', 'gid://shopify/ProductVariant/');
    }
    
    // Si por algún motivo el ID es un número limpio sin prefijo de Shopify, le añadimos el de variante
    if (cleanId && !cleanId.startsWith('gid://')) {
      cleanId = `gid://shopify/ProductVariant/${cleanId}`;
    }

    return {
      merchandiseId: cleanId, 
      quantity: item.quantity
    };
  });

  console.log("Datos limpios que enviamos a la API de Shopify:", JSON.stringify(lines, null, 2));

  const query = `
    mutation cartCreate($input: CartInput) {
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

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': shopifyConfig.publicAccessToken
    },
    body: JSON.stringify({
      query,
      variables: {
        input: {
          lines
        }
      }
    })
  });

  const result = await response.json();
  console.log("Respuesta del servidor de Shopify:", JSON.stringify(result, null, 2));

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  if (result.data?.cartCreate?.userErrors?.length > 0) {
    throw new Error(result.data.cartCreate.userErrors[0].message);
  }

  return result.data.cartCreate.cart.checkoutUrl;
}