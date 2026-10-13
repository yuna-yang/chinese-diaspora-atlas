import { notFound } from 'next/navigation';
import { loadDataset } from '../../../../lib/dataset';
import type { Locale } from '../../../../lib/contracts';
import { localizedText } from '../../../../lib/i18n';
import MinimalAtlas from '../../../../features/minimal/MinimalAtlas';

export const dynamicParams = false;
export async function generateStaticParams() {
  const ids = (await loadDataset()).organizations.map((o) => ({ id: o.id }));
  // Next static export requires one parameter even for an empty reviewed collection.
  // This reserved invalid organization ID only builds a not-found result and is pruned.
  return ids.length ? ids : [{ id: '__empty__' }];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  const o = (await loadDataset()).organizations.find((o) => o.id === id);
  return o
    ? {
        title: `${localizedText(o.names, locale).text} 路 Chinese Diaspora Atlas`,
        description: localizedText(o.descriptions, locale).text,
      }
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params,
    dataset = await loadDataset(),
    organization = dataset.organizations.find((o) => o.id === id);
  if (!organization) notFound();
  return <MinimalAtlas locale={locale} initialSelectedId={id} />;
}
