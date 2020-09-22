/* eslint-disable import/prefer-default-export */
export function capitalizeFirstLetterOfCapitalized(string) {
  const str = string.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
}
