import React from 'react';
import Tabs, { TabGroup } from './components/Tabs';
import ObjectStorageEnv from './pages/ObjectStorageEnv';
import MainPage from './pages/MainPage';
import DataStreamVM from './pages/DataStreamVM';
import TrafficGeneratorVM from './pages/TrafficGeneratorVM';
import ApiServerVM from './pages/ApiServerVM';
import S3SinkConnectorVM from './pages/S3SinkConnectorVM';
import HadoopSetting from './pages/HadoopSetting';
import GlobalStyle from './styles/GlobalStyle';
import { TabProvider } from './contexts/TabContext';

const App: React.FC = () => {
    const groups: TabGroup[] = [
        {
            // 1번 시리즈: Essential Basic Course (Lab11-2-2)
            id: 'essential-basic',
            title: '1. Essential Basic Course',
            tabs: [
                {
                    id: 'object-storage-env',
                    label: 'Object Storage env.sh 생성',
                    content: <ObjectStorageEnv />
                }
            ]
        },
        {
            // 2번 시리즈: Advanced Course - Bastion VM
            id: 'advanced-bastion',
            title: '2. Advanced Course',
            tabs: [
                {
                    id: 'bastion-vm',
                    label: 'Bastion VM 스크립트 생성',
                    content: <MainPage />
                }
            ]
        },
        {
            // 3번 시리즈: 데이터 분석 관련 설정
            id: 'data-analytics',
            title: '3. Data Analytics',
            tabs: [
                {
                    id: 'datastream-vm',
                    label: 'DataStream VM 스크립트 생성',
                    content: <DataStreamVM />
                },
                {
                    id: 'traffic-vm',
                    label: 'Traffic Generator VM 스크립트 생성',
                    content: <TrafficGeneratorVM />
                },
                {
                    id: 'api-server-vm',
                    label: 'API Server VM 스크립트 생성',
                    content: <ApiServerVM />
                },
                {
                    id: 's3-sink-connector-vm',
                    label: 'S3 Sink Connector VM 스크립트 생성',
                    content: <S3SinkConnectorVM />
                },
                {
                    id: 'hadoop-setting',
                    label: 'Hadoop Configuration 생성',
                    content: <HadoopSetting />
                }
            ]
        }
    ];

    return (
        <>
            <GlobalStyle />
            <TabProvider>
                <Tabs groups={groups} defaultTab="object-storage-env" />
            </TabProvider>
        </>
    );
};

export default App;
