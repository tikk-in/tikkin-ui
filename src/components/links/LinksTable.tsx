import React, {useEffect} from 'react';
import {Button, GetProp, Modal, Space, Table, TablePaginationConfig, TableProps} from 'antd';
import {DeleteOutlined, EditFilled, ExclamationCircleFilled, ExportOutlined} from "@ant-design/icons";
import {formatRelative} from 'date-fns';
import {BASE_URL} from "../../config.ts";
import useApi from "../../context/ApiContext.tsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {LinkModel} from "../../model/LinkModel.ts";
import EditLinkModal from "./EditLinkModal.tsx";

const {Column,} = Table;
const {confirm} = Modal;

const showDeleteConfirm = (deleteFunction: () => void) => {
  confirm({
    title: 'Are you sure?',
    icon: <ExclamationCircleFilled/>,
    content: `This link will be permanently deleted.`,
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk() {
      deleteFunction();
    },
    onCancel() {
      console.log('Cancel');
    },
  });
};

export interface LinkItem extends LinkModel {
  key: React.Key;
}

export interface LinksTableProps {
  triggerReload: number;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const LinksTable: React.FC<LinksTableProps> = (
    {
      triggerReload,
    }) => {

    const api = useApi();
    const [data, setData] = React.useState<LinkItem[]>([]);
    const [loading, setLoading] = React.useState(false);

    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [editLinkObject, setEditLinkObject] = React.useState<LinkModel | null>(null);
    const [tableParams, setTableParams] = React.useState<TableParams>({
      pagination: {
        current: 1,
        pageSize: 10,
      },
    });

    const query = useQuery({
      queryKey: ['links'], queryFn: async () => {
        try {
          setLoading(true);
          const result = await api.get(`/v1/links?page=${tableParams.pagination!.current! - 1}`);
          const queryData = result.data;
          setData(queryData.data.map((item: LinkModel) => {
            return {key: item.id, ...item};
          }));

          setTableParams({
            ...tableParams, pagination: {
              ...tableParams.pagination,
              total: queryData.total,
            }
          });
          return queryData;
        } finally {
          setLoading(false);
        }
      },
      initialData: [],
    });

    useEffect(() => {
      if (triggerReload > 0) {
        query.refetch();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [triggerReload]);

    const deleteMutation = useMutation({
      mutationFn: (id: number) => api.delete(`/v1/links/${id}`),
      onError: (error) => {
        console.error('error', error);
        query.refetch();
      },
      onSuccess: () => {
        query.refetch();
      }
    });

    const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
      setTableParams({
        pagination,
        filters,
        ...sorter,
      });

      // `dataSource` is useless since `pageSize` changed
      if (pagination.pageSize !== tableParams.pagination?.pageSize) {
        setData([]);
      }
    };

    return (<>
        <EditLinkModal open={isEditOpen} link={editLinkObject} handleOk={async () => {
          setIsEditOpen(false);
          await query.refetch();
        }} handleCancel={() => {
          setIsEditOpen(false);
        }}/>
        <Table dataSource={data} style={{width: '100%'}} loading={loading} onChange={handleTableChange}
               pagination={tableParams.pagination}>
          <Column title="Link" dataIndex="slug" key="slug" render={(value) => {
            return (
              <div style={{display: "flex"}}>
                <a href={`${BASE_URL}/${value}`} target="_blank" style={{textOverflow: "ellipsis"}}>{BASE_URL}/{value}</a>
                <ExportOutlined style={{marginLeft: '4px'}}/>
              </div>);
          }}/>
          <Column title="Description" dataIndex="description" key="description" render={(value) => {
            if (!value) return '-';
            return value;
          }}/>
          <Column title="Target" dataIndex="target_url" key="target_url"/>
          <Column title="Expire" dataIndex="expire_at" key="expire_at" render={(value,) => {
            if (!value) return 'Never';
            return formatRelative(value, new Date());
          }}/>
          <Column title="Visits" dataIndex="visits" key="visits"/>
          <Column title="Created at" dataIndex="created_at" key="created_at" render={(value) => {
            return formatRelative(value, new Date());
          }}/>
          <Column
            title="Action"
            key="action"
            render={(_: unknown, record: LinkItem) => (
              <Space size="middle">
                <Button icon={<EditFilled/>} onClick={() => {
                  setEditLinkObject(record);
                  setIsEditOpen(true);
                }}></Button>
                <Button icon={<DeleteOutlined/>}
                        onClick={() => showDeleteConfirm(() => {
                          deleteMutation.mutate(record.id)
                        })}
                />
              </Space>
            )}
          />
        </Table>
      </>
    )
  }
;

export default LinksTable;
