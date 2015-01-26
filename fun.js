var url = 'https://api.dailymotion.com/videos?limit=100&user=Youpinadi&fields=views_total,title,channel,owner.fans_total';

// number of videos per channel
$.getJSON(url)
    .then
    (
         _.pipe
        (
            _.prop('list'),
            _.countBy(_.prop('channel')),
            _.log
        )
    );

// total views
$.getJSON(url)
    .then
    (
        _.pipe
        (
            _.prop('list'),
            _.map(_.prop('views_total')),
            _.sum,
            _.log
        )
    );

// number of views per channel
$.getJSON(url)
    .then(
        _.pipe
        (
            _.prop('list'),
            _.groupBy(_.prop('channel')),
            _.mapObj(_.map(_.prop('views_total'))),
            _.mapObj(_.sum),
            _.log
        )
    );

