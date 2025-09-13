// Image utility functions

// URL-encoded SVG placeholder for products (clearer camera icon)
export const PRODUCT_PLACEHOLDER = "data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='40' height='40' rx='8' fill='%23F5F5F5'/%3E%3Cpath d='M12 16H28V28H12V16Z' stroke='%23CCCCCC' stroke-width='1.5' fill='none'/%3E%3Ccircle cx='20' cy='22' r='3' stroke='%23CCCCCC' stroke-width='1.5' fill='none'/%3E%3Crect width='4' height='2' rx='1' transform='matrix(1 0 0 1 18 13)' fill='%23CCCCCC'/%3E%3C/svg%3E";

// Emoji fallback for when SVG doesn't render
export const PRODUCT_EMOJI_FALLBACK = "📷";
export const USER_EMOJI_FALLBACK = "👤";

// Base64 encoded SVG placeholder for users/avatars (40x40)
export const USER_PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiNGNUY1RjUiLz4KPHBhdGggZD0iTTIwIDEyQzE3LjIzODYgMTIgMTUgMTQuMjM4NiAxNSAxN0MxNSAxOS43NjE0IDE3LjIzODYgMjIgMjAgMjJDMjIuNzYxNCAyMiAyNSAxOS43NjE0IDI1IDE3QzI1IDE0LjIzODYgMjIuNzYxNCAxMiAyMCAxMloiIGZpbGw9IiNDQ0NDQ0MiLz4KPHBhdGggZD0iTTEyIDMwQzEyIDI2LjY4NjMgMTUuNTgxNyAyNCAxOS41IDI0SDIwLjVDMjQuNDE4MyAyNCAyOCAyNi42ODYzIDI4IDMwQzI4IDMxLjEwNDYgMjcuMTA0NiAzMiAyNiAzMkgxNEMxMi44OTU0IDMyIDEyIDMxLjEwNDYgMTIgMzBaIiBmaWxsPSIjQ0NDQ0NDIi8+Cjwvc3ZnPgo=";

// Base64 encoded SVG placeholder for large images (200x200)
export const LARGE_PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMDAgNjBDODQuMTI2NSA2MCA3MSA3My4xMjY1IDcxIDg5Qzc3IDEwNC44NzQgODQuMTI2NSAxMTggMTAwIDExOEMxMTUuODc0IDExOCAxMjkgMTA0Ljg3NCAxMjkgODlDMTI5IDczLjEyNjUgMTE1Ljg3NCA2MCAxMDAgNjBaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik04NiA4NEMwOC4zMTM3IDg0IDkyIDc5LjY4NjMgOTIgNzRDOTIgNjguMzEzNyA4OC4zMTM3IDY0IDg2IDY0Qzc5LjY4NjMgNjQgNzYgNjguMzEzNyA3NiA3NEM3NiA3OS42ODYzIDc5LjY4NjMgODQgODYgODRaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0xMjggMTA0TDExNiA5Mkw4MCA5NkwxMDQgNzJMNzIgMTEySDE2MEwxMjggMTA0WiIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4K";

/**
 * Handle image loading errors by setting a fallback placeholder
 * @param event - The error event
 * @param placeholderType - Type of placeholder to use
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement>,
  placeholderType: 'product' | 'user' | 'large' = 'product'
) => {
  const placeholders = {
    product: PRODUCT_PLACEHOLDER,
    user: USER_PLACEHOLDER,
    large: LARGE_PLACEHOLDER,
  };
  
  event.currentTarget.src = placeholders[placeholderType];
};

/**
 * Get image source with fallback
 * @param primarySrc - Primary image source
 * @param fallbackSrc - Fallback image source
 * @param placeholderType - Type of placeholder to use as final fallback
 */
export const getImageSrc = (
  primarySrc?: string | null,
  fallbackSrc?: string | null,
  placeholderType: 'product' | 'user' | 'large' = 'product'
): string => {
  if (primarySrc && primarySrc.trim()) return primarySrc;
  if (fallbackSrc && fallbackSrc.trim()) return fallbackSrc;
  
  const placeholders = {
    product: PRODUCT_PLACEHOLDER,
    user: USER_PLACEHOLDER,  
    large: LARGE_PLACEHOLDER,
  };
  
  return placeholders[placeholderType];
};