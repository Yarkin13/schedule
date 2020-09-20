import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
} from 'antd';
import React, {useContext, useState} from 'react';
import {connect} from 'react-redux';
import {
  hideFormCreationEvent,
  hideLoader,
  organizersLoaded,
  setAlertMessage,
  showLoader,
} from '../../actions';
import eventsTypes from '../../constants/events-types';
import {ScheduleServiceContext} from '../ScheduleServiceContext';
import './create-event.css';
import DeleteOrganizerButton from './DeleteOrganizerButton';

const emptyEvent = {
  id: '',
  topic: '1',
  description: '',
  descriptionUrl: '',
  type: '',
  timeZone: '',
  dateTime: 0,
  taskObj: {
    demoUrl: '',
    materials: '',
    screen: '',
  },
  place: '',
  comment: '',
  organizer: '',
  feedback: false,
};

const {Option} = Select;

const CreateEvent = ({
  isShowFormСreationEvent,
  hideFormCreationEvent,
  showLoader,
  setAlertMessage,
  hideLoader,
  fetchEvents,
  organizers,
  organizersLoaded,
}) => {
  const {addEvent, getGithubData, addOrganizer, getOrganizers} = useContext(ScheduleServiceContext);
  const onClose = () => {
    hideFormCreationEvent();
  };

  const [form] = Form.useForm();
  const [hideSubFieldsForTaskFlag, setHideSubFieldsFlag] = useState(true);
  const [event, setEvent] = useState(emptyEvent);
  const [hideSubFieldsForOfflineFlag, setHideSubFieldsForOfflineFlag] = useState(true);
  const [deadline, setDeadline] = useState({flag: false, date: ''});

  const onSelectType = e => {
    if (e === 'task' || e === 'optional-task') {
      setHideSubFieldsFlag(false);
    } else {
      setHideSubFieldsFlag(true);
      setDeadline({...deadline, flag: false});
    }

    if (e === 'offline-lecture' || e === 'meetup') {
      setHideSubFieldsForOfflineFlag(false);
    } else {
      setHideSubFieldsForOfflineFlag(true);
    }

    setEvent({...event, type: e});
  };

  const onSelectOrganizer = e => {
    setEvent({...event, organizer: organizers.find(organizer => organizer.name === e)});
  };

  const addNewOrganizer = async () => {
    const data = await getGithubData(event.organizerGitHub);

    if (data.name === undefined) {
      message.error('GitHub does not exist!');
      setEvent({...event, organizerGitHub: ''});
      return;
    }

    if (
      organizers.find(
        organizer => organizer.name.toLowerCase() === event.organizerGitHub.toLowerCase().trim()
      ) === undefined
    ) {
      setEvent({...event, organizerGitHub: ''});
      await addOrganizer(data);
      const newOrganizers = await getOrganizers();
      organizersLoaded(newOrganizers);
    } else {
      message.error('Such an organizer exists!');
      setEvent({...event, organizerGitHub: ''});
    }
  };

  const onSubmit = () => {
    hideFormCreationEvent();
    showLoader();
    addEvent(event)
      .then(() => {
        setAlertMessage('Event added successfully!');
        fetchEvents();
        setEvent(emptyEvent);
        form.resetFields();
      })
      .catch(() => {
        hideLoader();
        message.error('Something went wrong');
      });
    if (deadline.flag) {
      addEvent({...event, type: 'deadline', dateTime: deadline.date}).then(() => {
        fetchEvents();
        setEvent(emptyEvent);
        form.resetFields();
        setDeadline({...deadline, flag: false});
      });
    }
  };

  const onValuesChangeMaterials = materials => {
    setEvent({
      ...event,
      taskObj: {
        ...event.taskObj,
        materials: materials,
      },
    });
  };

  const onChangeTimeAndDate = e => {
    setEvent({
      ...event,
      dateTime: Date.parse(e._d.toString()),
    });
  };

  const onChangeTimeAndDateDeadline = e => {
    setDeadline({
      ...deadline,
      date: Date.parse(e._d.toString()),
    });
  };

  const onChangeInputs = e => {
    switch (e.target.name) {
      case 'topic':
        setEvent({...event, topic: e.target.value});
        break;
      case 'place':
        setEvent({...event, place: e.target.value});
        break;
      case 'description-url':
        setEvent({...event, descriptionUrl: e.target.value});
        break;
      case 'organizer-github':
        setEvent({...event, organizerGitHub: e.target.value});
        break;
      case 'demo-url':
        setEvent({
          ...event,
          taskObj: {
            ...event.taskObj,
            demoUrl: e.target.value,
          },
        });
        break;
      case 'screen':
        setEvent({
          ...event,
          taskObj: {
            ...event.taskObj,
            screen: e.target.value,
          },
        });
        break;
      case 'description':
        setEvent({...event, description: e.target.value});
        break;
      case 'comment':
        setEvent({...event, comment: e.target.value});
        break;
      default:
        return null;
    }
  };

  return (
    <>
      <Drawer
        title="Create a new event"
        width={window.innerWidth > 1000 ? '50%' : '100%'}
        onClose={onClose}
        visible={isShowFormСreationEvent}
        bodyStyle={{paddingBottom: 80}}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={onClose} style={{marginRight: 8}}>
              Cancel
            </Button>
            <Button type="primary" form="create-form" htmlType="submit">
              Submit
            </Button>
          </div>
        }
      >
        <Form
          layout="vertical"
          hideRequiredMark
          id="create-form"
          onFinish={onSubmit}
          form={form}
          onValuesChange={(changedValues, allValues) => {
            if (changedValues.materials) onValuesChangeMaterials(allValues.materials);
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="topic"
                label="Topic"
                onChange={onChangeInputs}
                value="asd"
                rules={[{required: true, message: 'Please enter event topic'}]}
              >
                <Input name="topic" placeholder="Please enter event topic" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item onChange={onChangeInputs} name="description-url" label="Link">
                <Input
                  name="description-url"
                  style={{width: '100%'}}
                  placeholder="Please enter url"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item onChange={onChangeInputs} name="organizer" label="Organizer">
                <Select
                  onSelect={onSelectOrganizer}
                  placeholder="Please enter event organizer"
                  allowClear
                  dropdownRender={menu => (
                    <div>
                      {menu}
                      <Divider style={{margin: '4px 0'}} />
                      <div style={{display: 'flex', flexWrap: 'nowrap', padding: 8}}>
                        <Input
                          style={{flex: 'auto'}}
                          name="organizer-github"
                          onChange={onChangeInputs}
                          value={event.organizerGitHub}
                        />
                        <Button
                          style={{
                            flex: 'none',
                            padding: '8px',
                            display: 'block',
                            cursor: 'pointer',
                          }}
                          onClick={addNewOrganizer}
                          icon={<PlusOutlined />}
                          type="link"
                        >
                          Add github
                        </Button>
                      </div>
                    </div>
                  )}
                >
                  {organizers.map(organizer => (
                    <Option value={organizer.name} key={organizer.id}>
                      <div className="option-wrapper">
                        {organizer.name}
                        {organizer.name !== event.organizer.name && (
                          <DeleteOrganizerButton id={organizer.id} />
                        )}
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Type"
                rules={[{required: true, message: 'Please choose the type'}]}
              >
                <Select
                  name="type"
                  onSelect={onSelectType}
                  placeholder="Please choose the type"
                  allowClear
                  dropdownRender={menu => (
                    <div>
                      {menu}
                      <Divider style={{margin: '4px 0'}} />
                      <div style={{display: 'flex', flexWrap: 'nowrap', padding: 8}}>
                        <Button
                          style={{
                            border: 0,
                          }}
                          /* onClick={addNewType} */
                          icon={<PlusOutlined />}
                          type="link"
                        >
                          Create a new type
                        </Button>
                      </div>
                    </div>
                  )}
                >
                  {eventsTypes.map(item => (
                    <Option value={item.value} key={item.value}>
                      {item.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={!deadline.flag ? 24 : 12}>
              <Form.Item
                name="date"
                label="Date and time"
                rules={[{required: true, message: 'Please choose the Date and Time'}]}
              >
                <DatePicker
                  name="date"
                  style={{width: '100%'}}
                  showTime={{format: 'HH:mm'}}
                  format="YYYY-MM-DD HH:mm"
                  onChange={onChangeTimeAndDate}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deadline-date"
                label="Date and time deadline"
                rules={
                  deadline.flag && [
                    {required: true, message: 'Please choose the Date and Time for deadline'},
                  ]
                }
                hidden={!deadline.flag}
              >
                <DatePicker
                  name="deadline-date"
                  style={{width: '100%'}}
                  showTime={{format: 'HH:mm'}}
                  format="YYYY-MM-DD HH:mm"
                  onChange={onChangeTimeAndDateDeadline}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                onChange={onChangeInputs}
                name="place"
                label="Place"
                hidden={hideSubFieldsForOfflineFlag}
              >
                <Input name="place" style={{width: '100%'}} placeholder="Please enter place" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="checkbox-deadline" hidden={hideSubFieldsForTaskFlag}>
                <Checkbox
                  onChange={e => setDeadline({...deadline, flag: e.target.checked})}
                  checked={deadline.flag}
                >
                  Add deadline
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                onChange={onChangeInputs}
                name="demo-url"
                label="Demo Url"
                hidden={hideSubFieldsForTaskFlag}
              >
                <Input name="demo-url" style={{width: '100%'}} placeholder="Please enter url" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                onChange={onChangeInputs}
                name="screen"
                label="Screen"
                hidden={hideSubFieldsForTaskFlag}
              >
                <Input
                  name="screen"
                  style={{width: '100%'}}
                  placeholder="Please enter screen url"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item onChange={onChangeInputs} name="description" label="Description">
                <Input.TextArea name="description" rows={2} placeholder="Please add description" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <div className="ant-col ant-form-item-label">
                <span>Materials</span>
              </div>
              <Form.List name="materials" onChange={onChangeInputs}>
                {(fields, {add, remove}) => {
                  return (
                    <div>
                      {fields.map(field => (
                        <Space
                          key={field.key}
                          style={{display: 'flex', marginBottom: 8}}
                          align="start"
                        >
                          <Form.Item
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...field}
                            name={[field.name, 'materialName']}
                            fieldKey={[field.fieldKey, 'materials-name']}
                            rules={[{required: true, message: 'Missing materials link name'}]}
                          >
                            <Input placeholder="Link name" />
                          </Form.Item>
                          <Form.Item
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...field}
                            name={[field.name, 'materialLink']}
                            fieldKey={[field.fieldKey, 'materials-link']}
                            rules={[{required: true, message: 'Missing materials link'}]}
                          >
                            <Input placeholder="Link" />
                          </Form.Item>

                          <MinusCircleOutlined
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                        </Space>
                      ))}

                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          block
                        >
                          <PlusOutlined /> Add field
                        </Button>
                      </Form.Item>
                    </div>
                  );
                }}
              </Form.List>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item onChange={onChangeInputs} name="comment" label="Comment">
                <Input.TextArea name="comment" rows={2} placeholder="Please add comment" />
              </Form.Item>
            </Col>
          </Row>
          <Checkbox
            onChange={e => setEvent({...event, feedback: e.target.checked})}
            checked={event.feedback}
          >
            Allow feedback
          </Checkbox>
        </Form>
      </Drawer>
    </>
  );
};

const mapStateToProps = state => {
  return {
    isShowFormСreationEvent: state.app.isShowFormСreationEvent,
    organizers: state.app.organizers,
  };
};

const mapDispatchToProps = {
  hideFormCreationEvent,
  showLoader,
  hideLoader,
  setAlertMessage,
  organizersLoaded,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateEvent);
