import Image from 'next/image';
import favicon from '@/public/favicon.png';

const Logo = ({ ...props }) => (
  <Image src={favicon} alt="Logo" width={32} height={32} {...props} />
);

export default Logo;
