import { CloseOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

interface CustomModalProps {
  open: boolean;
  title?: string | React.ReactNode;
  closable?: boolean;
  maskClosable?: boolean;
  content: React.ReactNode;
  onCancel: () => void;
  className?: string;
  width?: string | number;
}

function CustomModal(props: CustomModalProps) {
  const {
    open,
    title = null,
    closable = false,
    maskClosable = false,
    content,
    onCancel,
    width = 520,
    className = '',
  } = props;

  return (
    <Modal
      width={width}
      className={`${className} customModal`}
      centered
      title={title}
      closable={closable}
      maskClosable={maskClosable}
      open={open}
      footer={null}
      forceRender
      closeIcon={<CloseOutlined />}
      onCancel={onCancel}
      transitionName=""
    >
      {content}
    </Modal>
  );
}

export default CustomModal;
