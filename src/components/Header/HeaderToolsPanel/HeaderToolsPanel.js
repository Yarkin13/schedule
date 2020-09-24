import {
  ExportOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  MoreOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {Button, Dropdown, Menu, Space, Tooltip} from 'antd';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {switchVisibilityHiddenEvents} from '../../../actions';
import NewEventButton from '../../NewEventButton';
import TimeZoneSelect from '../../TimeZoneSelect';
import ScheduleViewSelect from '../ScheduleViewSelect';
import ExportToGoogle from '../ExportToGoogle';
import './headerToolsPanel.css';

const HeaderToolsPanel = () => {
  const dispatch = useDispatch();
  const {visibilityHiddenEvents} = useSelector(state => state.app);
  const handlerVisibilityOfHiddenEvents = () => {
    dispatch(switchVisibilityHiddenEvents());
    localStorage.setItem('visibilityHiddenEvents', visibilityHiddenEvents);
  };

  const moreMenu = (
    <Menu className="moreMenu">
      <Menu.Item icon={<ExportOutlined />}>
        <a href="/"> Export </a>
      </Menu.Item>
      <Menu.Item icon={<SettingOutlined />}>
        <a href="/"> Settings </a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item icon={<QuestionCircleOutlined />}>
        <a href="/"> Help </a>
      </Menu.Item>
    </Menu>
  );

  const DropdownMenu = () => {
    return (
      <Dropdown key="more" overlay={moreMenu}>
        <Button
          style={{
            border: 'none',
            padding: 0,
          }}
        >
          <MoreOutlined
            style={{
              fontSize: 20,
              verticalAlign: 'top',
            }}
          />
        </Button>
      </Dropdown>
    );
  };

  return (
    <div className="header-tools_panel">
      <Space>
        <NewEventButton />
        <Tooltip title="time zone">
          <TimeZoneSelect />
        </Tooltip>
      </Space>

      <Space>
        <ScheduleViewSelect />
        <Tooltip title="visibility control of hidden events">
          <Button
            className="button-center-icon button-no-border"
            onClick={handlerVisibilityOfHiddenEvents}
          >
            {visibilityHiddenEvents ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </Button>
        </Tooltip>        
        <ExportToGoogle />
        <DropdownMenu />
      </Space>
    </div>
  );
};

export default HeaderToolsPanel;
