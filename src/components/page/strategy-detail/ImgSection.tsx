import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { AiOutlineClose } from 'react-icons/ai';

import Checkbox from '@/components/common/Checkbox';
import SafeImage from '@/components/common/SafeImage';
import theme from '@/styles/theme';

interface imgSectionProps {
  img: string;
  name: string;
  id: number;
  isSelected: boolean;
  isSelfed?: boolean;
  onSelect: (id: number) => void;
}

const ImgSection = (props: imgSectionProps) => {
  const { img } = props;
  return <ImageSectionContent key={img} {...props} />;
};

const ImageSectionContent = ({
  img,
  id,
  name,
  isSelected,
  isSelfed,
  onSelect,
}: imgSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const canExpand = Boolean(img?.trim()) && loadedSrc === img;

  useEffect(() => {
    if (!isVisible || !canExpand) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isVisible, canExpand]);

  const handleImgClick = () => {
    if (canExpand) setIsVisible(true);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div css={imgWrapper}>
      <div css={imgContent}>
        <button
          type='button'
          disabled={!canExpand}
          onClick={handleImgClick}
          css={imgSection}
          aria-label={`${name} 확대`}
        >
          <SafeImage
            src={img}
            alt={name}
            css={imgSection}
            onLoad={() => setLoadedSrc(img)}
            onError={() => setLoadedSrc(null)}
          />
        </button>
        {isSelfed ? (
          <Checkbox checked={isSelected ?? false} onChange={() => onSelect(id)}>
            <div>{name}</div>
          </Checkbox>
        ) : (
          <div>{name}</div>
        )}
      </div>
      {isVisible && canExpand && (
        <div css={overlay}>
          <button
            type='button'
            onClick={handleClose}
            css={closeIconStyle}
            aria-label='이미지 확대 닫기'
          >
            <AiOutlineClose size={40} aria-hidden='true' />
          </button>
          <SafeImage src={img} alt={name} css={expandedImg} onError={handleClose} />
        </div>
      )}
    </div>
  );
};

const imgWrapper = css`
  display: flex;
  margin: 20px 0px 40px;
  align-items: center;
`;

const imgSection = css`
  width: 225px;
  height: 163px;
  object-fit: cover;
  cursor: pointer;
  &:disabled {
    cursor: default;
  }
  button&:hover:not(:disabled) {
    border: 1px solid ${theme.colors.main.primary};
  }
`;

const imgContent = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const overlay = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const closeIconStyle = css`
  position: absolute;
  top: 40px;
  right: 50px;
  color: ${theme.colors.main.white};
  align-items: flex-end;
  cursor: pointer;
`;

const expandedImg = css`
  width: 900px;
  height: 700px;
  object-fit: contain;
`;

export default ImgSection;
