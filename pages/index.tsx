import Head from 'next/head';
import ControlPanel from '../components/ControlPanel';
import Map from '../components/Map';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Open Game Dev - Map Generator</title>
        <meta name="description" content="Open source map generator by Open Game Dev" />
      </Head>
      <Map/>
      <ControlPanel/>
    </div>
  )
}
