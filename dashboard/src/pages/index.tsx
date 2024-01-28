import Head from "next/head";
import Image from 'next/image';
import {
  useQuery
} from '@tanstack/react-query';
import styles from "components/styles/Home.module.css";
import { Config } from "components/utils/Config";

interface Profile {
  id: string;
  name: string;
  token: string;
}
interface LostItem {
  item: string;
  image_link: string;
  checked_off: boolean;
  item_id: string;
  timestamp: string;
}

interface Data {
  flight_number: number;
  items: LostItem[];
  profile: Profile;
  seat_number: number;
}

// ... (previous imports)

export default function Home() {


  const fetchData = async () => {
    const res = await fetch(`${Config.API_URL}/flight/lost_items`)
    return res.json()
  }

  const { isPending, error, data } = useQuery<Data[]>({
    queryKey: ['lostItems'],
    queryFn: fetchData}
)
  let lostItems: LostItem[] = [];
  if(data){
    console.log(data);
    console.log(data.flatMap((item) => item.items))
    lostItems = data.flatMap((items) => items.items).filter((item) => item.item !== 'nothing');
  }

  if(isPending) return 'Loading...'
  
  if(error) return 'An error has occurred ' + error.message

  


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
              {lostItems?.map((dataItem, index) => (
                <div key={index} className={styles.itemCard}>
                  <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center',
                justifyContent: 'space-around'}}>{/*@ts-ignore */}
                    <h2>Item: {dataItem.item}</h2>
                    <div className={styles.itemDetails}> 
                    </div>
                  </div>
                  {
                     dataItem.image_link ? <img src={dataItem.image_link} alt={dataItem.item} width={120} height={120} className={styles.itemImage} /> :
                     <div></div>
                  }
                 
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      </>
  );
}