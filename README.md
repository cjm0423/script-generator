# Script Generator

kakaocloud 교육 실습용 스크립트 생성 사이트 (http://210.109.83.141/)

## 구조

```
ScriptGenerator/
├── Back/                 # FastAPI 백엔드 (:8000)
│   ├── main.py           # kakaocloud IAM / KE / MySQL / Kafka 조회 API
│   ├── requirements.txt
│   └── Dockerfile
└── Front/                # React(CRA) + TypeScript 프론트 (:80, nginx)
    ├── .env              # REACT_APP_API_BASE_URL (백엔드 주소)
    ├── Dockerfile
    ├── nginx.conf
    └── src/
        ├── App.tsx                   # 탭 시리즈(그룹) 정의
        ├── components/Tabs.tsx       # 그룹 탭 UI
        └── pages/
            ├── ObjectStorageEnv.tsx  # 1. Essential Basic Course - Lab11-2-2 env.sh
            ├── MainPage.tsx          # 2. Advanced Course - Bastion VM
            ├── DataStreamVM.tsx      # 3. Data Analytics
            ├── TrafficGeneratorVM.tsx
            ├── ApiServerVM.tsx
            ├── S3SinkConnectorVM.tsx
            └── HadoopSetting.tsx
```

## 탭 시리즈

| 시리즈 | 탭 | 교재 |
|---|---|---|
| 1. Essential Basic Course | Object Storage env.sh 생성 | EssentialBasicCourse/PracticalTextbook/Lab11.md (lab11-2-2) |
| 2. Advanced Course | Bastion VM 스크립트 생성 | AdvancedCourse |
| 3. Data Analytics | DataStream VM / Traffic Generator VM / API Server VM / S3 Sink Connector VM / Hadoop Configuration | DataAnalyticsCourse |

## 백엔드 엔드포인트 (Back/main.py)

| 엔드포인트 | 용도 |
|---|---|
| `POST /get-user-id` | 액세스 키/시크릿 키 → 사용자 UUID, 프로젝트 ID/이름 (Lab11-2-2) |
| `POST /get-token-details` | IAM 토큰 및 사용자/프로젝트 상세 |
| `POST /get-project-name` | 프로젝트 이름 |
| `POST /get-clusters`, `/get-kubeconfig` | KE 클러스터 목록 / kubeconfig |
| `POST /get-instance-groups`, `/get-instance-endpoints` | MySQL 인스턴스 그룹 / Primary·Standby 엔드포인트 |
| `POST /get-kafka-clusters`, `/get-kafka-bootstrap-servers(-by-id)` | Kafka 클러스터 / bootstrap servers |

## 배포 (VM 1대에 프론트 + 백엔드 함께)

사전 준비: Ubuntu 22.04, 보안 그룹 인바운드 22/80/8000, 공인 IP 할당

```bash
# 1. Docker, git 설치 (최초 1회)
sudo apt-get update && sudo apt-get install -y git docker.io
sudo usermod -aG docker ubuntu && newgrp docker

# 2. 클론 및 백엔드 주소 설정 (VM 공인 IP로)
git clone https://github.com/<아이디>/script-generator.git
cd script-generator
echo "REACT_APP_API_BASE_URL=http://<VM공인IP>:8000" > Front/.env

# 3. 백엔드
docker build -t sg-back ./Back
docker run -d --name sg-back --restart unless-stopped -p 8000:8000 sg-back

# 4. 프론트
docker build -t sg-front ./Front
docker run -d --name sg-front --restart unless-stopped -p 80:80 sg-front
```

## 코드 수정 후 재배포

```bash
cd ~/script-generator && git pull
docker build -t sg-front ./Front && docker rm -f sg-front && docker run -d --name sg-front --restart unless-stopped -p 80:80 sg-front
# 백엔드 변경 시
docker build -t sg-back ./Back && docker rm -f sg-back && docker run -d --name sg-back --restart unless-stopped -p 8000:8000 sg-back
```

> `.env`는 빌드 시점에 번들에 포함되므로, 주소를 바꾸면 반드시 프론트를 다시 빌드해야 함.

로컬 개발: `cd Back && uvicorn main:app --reload` / `cd Front && npm install && npm start`
