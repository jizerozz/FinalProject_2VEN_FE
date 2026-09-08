import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import Avatar from '@/components/common/Avatar';
import { ROUTES } from '@/constants/routes';
import theme from '@/styles/theme';

interface TitleProps {
  strategyTitle?: string;
  memberId?: string;
  nickname?: string;
  profilePath?: string;
  date?: string;
  followersCount?: number;
  minInvestmentAmount?: string;
  endDate?: string;
}

const StrategyTitleSection = ({
  strategyTitle,
  memberId,
  nickname,
  profilePath,
  date,
  followersCount,
  minInvestmentAmount,
  endDate,
}: TitleProps) => {
  const navigate = useNavigate();

  const handleMoveProfile = (memberId: string) => {
    navigate(`${ROUTES.TRADER.PROFILE(memberId)}`);
  };

  const InfoSection = ({ title, data }: { title: string; data?: number | string }) => (
    <div css={authorInfoStyle}>
      <div css={followerAreaStyle}>
        <div>{title}</div>
        <div css={followerTextStyle}>{data}</div>
      </div>
    </div>
  );

  return (
    <div css={containerStyle}>
      <div css={titleAreaStyle}>
        <div css={infoAreaStyle}>
          <div css={titleStyle}>{strategyTitle}</div>
          <span css={postDateStyle}>작성일자 {date}</span>
          <div css={infoSectionStyle}>
            <div css={authorInfoStyle}>
              <button onClick={() => handleMoveProfile(memberId || '')} css={authorDetailsStyle}>
                <Avatar src={profilePath} alt='트레이더 프로필' size={80} />
                <div css={followerAreaStyle}>
                  <div css={traderTextStyle}>트레이더</div>
                  <div css={followerTextStyle}>{nickname}</div>
                </div>
              </button>
            </div>
            <InfoSection title={'팔로워'} data={followersCount} />
            <InfoSection title={'최소운용가능금액'} data={minInvestmentAmount} />
            <InfoSection title={'최종손익입력날짜'} data={endDate} />
          </div>
        </div>
      </div>
    </div>
  );
};

const containerStyle = css`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 16px;
  align-self: stretch;
`;

const titleAreaStyle = css`
  align-items: flex-start;
  gap: 16px;
`;

const infoAreaStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const infoSectionStyle = css`
  display: flex;
  width: 100%;
  gap: 16px;
`;

const titleStyle = css`
  ${theme.textStyle.headings.h3};
`;

const traderTextStyle = css`
  text-align: left;
`;

const authorInfoStyle = css`
  display: flex;
  border: 1px solid ${theme.colors.gray[200]};
  padding: 24px;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  justify-content: flex-start;
  height: 104px;
`;

const authorDetailsStyle = css`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
  background: none;
  border: 0;
  cursor: pointer;
  outline: none;
`;

const postDateStyle = css`
  display: flex;
  flex-direction: column;
  margin: 16px 0 24px 0;
  color: ${theme.colors.gray[400]};
  ${theme.textStyle.captions.caption2};
`;

const followerAreaStyle = css`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
  ${theme.textStyle.captions.caption2};
`;

const followerTextStyle = css`
  ${theme.textStyle.subtitles.subtitle3};
  text-align: left;
`;

export default StrategyTitleSection;
