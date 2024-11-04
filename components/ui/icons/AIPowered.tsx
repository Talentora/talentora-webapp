import Image from 'next/image';
import favicon from '@/public/Wireframe.svg';

const AIPowered = ({ ...props }) => (
  <Image src={favicon} alt="Logo" width={100} height={100} {...props} />
);

export default AIPowered;
