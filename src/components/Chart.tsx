import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts"

// https://github.com/recharts/recharts/issues/3615#issuecomment-1636923358
const error = console.error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.error = (...args: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  if (/defaultProps/.test(args[0])) return
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  error(...args)
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
const data1: any = JSON.parse(
  `[{"price": 1.015163361319999}, {"price": 1.0145167553794074}, {"price": 0.9801771862063314}, {"price": 0.9824135245283752}, {"price": 1.0108487610060675}, {"price": 0.9801237059262892}, {"price": 0.9845805611910416}, {"price": 1.010523566591801}, {"price": 0.9873460237968696}, {"price": 0.9830503344388861}, {"price": 0.9984905502891167}, {"price": 1.0050231393625177}, {"price": 0.9925070130442818}, {"price": 1.0173111306851477}, {"price": 0.9891419240188853}, {"price": 0.9824374304218881}, {"price": 0.9874454975945494}, {"price": 0.9954328309539524}, {"price": 0.9824788178284283}, {"price": 1.007602369940266}, {"price": 1.0074644556993406}, {"price": 0.999244616708577}, {"price": 1.0103815654529698}, {"price": 0.9980560210623742}, {"price": 0.9864006373383959}, {"price": 1.0151559261257153}, {"price": 1.0080148213040765}, {"price": 0.9850205764532133}, {"price": 0.9867943840822309}, {"price": 1.002580701145337}, {"price": 0.9860993497210151}, {"price": 1.0152713849165342}, {"price": 0.9988041723053305}, {"price": 1.0131933955928845}, {"price": 0.9860193161050905}, {"price": 0.9944126846157588}, {"price": 0.9941723098894657}, {"price": 1.0098663067622125}, {"price": 1.005709931787815}, {"price": 1.0164832324049309}, {"price": 0.9969229061971336}, {"price": 0.9970617834898363}, {"price": 1.0087365501300996}, {"price": 0.9834524460994987}, {"price": 1.0149634502267402}, {"price": 0.9851930347856606}, {"price": 1.0027648412628312}, {"price": 1.0159196687943302}, {"price": 0.9880171843030533}, {"price": 1.0109162319098053}, {"price": 0.9850479176210177}, {"price": 1.0163890784797125}, {"price": 1.0021578827759985}, {"price": 0.9939457160484245}, {"price": 0.9937783466575701}, {"price": 1.0163652518121}, {"price": 0.9951311781957102}, {"price": 1.0034962525680446}, {"price": 0.9822763842898713}, {"price": 0.9844940562272279}, {"price": 0.9826000202168101}, {"price": 0.9802716810196016}, {"price": 1.0104648395443583}, {"price": 0.9858233693502518}, {"price": 0.9849760531390599}, {"price": 0.9872925193155515}, {"price": 0.9856565663978821}, {"price": 0.9816501757938999}, {"price": 1.0193881483223692}, {"price": 1.0187468639144923}, {"price": 1.005773184910918}, {"price": 0.9931612926799612}, {"price": 1.0087084154699428}, {"price": 0.9807743737267286}, {"price": 0.9867020378477088}, {"price": 0.991278651444058}, {"price": 1.0079938741661976}, {"price": 1.0144081097011872}, {"price": 1.0143598224123036}, {"price": 1.0103558958639012}, {"price": 1.0172799647282225}, {"price": 1.0049756799357679}, {"price": 0.9998992596755399}, {"price": 1.011402178871996}, {"price": 1.0169889694091372}, {"price": 1.0045429391438503}, {"price": 0.9895018203687344}, {"price": 1.0189466849795406}, {"price": 1.0168064717327925}, {"price": 1.0171537747279547}, {"price": 1.000906010431832}, {"price": 1.0135604420367736}, {"price": 0.9932881204555314}, {"price": 1.0142433350492532}, {"price": 1.0136531417785948}, {"price": 1.0127953651775472}, {"price": 1.0106711182061483}, {"price": 1.0077772048101898}, {"price": 1.0146566977932334}]`,
)

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
const data2: any = JSON.parse(
  `[{"price": 140.7586622961064}, {"price": 140.52821928307904}, {"price": 140.69003392847378}, {"price": 140.78117285963293}, {"price": 140.32434076717303}, {"price": 140.17085920756074}, {"price": 140.4574222653752}, {"price": 140.52207833089363}, {"price": 140.56397926814515}, {"price": 141.60260262853274}, {"price": 141.52919185096434}, {"price": 141.1575630741369}, {"price": 141.1713108177986}, {"price": 141.11717115974244}, {"price": 141.22003592565656}, {"price": 141.1797410891271}, {"price": 141.98856527151673}, {"price": 141.51373030931174}, {"price": 144.269818466476}, {"price": 144.4610232980878}, {"price": 144.53874703851204}, {"price": 144.91306910382463}, {"price": 144.11724710985013}, {"price": 144.5476395159297}, {"price": 144.4079581254001}, {"price": 144.2470884089953}, {"price": 144.9569352649214}, {"price": 144.12517992841143}, {"price": 144.45574063660223}, {"price": 144.94972244971245}, {"price": 144.43851061123823}, {"price": 144.71247995798336}, {"price": 144.02762258872923}, {"price": 144.98174780121565}, {"price": 144.95221370010984}, {"price": 144.38264896386607}, {"price": 144.1788090355738}, {"price": 144.81634384061158}, {"price": 144.0835294647581}, {"price": 144.69900854695507}, {"price": 144.10623926184007}, {"price": 144.42559730294454}, {"price": 144.1763661685815}, {"price": 144.68753411250714}, {"price": 144.3977747680813}, {"price": 144.4362974951344}, {"price": 144.4407859213883}, {"price": 144.7902171096865}, {"price": 144.75830360476942}, {"price": 144.15248884742417}, {"price": 144.21986802483318}, {"price": 144.5409576473634}, {"price": 144.2021504117291}, {"price": 144.34992391310107}, {"price": 144.55704161801987}, {"price": 144.06815840154098}, {"price": 144.62250288218817}, {"price": 144.5881191038728}, {"price": 144.89196664312323}, {"price": 144.48037297271702}, {"price": 144.67739594060328}, {"price": 144.59357639396646}, {"price": 144.68132860924794}, {"price": 144.48990358086135}, {"price": 144.89184834622785}, {"price": 144.72315873745154}, {"price": 144.55964028385986}, {"price": 144.07077913429345}, {"price": 144.81594298463654}, {"price": 144.61239240599014}, {"price": 144.11686979377865}, {"price": 144.80319162713235}, {"price": 144.4326997748823}, {"price": 144.7209679460039}, {"price": 144.57846327581285}, {"price": 144.48684566571472}, {"price": 144.1286098164392}, {"price": 144.92890041822776}, {"price": 144.3468902552689}, {"price": 144.55998204883676}, {"price": 144.04075071951}, {"price": 144.2397189749535}, {"price": 144.67596182577864}, {"price": 144.11397070994866}, {"price": 144.81315322105044}, {"price": 144.96015281575882}, {"price": 144.61174623180423}, {"price": 144.6957667544163}, {"price": 144.0681385528901}, {"price": 144.14386785895388}, {"price": 144.6963066463665}, {"price": 144.73630764861647}, {"price": 144.45213103139517}, {"price": 144.51642037810953}, {"price": 144.8992899121197}, {"price": 144.7227047468546}, {"price": 144.15876060502163}]`,
)

export function Chart1() {
  return (
    <ResponsiveContainer width="100%" height={20}>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      <LineChart data={data1} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="colorUv" x1="0%" y1="0" x2="100%" y2="0">
            <stop offset="0%" stopColor="#92FE9D" />
            <stop offset="100%" stopColor="#2575FC" />
            <stop offset="100%" stopColor="#00C9FF" />
          </linearGradient>
        </defs>
        <Line type="monotone" dataKey="price" dot={false} activeDot={false} stroke="url(#colorUv)" />
        <YAxis dataKey="price" tickCount={1} domain={[0.98, 1.02]} hide />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function Chart2() {
  return (
    <ResponsiveContainer width="100%" height={20}>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      <LineChart data={data2} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="colorUv" x1="0%" y1="0" x2="100%" y2="0">
            <stop offset="0%" stopColor="#92FE9D" />
            <stop offset="100%" stopColor="#2575FC" />
            <stop offset="100%" stopColor="#00C9FF" />
          </linearGradient>
        </defs>
        <Line type="monotone" dataKey="price" dot={false} activeDot={false} stroke="url(#colorUv)" />
        <YAxis dataKey="price" tickCount={1} domain={[140, 145]} hide />
      </LineChart>
    </ResponsiveContainer>
  )
}