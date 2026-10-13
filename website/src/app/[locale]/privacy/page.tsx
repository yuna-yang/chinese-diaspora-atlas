import MinimalAtlas from '../../../features/minimal/MinimalAtlas';
import type { Locale } from '../../../lib/contracts';
export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <MinimalAtlas locale={locale} initialAbout />;
}
