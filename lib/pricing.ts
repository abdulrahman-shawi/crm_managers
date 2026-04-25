type PriceValue = number | null | undefined;

type ProductPricingShape = {
  pricingCurrency?: string | null;
  sourcePrice?: PriceValue;
  sourcePriceLow?: PriceValue;
  price?: PriceValue;
  priceLow?: PriceValue;
};

export function normalizeExchangeRate(exchangeRate: PriceValue) {
  const value = Number(exchangeRate ?? 1);
  return Number.isFinite(value) && value > 0 ? value : 1;
}

const toSafeNumber = (value: PriceValue, fallback = 0) => {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export function getComputedRetailPrice(product: ProductPricingShape, exchangeRate: PriceValue) {
  const rate = normalizeExchangeRate(exchangeRate);

  if (product.pricingCurrency === "USD") {
    return toSafeNumber(product.sourcePrice, toSafeNumber(product.price)) * rate;
  }

  return toSafeNumber(product.price, toSafeNumber(product.sourcePrice));
}

export function getComputedWholesalePrice(product: ProductPricingShape, exchangeRate: PriceValue) {
  const rate = normalizeExchangeRate(exchangeRate);

  if (product.pricingCurrency === "USD") {
    return toSafeNumber(product.sourcePriceLow, toSafeNumber(product.priceLow)) * rate;
  }

  return toSafeNumber(product.priceLow, toSafeNumber(product.sourcePriceLow));
}

export function applyComputedProductPrices<T extends ProductPricingShape>(product: T, exchangeRate: PriceValue) {
  return {
    ...product,
    price: getComputedRetailPrice(product, exchangeRate),
    priceLow: getComputedWholesalePrice(product, exchangeRate),
  };
}

export function getComputedInvoiceItemTotals(
  item: {
    quantity?: PriceValue;
    discount?: PriceValue;
    unitPrice?: PriceValue;
    product?: ProductPricingShape | null;
  },
  exchangeRate: PriceValue
) {
  const quantity = toSafeNumber(item.quantity, 0);
  const discount = toSafeNumber(item.discount, 0);
  const unitPrice = item.product
    ? getComputedRetailPrice(item.product, exchangeRate)
    : toSafeNumber(item.unitPrice, 0);

  return {
    unitPrice,
    subTotal: unitPrice * quantity - discount,
  };
}