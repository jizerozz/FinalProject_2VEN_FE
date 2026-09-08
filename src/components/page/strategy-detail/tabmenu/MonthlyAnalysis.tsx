import { useMemo } from 'react';

import { css } from '@emotion/react';

import AnalysisTable, { AnalysisProps } from '../table/AnalysisTable';

import LoadingSpin from '@/components/common/LoadingSpin';
import Pagination from '@/components/common/Pagination';
import useFetchMonthlyAnalysis from '@/hooks/queries/useFetchMonthlyAnalysis';
import usePagination from '@/hooks/usePagination';
import { UserRole } from '@/types/route';
import { mapToMonthlyAnalysisData } from '@/utils/mappers';

const MonthlyAnalysis = ({ attributes, strategyId, role }: AnalysisProps) => {
  const { pagination, setPage } = usePagination(1, 8);
  const { monthlyAnalysis, currentPage, pageSize, totalPages, isLoading } = useFetchMonthlyAnalysis(
    Number(strategyId),
    pagination.currentPage - 1,
    pagination.pageSize,
    role as UserRole
  );

  const normalizedData = useMemo(() => {
    if (!monthlyAnalysis) return [];
    return monthlyAnalysis.map(mapToMonthlyAnalysisData);
  }, [monthlyAnalysis]);

  if (isLoading) {
    return (
      <div css={loadingArea}>
        <LoadingSpin />
      </div>
    );
  }

  return (
    <div css={monthlyStyle}>
      <AnalysisTable attributes={attributes} analysis={normalizedData} mode='read' />
      <div css={paginationArea}>
        <Pagination
          limit={pageSize}
          page={currentPage + 1}
          totalPage={totalPages}
          setPage={setPage}
        />
      </div>
    </div>
  );
};

const monthlyStyle = css`
  width: 100%;
`;

const loadingArea = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const paginationArea = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin-top: 40px;
`;
export default MonthlyAnalysis;
