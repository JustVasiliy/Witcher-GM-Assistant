/**
 * Names for newly added copies of one template inside an encounter.
 * Siblings are the existing instances created from the same template.
 * A lone sibling still carrying the bare template name is renamed so the
 * whole group ends up numbered; siblings the GM renamed are left alone.
 */
export function nextInstanceNames(
  baseName: string,
  siblingNames: string[],
  quantity: number,
): { newNames: string[]; renameBareTo?: string } {
  if (siblingNames.length === 0 && quantity === 1) {
    return { newNames: [baseName] };
  }

  const prefix = `${baseName} `;
  let highest = 0;
  for (const name of siblingNames) {
    if (!name.startsWith(prefix)) continue;
    const suffix = name.slice(prefix.length);
    if (/^\d+$/.test(suffix)) {
      highest = Math.max(highest, Number(suffix));
    }
  }

  let renameBareTo: string | undefined;
  const bareCount = siblingNames.filter((name) => name === baseName).length;
  if (bareCount === 1) {
    highest += 1;
    renameBareTo = `${baseName} ${highest}`;
  }

  const newNames = Array.from(
    { length: quantity },
    (_, index) => `${baseName} ${highest + index + 1}`,
  );

  return renameBareTo ? { newNames, renameBareTo } : { newNames };
}
