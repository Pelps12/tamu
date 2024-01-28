import Head from "next/head";
import Image from 'next/image';
import { Inter } from "next/font/google";
import styles from "components/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

interface LostItem {
  name: string;
  user: string;
  profilePicture: string;
  itemPicture: string;
}
// ... (previous imports)

export default function Home() {

  
  const lostItems: LostItem[] = [{
    name: 'Bag',
    user: 'James',
    profilePicture: 'https://img.freepik.com/premium-photo/smiling-man-holding-smartphone_107420-20811.jpg?size=626&ext=jpg&ga=GA1.1.1448711260.1706313600&semt=ais',
    itemPicture: 'https://www.evocsports.com/media/23/32/76/1629365056/401407100-GEAR-BAG-35.jpg'
  }, {
    name: 'Bag',
    user: 'James',
    profilePicture: 'https://img.freepik.com/premium-photo/smiling-man-holding-smartphone_107420-20811.jpg?size=626&ext=jpg&ga=GA1.1.1448711260.1706313600&semt=ais',
    itemPicture: 'https://www.evocsports.com/media/23/32/76/1629365056/401407100-GEAR-BAG-35.jpg'
  }, {
    name: 'Bag',
    user: 'James',
    profilePicture: 'https://img.freepik.com/premium-photo/smiling-man-holding-smartphone_107420-20811.jpg?size=626&ext=jpg&ga=GA1.1.1448711260.1706313600&semt=ais',
    itemPicture: 'https://www.evocsports.com/media/23/32/76/1629365056/401407100-GEAR-BAG-35.jpg'
  }, {
    name: 'Bag',
    user: 'James',
    profilePicture: 'https://img.freepik.com/premium-photo/smiling-man-holding-smartphone_107420-20811.jpg?size=626&ext=jpg&ga=GA1.1.1448711260.1706313600&semt=ais',
    itemPicture: 'https://www.evocsports.com/media/23/32/76/1629365056/401407100-GEAR-BAG-35.jpg'
  }, {
    name: 'Bag',
    user: 'James',
    profilePicture: 'https://img.freepik.com/premium-photo/smiling-man-holding-smartphone_107420-20811.jpg?size=626&ext=jpg&ga=GA1.1.1448711260.1706313600&semt=ais',
    itemPicture: 'https://www.evocsports.com/media/23/32/76/1629365056/401407100-GEAR-BAG-35.jpg'
  }, ];

  return (
    <>
      <Head>
        <title>Employee Dashboard</title>
        <meta name="description" content="TAMU Hack submission" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.title} style={{ border: '2px solid white', position: 'relative'}}>
          <div style={{  position: 'absolute', left: 30, top: 5}}>
            <Image src={'./brand.svg'} alt='baggage buddy' width={96} height={96}/>
          </div>
          <h1 style={{ color: 'white' }}>Dashboard</h1>
        </div>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Lost Items</h1>
          </div>
          <div style={{
            overflow: 'hidden',
            width: '100%',
            height: '100%'
          }}>
            <div className={styles.horizontalScroll}>
              {lostItems.map((item, index) => (
                <div key={index} className={styles.itemCard}>
                  <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center',
                justifyContent: 'space-around'}}>
                    <h2>Item: {item.name}</h2>
                    <div className={styles.itemDetails}>
                      <img src={item.profilePicture} alt={item.name} width={48} height={48} className={styles.profileImage} />
                      <h2>{item.user}</h2>
                    </div>
                  </div>
                  
                  <img src={item.itemPicture} alt={item.user} width={120} height={120} className={styles.itemImage} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
