import React, { useState } from 'react';
import InputBox from '../components/InputBox';
import ScriptDisplay from '../components/ScriptDisplay';
import styled from 'styled-components';
import axios from 'axios';
import usePersistedState from '../hooks/usePersistedState';
import { STORAGE_KEYS } from '../constants/storageKeys';

// API URL 환경변수
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const Container = styled.div`
    max-width: 800px;
    margin: 2em auto;
    padding: 2em;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 10;
    min-height: 100vh;
`;

const Title = styled.h1`
    text-align: center;
    margin-top: 0.65em;
    margin-bottom: 0.5em;
    color: #fff;
`;

const Subtitle = styled.h3`
    text-align: center;
    margin-bottom: 1.5em;
    color: #ffe100;
    font-size: 1.2em;
    font-weight: normal;
`;

const Description = styled.p`
    color: #ddd;
    font-size: 0.9em;
    line-height: 1.6;
    margin: 0 0 1.5em 0;
    padding: 1em;
    background-color: rgba(255, 255, 255, 0.05);
    border-left: 3px solid #ffe100;
    border-radius: 4px;
`;

const GroupContainer = styled.div`
    margin-bottom: 1.5em;
    padding: 1em;
    padding-top: 2em;
    padding-bottom: 0.01em;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2em;
`;

const StyledButton = styled.button`
    background-color: #ffe100;
    color: black;
    border: none;
    padding: 0.75em 1.5em;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.1s ease-in;
    margin: 0 1em;

    &:hover {
        background-color: #FFEC4F;
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 8px rgba(255, 205, 0, 0.6);
    }
`;

/**
 * Essential Basic Course - Lab11-2-2
 * Object Storage 실습용 env.sh 생성 페이지
 * (AWS S3 호환 API 자격 증명을 자동 발급하는 스크립트)
 */
const ObjectStorageEnv: React.FC = () => {
    const [accessKey, setAccessKey] = usePersistedState(STORAGE_KEYS.KAKAO_ACCESS_KEY, '');
    const [secretKey, setSecretKey] = usePersistedState(STORAGE_KEYS.KAKAO_SECRET_KEY, '');
    const [userId, setUserId] = useState('');
    const [script, setScript] = useState('');
    const [loadingButton, setLoadingButton] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // 액세스 키 / 시크릿 키로 IAM 토큰을 발급받아 사용자 UUID 자동 조회
    const fetchUserId = async () => {
        setLoadingButton('fetchUserId');
        try {
            const response = await axios.post(`${API_BASE_URL}/get-user-id`, {
                access_key_id: accessKey,
                access_key_secret: secretKey,
            });
            const fetchedUserId = response.data.user_id;
            if (fetchedUserId) {
                setUserId(fetchedUserId);
            } else {
                alert('사용자 ID를 조회하지 못했습니다. 액세스 키와 시크릿 키를 확인해주세요.');
            }
        } catch (error) {
            console.error('API 호출 오류:', error);
            alert('사용자 ID 조회 중 오류가 발생했습니다. 액세스 키와 시크릿 키를 확인해주세요.');
        } finally {
            setLoadingButton(null);
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        let isValid = true;

        // 액세스 키 유효성 검사
        if (accessKey.length < 32) {
            isValid = false;
            newErrors.accessKey = '액세스 키는 최소 32자리여야 합니다.';
        } else if (!/^[a-z0-9]+$/.test(accessKey)) {
            isValid = false;
            newErrors.accessKey = '액세스 키는 소문자와 숫자로만 구성되어야 합니다.';
        }

        // 비밀 액세스 키 유효성 검사
        if (secretKey.length < 64) {
            isValid = false;
            newErrors.secretKey = '비밀 액세스 키는 최소 64자리여야 합니다.';
        } else if (!/^[a-z0-9]+$/.test(secretKey)) {
            isValid = false;
            newErrors.secretKey = '비밀 액세스 키는 소문자와 숫자로만 구성되어야 합니다.';
        }

        // 사용자 ID(UUID) 유효성 검사 - kakaocloud 사용자 ID는 32자리 hex
        if (!/^[a-f0-9]{32}$/.test(userId)) {
            isValid = false;
            newErrors.userId = '사용자 ID는 32자리 소문자 영문(a-f)+숫자 형식이어야 합니다.';
        }

        setErrors(newErrors);
        return isValid;
    };

    const generateScript = async () => {
        if (!validateForm()) {
            alert('각 필드의 유효성을 체크해주세요.');
            return;
        }

        // Lab11.md 의 lab11-2-2 스크립트와 동일 (placeholder 만 치환)
        const newScript = `cat << 'EOF' > env.sh
export ACCESS_KEY="${accessKey}"
export ACCESS_SECRET_KEY="${secretKey}"
export USER_ID="${userId}"
export AWS_DEFAULT_REGION="kr-central-2"
export AWS_ENDPOINT_URL="https://objectstorage.kr-central-2.kakaocloud.com"
export AWS_S3_FORCE_PATH_STYLE=true

export TOKEN=$(curl -s -X POST -i https://iam.kakaocloud.com/identity/v3/auth/tokens -H "Content-Type: application/json" -d \\
'{
    "auth": {
        "identity": {
            "methods": [
                "application_credential"
            ],
            "application_credential": {
                "id": "'\${ACCESS_KEY}'",
                "secret": "'\${ACCESS_SECRET_KEY}'"
            }
        }
    }
}' | grep -i X-Subject-Token | awk -v RS='\\r\\n' '{print $2}')

if [ -z "$TOKEN" ]; then
        echo "TOKEN is null..."
fi

export PROJECT_ID=$(curl -s -X POST https://iam.kakaocloud.com/identity/v3/auth/tokens -H "Content-Type: application/json" -d \\
'{
    "auth": {
        "identity": {
            "methods": [
                "application_credential"
            ],
            "application_credential": {
                "id": "'\${ACCESS_KEY}'",
                "secret": "'\${ACCESS_SECRET_KEY}'"
            }
        }
    }
}' | jq -r ".token.project.id")

if [ -z "$PROJECT_ID" ]; then
        echo "PROJECT_ID is null..."
fi

export CREDENTIALS=$(curl -s -X POST https://iam.kakaocloud.com/identity/v3/users/\${USER_ID}/credentials/OS-EC2 \\
-H "Content-Type: application/json" \\
-H "X-Auth-Token: \${TOKEN}" -d \\
'{
    "tenant_id": "'\${PROJECT_ID}'"
}')

export AWS_ACCESS_KEY_ID=$(echo "$CREDENTIALS" | jq -r '.credential.access')
export AWS_SECRET_ACCESS_KEY=$(echo "$CREDENTIALS" | jq -r '.credential.secret')

if [ -z "$AWS_ACCESS_KEY_ID" ] || [ "$AWS_ACCESS_KEY_ID" == "null" ]; then
        echo "AWS_ACCESS_KEY_ID is null..."
fi
if [ -z "$AWS_SECRET_ACCESS_KEY" ] || [ "$AWS_SECRET_ACCESS_KEY" == "null" ]; then
        echo "AWS_SECRET_ACCESS_KEY is null..."
fi

{
echo ACCESS_KEY=$ACCESS_KEY
echo ACCESS_SECRET_KEY=$ACCESS_SECRET_KEY
echo TOKEN=$TOKEN
echo PROJECT_ID=$PROJECT_ID
echo AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
echo AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
echo AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION
echo AWS_ENDPOINT_URL=$AWS_ENDPOINT_URL
} | tee output.txt

EOF`;

        setScript(newScript);

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(newScript);
                alert('스크립트가 생성되고 클립보드에 복사되었습니다.');
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = newScript;
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                    alert('스크립트가 생성되고 클립보드에 복사되었습니다.');
                } catch (err) {
                    console.error('클립보드에 복사하는 동안 오류가 발생했습니다:', err);
                }
                document.body.removeChild(textArea);
            }
        } catch (err) {
            console.error('클립보드에 복사하는 동안 오류가 발생했습니다:', err);
        }
    };

    return (
        <Container>
            <Title>Object Storage env.sh 생성</Title>
            <Subtitle>kakaocloud 교육용</Subtitle>
            <GroupContainer>
                <InputBox
                    label="1. 사용자 액세스 키"
                    placeholder="직접 입력"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    error={errors.accessKey}
                />
                <InputBox
                    label="2. 사용자 시크릿 키"
                    placeholder="직접 입력"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    error={errors.secretKey}
                />
                <InputBox
                    label="3. 사용자 ID (UUID)"
                    placeholder="조회 버튼 클릭 시 자동 입력 (콘솔 > 계정 정보 > 사용자 UUID 에서 직접 입력도 가능)"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    showApiButton
                    onApiClick={fetchUserId}
                    isLoading={loadingButton === 'fetchUserId'}
                    error={errors.userId}
                />
            </GroupContainer>

            <ScriptDisplay script={script} />

            <ButtonContainer>
                <StyledButton onClick={generateScript}>
                    스크립트 생성 및 복사
                </StyledButton>
            </ButtonContainer>
        </Container>
    );
};

export default ObjectStorageEnv;
