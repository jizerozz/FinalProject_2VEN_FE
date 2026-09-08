import { strategyBadgeAssets } from '@/assets/icons/strategy';
import SafeImage from '@/components/common/SafeImage';
import { strategyIconFileLabels } from '@/constants/strategyIconMappings';

type BadgeLabel = keyof typeof strategyBadgeAssets;

interface StrategyIconProps extends React.ComponentProps<typeof SafeImage> {
  label?: string;
}

const legacyLabels: Record<string, string> = {
  ...strategyIconFileLabels,
  'tradetype_A.png': 'A',
  'tradetype_P.png': 'P',
  'tradetype_H.png': 'H',
  'producttype_stock.png': '국내주식',
  'producttype_futures.png': '국내 상품 선물',
};

const normalizeLabel = (label: string) => label.replace(/\s+/g, '').toUpperCase();
const labelLookup = new Map(
  Object.keys(strategyBadgeAssets).map((label) => [normalizeLabel(label), label as BadgeLabel])
);

const labelAliases: Record<string, BadgeLabel> = {
  자동: 'A',
  하이브리드: 'H',
  '반자동(하이브리드)': 'H',
  반자동: 'H',
  '수동(매뉴얼)': '수동',
  매뉴얼: '수동',
  데일리: '데이',
};
Object.entries(labelAliases).forEach(([name, badge]) => {
  labelLookup.set(normalizeLabel(name), badge);
});

// Names take precedence; UUID mappings come from the verified API option response.
const getIconSource = (src: string | null | undefined, label: string | undefined) => {
  const badgeLabel = label ? labelLookup.get(normalizeLabel(label)) : undefined;
  if (badgeLabel) return strategyBadgeAssets[badgeLabel];
  if (!src) return src;
  try {
    const filename = decodeURIComponent(
      new URL(src, 'https://local.invalid').pathname.split('/').pop() ?? ''
    );
    const knownLabel = Object.prototype.hasOwnProperty.call(legacyLabels, filename)
      ? legacyLabels[filename]
      : undefined;
    const resolvedLabel = knownLabel ? labelLookup.get(normalizeLabel(knownLabel)) : undefined;
    return resolvedLabel ? strategyBadgeAssets[resolvedLabel] : src;
  } catch {
    return src;
  }
};

const StrategyIcon = ({ src, label, ...props }: StrategyIconProps) => (
  <SafeImage height={22} {...props} src={getIconSource(src, label)} variant='icon' />
);

export default StrategyIcon;
