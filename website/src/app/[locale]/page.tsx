import Atlas from '../../features/atlas/Atlas';
import Shell from '../../components/Shell';
import type { Locale } from '../../lib/contracts';
export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <Shell locale={locale}>
      <Atlas locale={locale} />
    </Shell>
  );
}
