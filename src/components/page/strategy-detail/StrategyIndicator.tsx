import { css } from '@emotion/react';

import RateItem from './RateItem';

import theme from '@/styles/theme';

interface IndicatorProps {
  cumulativeProfitLossRate: number;
  maxDrawdownRate: number;
  averageProfitLossRate: number;
  profitFactor: number;
  winRate: number;
}

const StrategyIndicator = ({
  cumulativeProfitLossRate,
  maxDrawdownRate,
  averageProfitLossRate,
  profitFactor,
  winRate,
}: IndicatorProps) => (
  <div css={indicatorWrapperStyle}>
    {!cumulativeProfitLossRate && !maxDrawdownRate && !averageProfitLossRate && !profitFactor ? (
      <div>주요지표 데이터가 없습니다.</div>
    ) : (
      <>
        <RateItem title='누적수익률' value={cumulativeProfitLossRate} />
        <RateItem title='최대자본인하율' value={maxDrawdownRate} />
        <RateItem title='평균손익률' value={averageProfitLossRate} />
        <RateItem title='Profit Factor' value={profitFactor} />
        <RateItem title='승률' value={winRate} isWinRate />
      </>
    )}
  </div>
);

const indicatorWrapperStyle = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${theme.colors.teal[50]};
  padding: 32px;
`;

export default StrategyIndicator;
