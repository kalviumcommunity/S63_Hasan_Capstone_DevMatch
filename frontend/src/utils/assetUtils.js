/**
 * Utility function to get the correct path for assets
 * This helps ensure assets work both in development and production environments
 */

export const getAssetPath = (assetPath) => {
  // If the path already starts with http or https, return it as is (for external assets)
  if (assetPath.startsWith('http')) {
    return assetPath;
  }
  
  // For local assets, ensure they have the correct path
  // Remove leading slash if present
  const cleanPath = assetPath.startsWith('/') ? assetPath.substring(1) : assetPath;
  
  // In development, assets are served from the public directory
  // In production, they should be at the root of the build directory
  return import.meta.env.DEV ? `/${cleanPath}` : cleanPath;
};