const heights: { [key: string]: number } = {
  header: 152,
  userHeader: 74,
  nav: 78,
  mobileHeader: 194,
  footer: 427,
};

export function calcLayoutHeight(type: string): number {
  return heights[type] || 148;
}

export function calcLayoutHeightPx(type: string): string {
  return `${calcLayoutHeight(type)}px`;
}
