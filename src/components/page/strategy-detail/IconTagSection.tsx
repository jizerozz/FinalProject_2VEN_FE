import { css } from '@emotion/react';

import StrategyIcon from '@/components/common/StrategyIcon';

interface IconTagSectionProps {
  imgs: string[];
  labels?: (string | undefined)[];
}

const IconTagSection = ({ imgs, labels = [] }: IconTagSectionProps) => (
  <div css={tagAreaStyle}>
    {imgs.map((item, idx) => (
      <div key={idx} css={tagStyle}>
        <StrategyIcon
          src={item}
          label={labels[idx]}
          alt={labels[idx] || '전략 유형 아이콘'}
          css={tagStyle}
        />
      </div>
    ))}
  </div>
);

const tagAreaStyle = css`
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 23px 0;
`;

const tagStyle = css`
  display: flex;
  flex-shrink: 0;
  height: 22px;
  align-items: center;
  justify-content: center;
`;

export default IconTagSection;
