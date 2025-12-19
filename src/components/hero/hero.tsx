import { Title } from './title';
import './hero.css';
import Link from 'next/link';

export function Hero() {
  return (
    <article className='relative am-hero h-screen w-full flex place-content-center flex-wrap'>
      <Title />
      <Link
        className='absolute right-[1.2vmax] top-[1.2vmax] w-[2vmax] h-[2vmax]'
        href={
          'https://www.google.com/search?q=gravit+designer+&sca_esv=9fc1c8ab75c29480&udm=2&biw=1396&bih=663&sxsrf=AE3TifOsdkiBPzZWbOJgMdSUQjgKDXGVNw%3A1766169171944&ei=U5pFafapOcHZ7_UP6KmW-Ao&ved=0ahUKEwi2n-3wpMqRAxXB7LsIHeiUBa8Q4dUDCBI&uact=5&oq=gravit+designer+&gs_lp=Egtnd3Mtd2l6LWltZyIQZ3Jhdml0IGRlc2lnbmVyIDIHECMYJxjJAjIHECMYJxjJAjIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAESNgIUPoEWPoEcAJ4AJABAJgBkwGgAZMBqgEDMC4xuAEDyAEA-AEBmAIDoAKtAcICBBAAGB7CAgYQABgIGB6YAwCIBgGSBwMyLjGgB-4HsgcDMC4xuAeeAcIHBTItMi4xyAcUgAgA&sclient=gws-wiz-img'
        }
      >
        <img src='/assets/gravit-designer.png' alt='Gravit Designer logo' />
      </Link>
    </article>
  );
}
