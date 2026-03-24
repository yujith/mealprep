export const ORDER_STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", step: 0 },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800", step: 1 },
  preparing: { label: "Preparing", color: "bg-orange-100 text-orange-800", step: 2 },
  out_for_delivery: { label: "Out for Delivery", color: "bg-purple-100 text-purple-800", step: 3 },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800", step: 4 },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", step: -1 },
} as const;

export const PAYMENT_STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmed", color: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
} as const;

export const DELIVERY_METHOD_CONFIG = {
  dad: { label: "Dad (Self)" },
  pickme: { label: "PickMe" },
  uber: { label: "Uber" },
} as const;

export const DIETARY_TAGS = [
  "Keto",
  "Spicy",
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "High Protein",
  "Low Carb",
] as const;
