import { css, SerializedStyles } from '@emotion/react';

import defaultImage from '@/assets/images/default_avatar.png';
import SafeImage from '@/components/common/SafeImage';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt: string;
  size?: string | number;
  customStyle?: SerializedStyles;
}

const Avatar = ({ src, alt, size = 40, customStyle, ...props }: AvatarProps) => (
  <div css={[avatarContainer(size), customStyle]} {...props}>
    <SafeImage src={src} fallbackSrc={defaultImage} alt={alt} css={avatarStyle} />
  </div>
);

const avatarContainer = (size: string | number) => css`
  width: ${typeof size === 'number' ? `${size}px` : size};
  aspect-ratio: 1;
  border-radius: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const avatarStyle = css`
  width: 102%;
  height: 102%;
  object-fit: cover;
`;

export default Avatar;
