import { pipe, prop, map, sum, groupBy, mapObj, log, countBy } from '../src/index.js'

const url = 'https://api.dailymotion.com/videos?limit=100&user=Youpinadi&fields=views_total,title,channel,owner.fans_total'

interface Video {
  views_total: number
  title: string
  channel: string
  owner: { fans_total: number }
}

interface ApiResponse {
  list: Video[]
}

async function main() {
  const response = await fetch(url)
  const data: ApiResponse = await response.json()

  // number of videos per channel
  pipe(
    prop('list'),
    countBy(prop('channel')),
    log,
  )(data)

  // total views
  pipe(
    prop('list'),
    map(prop('views_total')),
    sum,
    log,
  )(data)

  // number of views per channel
  pipe(
    prop('list'),
    groupBy(prop('channel')),
    mapObj(map(prop('views_total'))),
    mapObj(sum),
    log,
  )(data)
}

main()
