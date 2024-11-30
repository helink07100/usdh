import { Button, Flex, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { lt } from 'ramda';
import { useState } from 'react';

import useHistory from '@/hooks/useHistory';

import SignModal from './SignModal';
import TransactionModal from './TransactionModal';
import VoteModal from './VoteModal';

const { Title } = Typography;

export default function EarnManagePage() {
  const { data, isLoading, total, setPage, refetch, refetchOwner } = useHistory();

  const [vote, setVote] = useState();
  const [encode, setEncode] = useState<string>();
  const earnColumns = [
    {
      title: '提案单号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '提案类型',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: '交易摘要',
      dataIndex: 'holdingSurplus',
      key: 'holdingSurplus',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setVote(record);
              setTransactionModalIsOpen(true);
            }}
          >
            查看
          </Button>
        </Space>
      ),
    },
    {
      title: '提案状态',
      dataIndex: 'status',
      key: 'status',
      render: (_: any, record: any) => {
        if (lt(record.confirmCount, record.maxConfirmCount)) {
          return `提案签名(${record.confirmCount}/${record.maxConfirmCount})`;
        }
        return record.executed ? '执行成功' : '执行失败';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '完成时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      align: 'center',
      render: (_: any, record: any) => {
        if (lt(record.confirmCount, record.maxConfirmCount)) {
          return (
            <Button
              type="link"
              onClick={() => {
                setVote(record);
                setEncode(undefined);
                setSignModalIsOpen(true);
              }}
            >
              提案签名
            </Button>
          );
        }
        return undefined;
      },
    },
  ];

  const [signModalIsOpen, setSignModalIsOpen] = useState(false);
  const [transactionModalIsOpen, setTransactionModalIsOpen] = useState(false);
  const [addVoteModalIsOpen, setVoteModalIsOpen] = useState(false);
  return (
    <div className="mx-4 mt-5 pb-10">
      <Flex justify="space-between" align="center" className="my-4">
        <Title level={5}>提案</Title>

        <Button type="primary" onClick={() => setVoteModalIsOpen(true)}>
          发起提案
        </Button>
      </Flex>

      <Table
        dataSource={data as any}
        loading={isLoading}
        columns={earnColumns as ColumnsType}
        pagination={{
          pageSize: 10,
          onChange: setPage,
          total,
        }}
      />
      {/* {gt(total, 1) && (
        <div className="flex justify-center my-6">
          <Pagination showControls total={total} initialPage={1} page={page} onChange={setPage} />
        </div>
      )} */}
      <SignModal
        isInit={!!encode}
        data={encode}
        vote={vote}
        isOpen={signModalIsOpen}
        onCancel={() => setSignModalIsOpen(false)}
        onOk={async () => {
          setSignModalIsOpen(false);
          refetch();
          if ((vote as any).parseData.method === 'transferOwnership') {
            refetchOwner();
          }
        }}
      />
      <TransactionModal
        abi={(vote as any)?.parseData}
        isOpen={transactionModalIsOpen}
        onCancel={() => setTransactionModalIsOpen(false)}
        onOk={() => {
          setTransactionModalIsOpen(false);
        }}
      />
      <VoteModal
        isOpen={addVoteModalIsOpen}
        onCancel={() => setVoteModalIsOpen(false)}
        onOk={(data: string) => {
          setEncode(data);
          setSignModalIsOpen(true);
          setVoteModalIsOpen(false);
        }}
      />
    </div>
  );
}
