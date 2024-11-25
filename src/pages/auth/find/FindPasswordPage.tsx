import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { Link, useNavigate } from 'react-router-dom';

import tickImage from '@/assets/images/tick.svg';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import VerificationInput from '@/components/page/signup/VerificationInput';
import { ROUTES } from '@/constants/routes';
import theme from '@/styles/theme';
import { validateCode, validateEmail } from '@/utils/validation';

const FindPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [resetTimer, setResetTimer] = useState<number>(0); // 타이머 리셋을 위한 상태
  const [isInputDisabled, setIsInputDisabled] = useState(true); // 페이지 로드 시 입력창 비활성화
  const [serverVerificationCode, setServerVerificationCode] = useState<string>(''); // 서버에서 받은 인증번호 저장
  // 인증 요청버튼 클릭했는지 여부 추적하는 NEW 상태
  const [isVerficationRequested, setIsVerificationRequested] = useState(false);

  // verificationCode가 변경될 때마다 실행
  useEffect(() => {
    // 입력값이 비어있다면 에러메시지 제거
    if (!verificationCode) {
      setErrorMessage('');
    }
  }, [verificationCode]);

  const handleEmailVerification = () => {
    // 이메일 입력값 확인
    if (!email) {
      setErrorMessage('이메일을 입력해주세요.');
      return;
    }
    // 이메일 유효성 검사
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setErrorMessage(emailValidation.message);
      return;
    }

    // 이메일 인증 요청 로직
    try {
      // const response = await requestVerificationEmail();
      // setServerVerificationCode(response.verificationCode); // 서버 응답에서 인증번호 저장
      // 테스트용 코드
      setServerVerificationCode('123456'); // 테스트를 위해 하드코딩
      // 인증 요청 성공 시 상태 업데이트
      setIsVerificationRequested(true);
      // 인증번호 요청 성공 시, isVerificationActive를 토글 => 타이머 재시작!
      setResetTimer((prev) => prev + 1); // 타이머 리셋(타이머 시작트리거)
      setIsInputDisabled(false); // 입력창 활성화
      setErrorMessage(''); // 에러 메시지 초기화
      setVerificationCode(''); // 인증코드 입력값 초기화
    } catch (error) {
      setErrorMessage('인증번호 발송에 실패했습니다.');
    }
  };
  const handleCodeVerification = (e: React.FormEvent<HTMLFormElement>) => {
    // 이메일 인증코드 확인
    e.preventDefault();
    const validationResult = validateCode(verificationCode); // 인증번호 유효성 검증

    if (isInputDisabled) {
      setErrorMessage('인증 시간이 만료되었습니다. 다시 시도해주세요.');
      return;
    }

    // 1. 유효성 검사 통과 여부
    // 2. 서버에서 받은 인증번호와 일치 여부
    // 조건을 단계별로 체크
    if (validationResult.isValid) {
      // 6자리 숫자 형식은 맞지만, 서버의 인증번호와 다른 경우
      if (verificationCode !== serverVerificationCode) {
        setErrorMessage('올바른 인증번호가 아닙니다.');
      } else {
        // 모든 조건 충족
        navigate(ROUTES.AUTH.FIND.PASSWORD_RESET);
      }
    } else {
      // 6자리 숫자 형식이 아닌 경우
      setErrorMessage(validationResult.message);
    }
  };

  // 확인버튼 활성화 조건을 검사하는 함수
  const isSubmitButtonDisabled = () =>
    !email || // 이메일이 입력되지 않은 경우
    !isVerficationRequested || // 인증요청을 하지 않은 경우
    !verificationCode || // 인증코드가 입력되지 않은 경우
    isInputDisabled; // 인증시간이 만료된 경우

  return (
    <div css={containerStyle}>
      <h3 css={pageHeadingStyle}>비밀번호 찾기</h3>
      <p css={infoStyle}>
        <img src={tickImage} alt='tick' />
        <span>시스메틱에 가입한 이메일을 정확히 입력해주세요</span>
      </p>

      <div css={emailVerifyContainer}>
        <Input
          type='email'
          inputSize='lg'
          required
          name='email'
          placeholder='1234@naver.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type='button'
          variant='accent'
          size='md'
          width={100}
          onClick={handleEmailVerification} // 인증요청
        >
          인증요청
        </Button>
      </div>

      <form css={formStyle} onSubmit={handleCodeVerification}>
        <VerificationInput
          value={verificationCode}
          onChange={setVerificationCode}
          resetTimer={resetTimer}
          startTimer={isVerficationRequested} // 인증요청이 있을 때만 타이머 시작
          onTimeEnd={() => {
            setIsInputDisabled(true); // 입력창 비활성화
            setIsVerificationRequested(false); // 타이머 종료하면 인증요청상태도 리셋!
            setErrorMessage('인증 시간이 만료되었습니다. 다시 시도해주세요.');
          }}
          isDisabled={isInputDisabled}
        />
        <Button type='submit' width={400} disabled={isSubmitButtonDisabled()}>
          확인
        </Button>
      </form>
      {errorMessage && <p css={messageStyle}>{errorMessage}</p>}
      <ul css={findEmailLinkStyle}>
        <li>이메일이 기억나지 않나요?</li>
        <li>
          <Link to={ROUTES.AUTH.FIND.EMAIL}>이메일 찾기</Link>
        </li>
      </ul>
    </div>
  );
};

const containerStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 400px;
  padding: 160px 0 240px;
  margin: 0 auto;
`;

const pageHeadingStyle = css`
  text-align: center;
  font-size: ${theme.typography.fontSizes.heading.h3};
  line-height: ${theme.typography.lineHeights.md};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: 32px;
`;

const infoStyle = css`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  span {
    color: ${theme.colors.gray[600]};
    font-size: ${theme.typography.fontSizes.caption};
    line-height: ${theme.typography.lineHeights.lg};
    font-weight: ${theme.typography.fontWeight.medium};
  }
`;
const emailVerifyContainer = css`
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  width: 400px;
  margin-bottom: 12px;

  input {
    width: 288px;
  }
`;
const formStyle = css`
  input {
    width: 400px;
  }
  button {
    margin-top: 24px;
  }
`;

const findEmailLinkStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 400px;
  margin-top: 32px;

  li {
    position: relative;
    color: ${theme.colors.gray[900]};
    font-size: ${theme.typography.fontSizes.body};
    line-height: ${theme.typography.lineHeights.lg};
    font-weight: ${theme.typography.fontWeight.medium};
    padding: 0 17px;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      right: 0;
      width: 1px;
      height: 16px;
      transform: translateY(-50%);
      background-color: ${theme.colors.gray[300]};
    }
    &:last-child {
      font-weight: ${theme.typography.fontWeight.bold};
    }
    &:last-child::after {
      display: none;
    }
  }
`;

const messageStyle = css`
  margin-top: 16px;
  text-align: center;
  color: ${theme.colors.main.alert};
  font-size: ${theme.typography.fontSizes.caption};
  line-height: ${theme.typography.lineHeights.sm};
`;
export default FindPasswordPage;