import { useState, useEffect } from 'react';

import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import AnalyticsGraph from '@/assets/images/analytics_graph.png';
import futureIcon from '@/assets/images/producttype_futures.png';
import StockIcon from '@/assets/images/producttype_stock.png';
import TradeTypeHIcon from '@/assets/images/tradetype_H.png';
import TradeTypePIcon from '@/assets/images/tradetype_P.png';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loading';
import PageHeader from '@/components/common/PageHeader';
import Pagination from '@/components/common/Pagination';
import Select from '@/components/common/Select';
import StrategyList from '@/components/common/StrategyList';
import useFetchStrategyList from '@/hooks/queries/useFetchStrategyList';
import useFetchStrategyOptionData from '@/hooks/queries/useFetchStrategyOptionData';
import { useAuthStore } from '@/stores/authStore';
import theme from '@/styles/theme';

const desc = [
  {
    text: '투자 성과에 따라 순위가 매겨진 전략들을 비교하여 \n 나에게 맞는 최적의 전략을 선택해보세요!',
  },
];

const StrategyListPage = () => {
  const { strategyData } = useFetchStrategyOptionData();
  const [page, setPage] = useState(1);
  const limit = 30;
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data, isLoading, error } = useFetchStrategyList({
    tradingCycleId: 1,
    investmentAssetClassesId: 2,
    page: page - 1,
    pageSize: limit,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  console.log('전략 목록==========>', data);

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  if (error) return <p>Error fetching strategy list</p>;

  if (!data?.data || data.data.length === 0) {
    return <p>No strategies found</p>;
  }

  return (
    <div>
      <PageHeader title='전략랭킹' desc={desc} descType='center' />
      <div css={strategyListContainerStyle}>
        <div css={filterBarContainerStyle}>
          <div css={totalStyle}>
            Total <span>{data.totalElements}</span>
          </div>
          <div css={optionContainerStyle}>
            <Select
              options={strategyData.products}
              onChange={() => {}}
              defaultLabel='상품유형'
              type='sm'
              width='160px'
            />
            <Select
              options={strategyData.cycles}
              onChange={() => {}}
              defaultLabel='투자주기'
              type='sm'
              width='160px'
            />
            {user?.role === 'ROLE_TRADER' && (
              <Button
                variant='primary'
                size='xs'
                customStyle={css`
                  padding: 20px 32px;
                `}
                onClick={() => navigate('/mypage/trader/strategies/create')}
              >
                전략등록
              </Button>
            )}
          </div>
        </div>
        <div css={listContainerStyle}>
          <StrategyList strategies={data.data} showRank startRank={(page - 1) * limit + 1} />
          <Pagination totalPage={data.totalPages} limit={limit} page={page} setPage={setPage} />
        </div>
      </div>
    </div>
  );
};

const strategyListContainerStyle = css`
  width: ${theme.layout.width.content};
  margin: 0 auto;
  padding: 64px 0 140px 0;
`;

const filterBarContainerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const optionContainerStyle = css`
  display: flex;
  gap: 12px;
`;

const totalStyle = css`
  color: ${theme.colors.gray[700]};
  font-weight: ${theme.typography.fontWeight.regular};
  line-height: ${theme.typography.lineHeights.lg};

  span {
    color: ${theme.colors.main.primary};
  }
`;

const listContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 100px;
`;

export default StrategyListPage;
