import Image from 'next/image';
import styles from './About.module.css';
import { forDevs, wallets } from './data';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const About = () => {
  const github_url = process.env.NEXT_GITHUB_URL;

  return (
    <section className={styles.container}>
      <div className={styles.content_wrapper}>
        <div className={styles.content}>
          <h4 className={styles.title}>Purpose</h4>
          <p>
            Participating in open source projects on GitHub can help you gain
            visibility and recognition in the developer community.
          </p>
        </div>
        <div className={styles.content}>
          <h4 className={styles.title}>Getting Started</h4>
          <ol className={styles.get_started}>
            <li className={styles.list}>
              1. Install & connect a wallet
              <div className={styles.wallets}>
                {wallets.map(({ name, extension ,link }, walletIndex) => (
                  <Link href={link} target="_blank" key={walletIndex}>
                    <Image
                      src={`/logos/${name}${extension}`}
                      width={24}
                      height={24}
                      alt={`${name} logo`}
                    />
                  </Link>
                ))}
              </div>
            </li>
            <li className={styles.list}>
              2. Copy the github repository and fill in the fields
            </li>
            <li className={styles.list}>3. Create a contract and pay for it</li>
            <li className={styles.list}>
              4. Watch your popularity grow on Github or claim your donations
              for the open source maintainer?{' '}
            </li>
          </ol>
        </div>
        <div className={styles.content}>
          <h4 className={styles.title}>For Developers</h4>

          <p>
            This dApp is built on top of Solana and Chainlink. It enables users
            to interact with real-time markets using trustless solutions. Learn
            how to build a full-stack dApp with Solana and Chainlink.
          </p>

          <Link
            href={github_url || '#'}
            target="_blank"
            className={styles.github_wrapper}
          >
            <Image
              src="/logos/github.svg"
              alt="github logo"
              width={24}
              height={24}
            />
            <span>View on GitHub</span>
            <ArrowLongRightIcon className="w-8 h-6" />
          </Link>

          <ul className={styles.for_devs}>
            {forDevs.map(({ text, link }, index) => (
              <li key={index}>
                <Link href={link} target="_blank">
                  {text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default About;
