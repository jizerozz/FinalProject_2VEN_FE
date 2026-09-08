import cycleDaySmall from './cycle-day-small.svg';
import cyclePositionSmall from './cycle-position-small.svg';
import domesticCommodityFuturesSmall from './domestic-commodity-futures-small.svg';
import domesticEtfSmall from './domestic-etf-small.svg';
import domesticIndexFuturesSmall from './domestic-index-futures-small.svg';
import domesticIndexOptionsSmall from './domestic-index-options-small.svg';
import domesticStockOptionsSmall from './domestic-stock-options-small.svg';
import domesticStockSmall from './domestic-stock-small.svg';
import fxSmall from './fx-small.svg';
import overseasCommodityFuturesSmall from './overseas-commodity-futures-small.svg';
import overseasEtfSmall from './overseas-etf-small.svg';
import overseasIndexFuturesSmall from './overseas-index-futures-small.svg';
import overseasIndexOptionsSmall from './overseas-index-options-small.svg';
import overseasStockOptionsSmall from './overseas-stock-options-small.svg';
import overseasStockSmall from './overseas-stock-small.svg';
import tradeASmall from './trade-a-small.svg';
import tradeHSmall from './trade-h-small.svg';
import tradeManualSmall from './trade-manual-small.svg';
import tradePSmall from './trade-p-small.svg';

export const strategyBadgeAssets = {
  데이: cycleDaySmall,
  포지션: cyclePositionSmall,
  '국내 상품 선물': domesticCommodityFuturesSmall,
  '국내 ETF': domesticEtfSmall,
  '국내 지수 선물': domesticIndexFuturesSmall,
  '국내 지수 옵션': domesticIndexOptionsSmall,
  '국내 주식 옵션': domesticStockOptionsSmall,
  국내주식: domesticStockSmall,
  'F/X': fxSmall,
  '해외 상품 선물': overseasCommodityFuturesSmall,
  '해외 ETF': overseasEtfSmall,
  '해외 지수 선물': overseasIndexFuturesSmall,
  '해외 지수 옵션': overseasIndexOptionsSmall,
  '해외 주식 옵션': overseasStockOptionsSmall,
  해외주식: overseasStockSmall,
  A: tradeASmall,
  H: tradeHSmall,
  수동: tradeManualSmall,
  P: tradePSmall,
} as const;
