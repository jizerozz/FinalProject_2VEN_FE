import { css } from '@emotion/react';

import theme from '@/styles/theme';
import { formatRate } from '@/utils/statistics';

interface RateItemProps {
  title: string;
  value: number;
  isWinRate?: boolean;
}

const RateItem = ({ title, value, isWinRate }: RateItemProps) => (
  <div css={rateAreaStyle}>
    <div css={titleStyle}>{title}</div>
    <div css={isWinRate ? winRateStyle : rateContentStyle}>
      {formatRate(value)}
      {title !== 'Profit Factor' && '%'}
    </div>
  </div>
);

const rateAreaStyle = css`
  color: ${theme.colors.gray[800]};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
`;

const titleStyle = css`
  ${theme.textStyle.captions.caption1};
`;

const winRateStyle = css`
  margin-top: 10px;
  ${theme.textStyle.subtitles.subtitle1};
  color: ${theme.colors.teal[700]};
`;

const rateContentStyle = css`
  margin-top: 10px;
  ${theme.textStyle.subtitles.subtitle1};
`;

export default RateItem;
