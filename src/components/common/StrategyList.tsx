import { css } from '@emotion/react';
import { AiOutlineMore } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

import DropdownMenu from '@/components/common/DropdownMenu';
import LineChart from '@/components/common/LineChart';
import StrategyIcon from '@/components/common/StrategyIcon';
import { ROUTES } from '@/constants/routes';
import { useDropdown } from '@/hooks/useDropdown';
import theme from '@/styles/theme';
import { StrategyListData } from '@/types/strategy';

interface DropdownAction {
  label: string;
  onClick: (strategyId: number) => void;
  handleClick?: () => void;
}

interface StrategyListProps {
  strategies: StrategyListData[];
  showRank?: boolean;
  startRank?: number;
  containerWidth?: string;
  gridTemplate?: string;
  moreMenu?: boolean;
  dropdownActions?: (strategyId: number) => DropdownAction[];
  noDataDesc?: string;
}

const StrategyList = ({
  strategies,
  showRank = false,
  startRank = 1,
  containerWidth = theme.layout.width.content,
  gridTemplate = '64px 278px 278px 160px 160px 100px 100px',
  moreMenu = false,
  dropdownActions = () => [],
  noDataDesc = '전략이 없습니다.',
}: StrategyListProps) => {
  const navigate = useNavigate();

  const { activeDropdown, toggleDropdown } = useDropdown();

  const onClickStrategyList = (strategyId: string) => {
    navigate(ROUTES.STRATEGY.DETAIL(strategyId));
    window.scrollTo(0, 0);
  };

  return (
    <div css={containerStyle(containerWidth)}>
      <div css={headerStyle(gridTemplate)}>
        {showRank && <div>순위</div>}
        <div>전략명</div>
        <div>분석 그래프</div>
        <div>수익률</div>
        <div>MDD</div>
        <div>SM Score</div>
        <div>팔로워</div>
        {moreMenu && (
          <div>
            <AiOutlineMore size={20} />
          </div>
        )}
      </div>
      {strategies.length === 0 ? (
        <div css={noDataStyle}>{noDataDesc}</div>
      ) : (
        <>
          {strategies.map((strategy, idx) => (
            <div
              role='button'
              tabIndex={0}
              onClick={() => onClickStrategyList(String(strategy.strategyId))}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClickStrategyList(String(strategy.strategyId));
                }
              }}
              css={rowStyle(gridTemplate)}
              key={strategy.strategyId}
            >
              {showRank && <div css={rankStyle}>{startRank + idx}</div>}
              <div css={strategyTitleContainerStyle}>
                <div css={strategyTitleStyle}>{strategy.strategyTitle}</div>
                <div css={iconStyle}>
                  <StrategyIcon src={strategy.tradingTypeIcon} alt='매매유형' height={22} />
                  <StrategyIcon src={strategy.tradingCycleIcon} alt='주기' height={22} />
                  {strategy.investmentAssetClassesIcons?.slice(0, 2).map((icon) => (
                    <StrategyIcon key={icon} src={icon} alt='종목 아이콘' height={22} />
                  ))}
                  <div css={countStyle}>
                    {strategy.investmentAssetClassesIcons.length > 2 && (
                      <span css={countStyle}>
                        +{strategy.investmentAssetClassesIcons.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div css={graphStyle}>
                {strategy.cumulativeProfitLossRateList.length > 2 ? (
                  <LineChart
                    data={strategy.cumulativeProfitLossRateList}
                    size='sm'
                    colorTheme='primary'
                  />
                ) : (
                  '-'
                )}
              </div>
              <div css={yieldStyle}>
                {strategy.cumulativeProfitLossRate !== undefined ? (
                  <>
                    <div>
                      <span>누적</span>
                      {strategy.cumulativeProfitLossRate}%
                    </div>
                    <div>
                      <span>최근 1년</span>
                      {strategy.recentOneYearReturn}%
                    </div>
                  </>
                ) : (
                  '-'
                )}
              </div>
              <div css={mddStyle(strategy.mdd ?? 0)}>
                {strategy.mdd !== undefined
                  ? strategy.mdd > 0
                    ? `+${strategy.mdd.toLocaleString()}`
                    : strategy.mdd.toLocaleString()
                  : '-'}
              </div>
              <div>{strategy.smScore !== undefined ? strategy.smScore : '-'}</div>
              <div>{strategy.followersCount}</div>
              {moreMenu && (
                <DropdownMenu
                  isActive={activeDropdown === strategy.strategyId}
                  toggleDropdown={() => toggleDropdown(strategy.strategyId)}
                  actions={dropdownActions?.(strategy.strategyId).map((action) => ({
                    label: action.label,
                    handleClick: () => action.onClick(strategy.strategyId),
                  }))}
                />
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

const containerStyle = (width: string) => css`
  display: flex;
  flex-direction: column;
  width: ${width};
  margin: 0 auto;
`;

const rowStyle = (gridTemplate: string) => css`
  display: grid;
  grid-template-columns: ${gridTemplate};
  align-items: center;
  min-height: 140px;
  padding: 16px 0;
  box-sizing: border-box;
  background: ${theme.colors.main.white};
  color: ${theme.colors.gray[900]};
  border-bottom: 1px solid ${theme.colors.gray[300]};
  text-align: center;
  line-height: ${theme.typography.lineHeights.lg};
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.teal[50]};
  }
`;

const headerStyle = (gridTemplate: string) => css`
  ${rowStyle(gridTemplate)};
  height: 56px;
  min-height: 56px;
  padding: 0;
  background-color: ${theme.colors.gray[100]};
  color: ${theme.colors.gray[700]};
  border-bottom: 1px solid ${theme.colors.gray[500]};
  font-weight: ${theme.typography.fontWeight.bold};
  cursor: default;

  &:hover {
    background-color: ${theme.colors.gray[100]};
  }
`;

const rankStyle = css`
  height: 58px;
`;

const strategyTitleContainerStyle = css`
  padding: 0 24px;
`;

const strategyTitleStyle = css`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  margin-bottom: 12px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const iconStyle = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  min-height: 22px;
`;

const countStyle = css`
  margin-left: 4px;
  color: ${theme.colors.gray[400]};
  font-size: ${theme.typography.fontSizes.caption};
`;

const graphStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const yieldStyle = css`
  margin: 0 auto;
  text-align: right;
  font-weight: ${theme.typography.fontWeight.regular};
  line-height: ${theme.typography.lineHeights.lg};

  span {
    color: ${theme.colors.gray[400]};
    margin-right: 4px;
  }
`;

const mddStyle = (mdd: string | number | undefined) => css`
  color: ${
    (mdd as number) === 0 || mdd === '-' || mdd === undefined
      ? theme.colors.gray[900]
      : (mdd as number) < 0
        ? theme.colors.main.blue
        : theme.colors.main.red
  };
`;

const noDataStyle = css`
  display: flex;
  height: 500px;
  justify-content: center;
  align-items: center;
  color: ${theme.colors.gray[500]};

  font-size: ${theme.typography.fontSizes.subtitle.lg};
`;

export default StrategyList;
