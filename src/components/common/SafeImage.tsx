import { ImgHTMLAttributes, useState } from 'react';

import { css } from '@emotion/react';

interface SafeImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
  variant?: 'image' | 'icon';
}

// Remount image state when the source changes, including A → B → A.
const SafeImage = ({ src, fallbackSrc, ...props }: SafeImageProps) => (
  <ImageAttempt
    key={JSON.stringify([src, fallbackSrc])}
    src={src}
    fallbackSrc={fallbackSrc}
    {...props}
  />
);

const ImageAttempt = ({
  src,
  fallbackSrc,
  variant = 'image',
  alt = '',
  onError,
  className,
  style,
  width,
  height,
  ...props
}: SafeImageProps) => {
  const [failed, setFailed] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const usingFallback = !src?.trim() || failed;
  const imageSrc = usingFallback ? fallbackSrc : src;

  if (!imageSrc || (usingFallback && fallbackFailed)) {
    return (
      <span
        role='img'
        aria-label={`${alt ? `${alt}: ` : ''}이미지를 일시적으로 불러올 수 없습니다`}
        title='이미지를 일시적으로 불러올 수 없습니다'
        className={className}
        css={placeholderStyle}
        style={{ width, height, ...style }}
      >
        {variant === 'icon' ? '—' : '이미지를 일시적으로 불러올 수 없습니다'}
      </span>
    );
  }

  return (
    <img
      {...props}
      key={imageSrc}
      src={imageSrc}
      srcSet={usingFallback ? undefined : props.srcSet}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
      onError={(event) => {
        if (usingFallback) setFallbackFailed(true);
        else setFailed(true);
        onError?.(event);
      }}
    />
  );
};

const placeholderStyle = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 16px;
  min-height: 16px;
  max-width: 100%;
  background: #f5f5f5;
  color: #666;
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
  white-space: normal;
`;

export default SafeImage;
