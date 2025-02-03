import React from 'react';
import { Tabs } from 'antd';
import './tabs-list.scss';

const TabsList = ({ activeKey, onTabChange }) => {
    return (
        <Tabs
            className={'tabs-list'}
            activeKey={activeKey}
            onChange={onTabChange}
            items={[
                {
                    label: 'Search',
                    key: 'tab1',
                },
                {
                    label: 'Rated',
                    key: 'tab2',
                },
            ]}
        />
    );
};

export default TabsList;
