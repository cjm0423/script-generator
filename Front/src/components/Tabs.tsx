import React, { useState } from 'react';
import styled from 'styled-components';

// Props 인터페이스 정의
interface Tab {
    id: string;
    label: string;
    content: React.ReactElement;
}

// 탭 그룹(시리즈) 정의 - 그룹 제목 아래에 탭들이 묶여서 표시됨
export interface TabGroup {
    id: string;
    title: string;
    tabs: Tab[];
}

interface TabsProps {
    groups: TabGroup[];
    defaultTab: string;
}

const Container = styled.div`
    width: 100%;
    min-height: 100vh;
`;

const TabsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-end;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 1em 0 0 0; /* 하단 패딩 제거 */
    position: relative;
    flex-wrap: wrap;
    gap: 0.5em;
    
    /* 하단 보더를 pseudo-element로 처리 */
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: #ffe100;
        z-index: 1;
    }
`;

const GroupContainer = styled.div<{ $isActive: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.4em 0.6em 0 0.6em;
    border-radius: 8px 8px 0 0;
    background-color: ${props => props.$isActive ? 'rgba(255, 225, 0, 0.08)' : 'transparent'};
    border: 1px solid ${props => props.$isActive ? 'rgba(255, 225, 0, 0.35)' : 'rgba(255, 255, 255, 0.15)'};
    border-bottom: none;
`;

const GroupTitle = styled.div<{ $isActive: boolean }>`
    color: ${props => props.$isActive ? '#ffe100' : 'rgba(255, 255, 255, 0.6)'};
    font-size: 0.75em;
    font-weight: bold;
    letter-spacing: 0.05em;
    margin-bottom: 0.4em;
    white-space: nowrap;
    text-transform: uppercase;
`;

const GroupTabs = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`;

const TabButton = styled.button<{ $isActive: boolean }>`
    background-color: ${props => props.$isActive ? '#ffe100' : 'transparent'};
    color: ${props => props.$isActive ? '#000' : '#fff'};
    border: none;
    padding: 1em 1.5em;
    cursor: pointer;
    font-size: 0.9em;
    border-radius: 8px 8px 0 0;
    margin: 0 0.1em;
    white-space: nowrap;
    position: relative;
    z-index: 2; /* 하단 보더 위에 위치 */
    
    /* 활성 탭의 하단을 콘텐츠와 연결 */
    ${props => props.$isActive && `
        margin-bottom: -2px; /* 하단 보더를 덮음 */
        border-bottom: 2px solid #ffe100; /* 자신의 색상과 동일한 보더 */
    `}
    
    /* 모든 애니메이션 효과 제거 */
    transition: none;
    
    /* hover 효과 추가 (자연스러운 피드백) */
    &:hover {
        background-color: ${props => props.$isActive ? '#ffe100' : 'rgba(255, 225, 0, 0.1)'};
        color: ${props => props.$isActive ? '#000' : '#fff'};
    }
    
    @media (max-width: 768px) {
        font-size: 0.8em;
        padding: 0.8em 1.2em;
    }
`;

const TabContent = styled.div`
    min-height: calc(100vh - 120px);
    background-color: rgba(255, 255, 255, 0.05); /* 콘텐츠 영역 구분 */
    border-radius: 0 0 8px 8px; /* 하단 모서리 둥글게 */
`;

const Tabs: React.FC<TabsProps> = ({ groups, defaultTab }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const allTabs = groups.flatMap(group => group.tabs);

    const renderContent = () => {
        const currentTab = allTabs.find(tab => tab.id === activeTab);
        return currentTab ? currentTab.content : allTabs[0].content;
    };

    return (
        <Container>
            <TabsContainer>
                {groups.map(group => {
                    const isGroupActive = group.tabs.some(tab => tab.id === activeTab);
                    return (
                        <GroupContainer key={group.id} $isActive={isGroupActive}>
                            <GroupTitle $isActive={isGroupActive}>{group.title}</GroupTitle>
                            <GroupTabs>
                                {group.tabs.map(tab => (
                                    <TabButton 
                                        key={tab.id}
                                        $isActive={activeTab === tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        {tab.label}
                                    </TabButton>
                                ))}
                            </GroupTabs>
                        </GroupContainer>
                    );
                })}
            </TabsContainer>
            <TabContent>
                {renderContent()}
            </TabContent>
        </Container>
    );
};

export default Tabs;
