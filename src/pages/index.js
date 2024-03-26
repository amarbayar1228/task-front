import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Table,
  Typography,
  message,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
const { TextArea } = Input;

export default function Home() {
  const [data, setData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();
  const isEditing = (record) => record.id === editingKey;

  useEffect(() => {
    getData();
  }, []);

  const edit = (record) => {
    form.setFieldsValue({
      lastName: "",
      firstName: "",
      phone: "",
      description: "",
      gmail: "",
      ...record,
    });
    setEditingKey(record.id);
  };
  const cancel = () => {
    setEditingKey("");
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const save = async (id) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        axios
          .patch(`/api/update/users/${id}`, newData[index])
          .then((res) => {
            message.success("Sucess");
          })
          .catch((err) => {
            console.log("err: ", err);
          })
          .finally(() => {
            getData();
          });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const getData = () => {
    axios
      .get("/api/get/users")
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  };

  const onFinish = (values) => {
    axios
      .post("/api/post/users", values)
      .then((res) => {
        message.success("Success");
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log("err: ", err);
      })
      .finally(() => {
        getData();
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const deleteFun = (e) => {
    axios
      .delete(`/api/delete/users/${e.id}`)
      .then((res) => {
        message.success("Deleted");
      })
      .catch((err) => {
        console.log("err: ", err);
      })
      .finally(() => {
        getData();
      });
  };
  const columns = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => {
        return index + 1;
      },
    },
    {
      title: "lastName",
      dataIndex: "lastName",
      key: "lastName",
      editable: true,
    },
    {
      title: "firstName",
      dataIndex: "firstName",
      key: "firstName",
      editable: true,
    },
    {
      title: "gmail",
      dataIndex: "gmail",
      key: "gmail",
      editable: true,
    },
    {
      title: "phone",
      dataIndex: "phone",
      key: "phone",
      editable: true,
    },
    {
      title: "description",
      dataIndex: "description",
      key: "description",
      editable: true,
    },
    {
      title: "action",
      dataIndex: " ",
      key: "all",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm
              title="Sure to cancel?"
              onConfirm={cancel}
              okType="default"
            >
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <div className="flex items-center gap-4">
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              <Button>Edit</Button>
            </Typography.Link>
            <Typography.Link disabled={editingKey !== ""}>
              <Button danger onClick={() => deleteFun(record)}>
                Delete
              </Button>
            </Typography.Link>
          </div>
        );
      },
    },
  ];
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode =
      inputType === "number" ? <InputNumber className="w-full" /> : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "phone" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <div className="w-full flex flex-col">
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <main className="w-full">
          <Form
            className="w-full"
            name="basic"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Lastname"
              name="lastName"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="firstname"
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="gmail"
              name="gmail"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="phone"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <TextArea />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 18,
                span: 12,
              }}
            >
              <Button type="default" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </main>
      </Modal>
      <div className="flex flex-col p-10 gap-10">
        <Button type="default" onClick={showModal} className="w-36">
          Add
        </Button>
        <Form form={form} component={false}>
          <Table
            bordered
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            dataSource={data?.toReversed()}
            columns={mergedColumns}
          />{" "}
        </Form>
      </div>
    </div>
  );
}
