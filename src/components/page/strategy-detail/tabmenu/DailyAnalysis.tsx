import React, { useMemo, useRef, useState } from 'react';

import { css } from '@emotion/react';
import { BiPlus } from 'react-icons/bi';

import AnalysisTable, { AnalysisProps } from '../table/AnalysisTable';
import InputTable, { InputTableProps } from '../table/InputTable';
import TableModal from '../table/TableModal';

import Button from '@/components/common/Button';
import LoadingSpin from '@/components/common/LoadingSpin';
import Pagination from '@/components/common/Pagination';
import ProgressBar from '@/components/common/ProgressBar';
import Toast from '@/components/common/Toast';
import {
  useDeleteAllAnalysis,
  useDeleteAnalysis,
  usePostDailyAnalysis,
  usePutDailyAnalysis,
  useUploadExcel,
} from '@/hooks/mutations/useDailyAnalysis';
import useFetchDailyAnalysis from '@/hooks/queries/useFetchDailyAnalysis';
import usePagination from '@/hooks/usePagination';
import { useAuthStore } from '@/stores/authStore';
import useModalStore from '@/stores/modalStore';
import useTableModalStore from '@/stores/tableModalStore';
import useToastStore from '@/stores/toastStore';
import theme from '@/styles/theme';
import { UserRole } from '@/types/route';
import { DailyAnalysisProps, AnalysisDataProps } from '@/types/strategyDetail';
import { mapToDailyAnalysisData } from '@/utils/mappers';
import { isValidInputNumber, isValidPossibleDate } from '@/utils/statistics';

const DailyAnalysis = ({ strategyId, attributes, userId, role }: AnalysisProps) => {
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedData, setSelectedData] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const { pagination, setPage } = usePagination(1, 8);
  const { showToast, type, message, hideToast, isToastVisible } = useToastStore();
  const { openModal } = useModalStore();
  const { openTableModal } = useTableModalStore();
  const { mutate: postDailyAnalysis, status: postStatus } = usePostDailyAnalysis();
  const { mutate: alldeleteAnalysis, status: alldeleteStatus } = useDeleteAllAnalysis();
  const { mutate: putDailyAnalysis, status: putStatus } = usePutDailyAnalysis();
  const { mutate: deleteDailyAnalysis, status: deleteStatus } = useDeleteAnalysis();
  const { mutate: uploadExcel, status: uploadStatus } = useUploadExcel();
  const { dailyAnalysis, currentPage, pageSize, totalPages, isLoading } = useFetchDailyAnalysis(
    Number(strategyId),
    pagination.currentPage - 1,
    pagination.pageSize,
    role as UserRole
  );
  const isPending =
    postStatus === 'pending' ||
    putStatus === 'pending' ||
    deleteStatus === 'pending' ||
    uploadStatus === 'pending' ||
    alldeleteStatus === 'pending';

  const normalizedData = useMemo(() => {
    if (!dailyAnalysis || !Array.isArray(dailyAnalysis)) return [];
    return dailyAnalysis.map(mapToDailyAnalysisData);
  }, [dailyAnalysis]);

  const handleOpenModal = () => {
    let modalData: InputTableProps[] = [];
    const initialData: InputTableProps[] = Array.from({ length: 5 }, () => ({
      date: '',
      depWdPrice: '',
      dailyProfitLoss: '',
    }));

    openTableModal({
      type: 'insert',
      title: '일간분석 데이터 직접 입력',
      data: (
        <InputTable
          data={initialData}
          onChange={(newData) => {
            modalData = newData;
          }}
        />
      ),
      onAction: () => {
        const result = handleSaveData(modalData);
        return result;
      },
    });
  };

  const handleIsValid = (modalData: InputTableProps[]) =>
    modalData.filter((data) => {
      const isDateValid = !!data.date.trim();
      const isDepWdPriceValid =
        String(data.depWdPrice).trim() !== '' && isValidInputNumber(data.depWdPrice);
      const isDailyProfitLossValid =
        String(data.dailyProfitLoss).trim() !== '' && isValidInputNumber(data.dailyProfitLoss);

      return isDateValid && isDepWdPriceValid && isDailyProfitLossValid;
    });

  const isDuplicatedValue = (modalData: InputTableProps[]) => {
    const existingDates = normalizedData.map((item) => item.date);
    return modalData.filter((data) => existingDates.includes(data.date));
  };

  const handleSaveData = (modalData: InputTableProps[]): boolean => {
    if (!strategyId) return false;

    const emptyData = handleIsValid(modalData);
    const duplicateDates = isDuplicatedValue(modalData);
    const limitDates = isValidPossibleDate(
      modalData.map((item: DailyAnalysisProps) => item.date).filter((date) => date !== '')
    );

    if (limitDates.length > 0) {
      showToast('주말 및 공휴일, 오늘 이후 날짜는 등록할 수 없습니다.', 'error');
      return false;
    }
    if (emptyData.length === 0) {
      showToast('일자, 입출금, 일손익은 필수 입력값입니다.', 'error');
      return false;
    }
    if (duplicateDates.length > 0) {
      showToast(
        `이미 등록된 날짜 입니다. ${duplicateDates.map((d) => d.date).join(', ')}`,
        'error'
      );
      return false;
    }

    const payload: DailyAnalysisProps[] = modalData
      .filter(
        (data) =>
          data.date &&
          data.depWdPrice !== null &&
          data.depWdPrice !== '' &&
          data.dailyProfitLoss !== null &&
          data.dailyProfitLoss !== ''
      )
      .map((data) => ({
        date: data.date,
        depWdPrice: Number(data.depWdPrice),
        dailyProfitLoss: Number(data.dailyProfitLoss),
      }));

    postDailyAnalysis(
      {
        strategyId: Number(strategyId),
        payload,
        authRole: role as UserRole,
      },
      {
        onSuccess: () => {
          showToast('일간분석 등록이 완료되었습니다.');
        },
        onError: (error) => {
          showToast(error.message, 'error');
        },
      }
    );

    modalData = [];
    return true;
  };

  const handleUpdateModal = (rowId: number, data: DailyAnalysisProps) => {
    if (!strategyId) return;
    let updatedData: DailyAnalysisProps | null = null;
    openTableModal({
      type: 'update',
      title: '일간분석 데이터 수정',
      data: (
        <InputTable
          data={[data]}
          onChange={(newData) =>
            (updatedData = {
              date: newData[0].date,
              dailyProfitLoss: Number(newData[0].dailyProfitLoss),
              depWdPrice: Number(newData[0].depWdPrice),
            })
          }
        />
      ),
      onAction: () => {
        if (!updatedData) return false;

        const duplicate = normalizedData
          .filter((item) => item.date !== data.date)
          .map((item) => item.date)
          .includes(updatedData.date);

        const limitDates = isValidPossibleDate(updatedData.date);

        if (
          updatedData.date.trim() === '' ||
          updatedData.depWdPrice === null ||
          updatedData.dailyProfitLoss === null
        ) {
          showToast('일자, 입출금, 일손익은 필수 입력값입니다.', 'error');
          return false;
        }
        if (duplicate) {
          showToast(`이미 등록된 날짜 입니다.`, 'error');
          return false;
        }

        if (limitDates.length > 0) {
          showToast('주말 및 공휴일, 오늘 이후 날짜는 등록할 수 없습니다.', 'error');
          return false;
        }
        putDailyAnalysis(
          {
            strategyId,
            payload: updatedData,
            authRole: role as UserRole,
            dailyDataId: rowId,
          },
          {
            onSuccess: () => {
              showToast('수정이 완료되었습니다.');
            },
            onError: (error) => {
              showToast(error.message, 'error');
            },
          }
        );
        updatedData = null;
        return true;
      },
    });
  };

  const handleSelectChange = (selectedIdx: number[]) => {
    setSelectedData(selectedIdx);
  };

  const handleAllChecked = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    handleSelectChange(
      newSelectAll
        ? dailyAnalysis.map((item: AnalysisDataProps) => item.dailyStrategicStatisticsId)
        : []
    );
  };

  const handleDelete = () => {
    if (!role || !strategyId) return;
    const selectedDailyAnalysis = dailyAnalysis
      .filter((item: AnalysisDataProps) => selectedData.includes(item.dailyStrategicStatisticsId))
      .sort((a: AnalysisDataProps, b: AnalysisDataProps) => a.inputDate.localeCompare(b.inputDate))
      .map((sortData: AnalysisDataProps) => sortData.dailyStrategicStatisticsId);

    if (selectedDailyAnalysis.length > 0) {
      openModal({
        type: 'warning',
        title: '일간분석 삭제',
        desc: `${selectedDailyAnalysis.length}개의 일간 분석 데이터를 삭제하시겠습니까?`,
        onAction: () => {
          deleteDailyAnalysis(
            { strategyId, role, analysisIds: selectedDailyAnalysis },
            {
              onSuccess: () => {
                showToast('삭제가 완료되었습니다.');
              },
              onError: (error) => {
                showToast(error.message, 'error');
              },
            }
          );
          setSelectAll(false);
        },
      });
    } else {
      openModal({
        type: 'warning',
        title: '알림',
        desc: `선택 된 항목이 없습니다.`,
        onAction: () => {},
      });
    }
  };

  const handleAllDelete = () => {
    if (!strategyId) return;
    openModal({
      type: 'warning',
      title: '일간분석 전체 삭제',
      desc: `등록된 모든 일간 분석 데이터를 삭제하시겠습니까?`,
      onAction: () => {
        alldeleteAnalysis(
          { strategyId },
          {
            onSuccess: () => {
              showToast('전체 삭제가 완료되었습니다.');
            },
            onError: (error) => {
              showToast(error.message, 'error');
            },
          }
        );
      },
    });
  };

  const handleTriggerExcel = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    strategyId: number,
    role: UserRole
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      showToast('엑셀 파일을 선택해주세요', 'error');
      return;
    }
    uploadExcel(
      { strategyId: strategyId as number, file, role: role as UserRole },
      {
        onSuccess: () => {
          showToast('업로드가 완료되었습니다.');
        },
        onError: (error) => {
          showToast(error.message, 'error');
          e.target.value = '';
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div css={loadingArea}>
        <LoadingSpin />
      </div>
    );
  }

  return (
    <div css={dailyStyle}>
      {((role === 'ROLE_TRADER' && user?.memberId === userId) ||
        (role === 'ROLE_ADMIN' && user?.authorized)) &&
        dailyAnalysis.length > 0 && (
          <div css={editArea}>
            <div css={addArea}>
              <Button
                variant='secondary'
                size='xs'
                width={116}
                css={buttonStyle}
                onClick={handleOpenModal}
              >
                <BiPlus size={16} />
                직접입력
              </Button>
              <Button
                variant='accent'
                size='xs'
                width={116}
                css={buttonStyle}
                onClick={handleTriggerExcel}
              >
                <BiPlus size={16} />
                엑셀추가
              </Button>
              <input
                type='file'
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept='.xlsx, .xls'
                onChange={(e) => handleFileChange(e, Number(strategyId), role as UserRole)}
              />
            </div>
            <div css={addArea}>
              <Button variant='neutral' size='xs' width={89} onClick={handleDelete}>
                삭제
              </Button>
              <Button variant='neutral' size='xs' width={89} onClick={handleAllDelete}>
                전체삭제
              </Button>
            </div>
          </div>
        )}
      {isPending ? (
        <div css={loadingArea}>
          <div css={loadingText}>작업을 진행중입니다.</div>
          <ProgressBar variant='infinite' progress={100} />
        </div>
      ) : (
        <>
          {' '}
          <AnalysisTable
            strategyId={strategyId}
            attributes={attributes}
            analysis={normalizedData}
            mode={'write'}
            role={role}
            userId={userId}
            selectAll={selectAll}
            selectedItems={selectedData}
            onUpload={handleOpenModal}
            onUploadExcel={handleFileChange}
            onSelectChange={handleSelectChange}
            onSelectAll={handleAllChecked}
            onEdit={handleUpdateModal}
          />
          <div css={PaginationArea}>
            <Pagination
              totalPage={totalPages}
              limit={pageSize}
              page={currentPage + 1}
              setPage={setPage}
            />
          </div>
        </>
      )}

      <TableModal />
      <Toast type={type} message={message} onClose={hideToast} isVisible={isToastVisible} />
    </div>
  );
};

const dailyStyle = css`
  width: 100%;
`;

const loadingArea = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${theme.colors.gray[400]};
  ${theme.textStyle.body.body2};
`;

const loadingText = css`
  display: flex;
  margin-top: 40px;
`;

const addArea = css`
  display: flex;
  gap: 8px;
`;

const editArea = css`
  display: flex;
  justify-content: space-between;
`;

const buttonStyle = css`
  display: flex;
  align-items: center;
  gap: 3px;
`;

const PaginationArea = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin-top: 40px;
`;
export default DailyAnalysis;
