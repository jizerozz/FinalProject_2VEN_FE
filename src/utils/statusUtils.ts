import { User } from '@/types/auth';
import { UserRole } from '@/types/route';
import { StrategyDetailProps } from '@/types/strategyDetail';

export const getPostStatus = (isPosted: string): string =>
  isPosted === 'Y' ? '공개' : isPosted === 'N' ? '비공개' : '알 수 없음';

// 관리자
export const isAdmin = (role: UserRole) => role === 'ROLE_ADMIN';

//트레이더
export const isTrader = (role: UserRole) => role === 'ROLE_TRADER';

// 전략 작성자
export const isStrategyOwner = (memberId: string, user: User) => memberId === user.memberId;

// 전략 운용 종료 상태
export const isTerminated = (strategy: StrategyDetailProps) =>
  strategy.strategyStatusCode === 'STRATEGY_OPERATION_TERMINATED';

// 전략 승인 요청 가능 상태 (예. 등록 후 3일 경과)
export const isStrategyApproved = (strategy: StrategyDetailProps) =>
  strategy.requestAvailable === true;
