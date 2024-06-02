import {LinkModel} from "../../model/LinkModel.ts";
import React, {useEffect} from "react";
import {DatePicker, Form, Input, Modal} from "antd";
import {BASE_URL} from "../../config.ts";
import useApi from "../../context/ApiContext.tsx";
import {useMutation} from "@tanstack/react-query";
import dayjs from "dayjs";

export interface EditLinkModalProps {
  link: LinkModel | null
  open: boolean;
  handleOk: (link: LinkModel) => void;
  handleCancel: () => void;
}

const EditLinkModal: React.FC<EditLinkModalProps> = (
  {
    link,
    open,
    handleOk,
    handleCancel,
  }) => {

  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const api = useApi();
  const updateLinkMutation = useMutation({
    mutationFn: async (link: LinkModel) => {
      return await api.put(`/v1/links/${link.id}`, link);
    },
    onError: (error) => {
      console.error('error', error);
    },
    onSuccess: () => {
    }
  });

  useEffect(() => {
    if (link) {
      const clonedLink: LinkModel = JSON.parse(JSON.stringify(link));
      form.setFieldsValue({
        slug: clonedLink.slug,
        description: clonedLink.description,
        target_url: clonedLink.target_url,
        expire_at: clonedLink.expire_at ? dayjs(clonedLink.expire_at) : undefined,
      })
    }
  }, [form, link]);

  const onOk = React.useCallback(() => {
    setConfirmLoading(true);
    const fields = form.getFieldsValue();
    const updatedLink = {...link, ...fields};
    updateLinkMutation.mutate(updatedLink, {
      onError: (error) => {
        console.error('error updating link', error)
      }, onSuccess: () => {
        handleOk(updatedLink);
      }, onSettled: () => {
        setConfirmLoading(false);
      }
    });
  }, [updateLinkMutation, form, handleOk, link]);

  if (!link) {
    return null;
  }

  return (
    <>
      <Modal
        title={`${BASE_URL}/${link.slug}`}
        open={open}
        onOk={async () => {
          onOk();
        }}
        onCancel={handleCancel}
        okText={"Update"}
        confirmLoading={confirmLoading}
      >
        <Form form={form} labelAlign="left" labelCol={{span: 5}}>
          <Form.Item label="Slug" name="slug">
            <Input variant="filled" disabled/>
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input></Input>
          </Form.Item>
          <Form.Item label="Target" name="target_url">
            <Input></Input>
          </Form.Item>
          <Form.Item label="Expires At" name="expire_at">
            <DatePicker showTime/>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditLinkModal;
