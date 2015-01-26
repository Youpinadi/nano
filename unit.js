var my_unit = (function () {
    var self = {};
    function getTable(title)
    {
        var $table = $('<table>'+
            '<thead><tr><td colspan="4"><b>' + title + '</b></td></tr></thead>'+
            '<tr class="head"><td>Description</td><td>Value</td><td>Expected value</td></tr>'+
            '</table>')
            .appendTo($('body'));

        return $table;
    };
    function getTest(test, testResult)
    {
        return '<tr class="' + (testResult ? 'ok' : 'ko') + '">' +
                    $.map(test, function(item){
                        return '<td>' + item + '</td>'
                    }).join('')
                + '</tr>';
    };

    function getResult(ok, ko)
    {
        return '<tr class="result ' + (ko > 0 ? 'ko' : 'ok') + '"><td colspan="4">' + (ok + ko) + ' tests / ' + ok + ' pass / ' + ko + ' fail</td></tr>';

    }

    self.run = function(name, suite)
    {
        var totalOk = totalKo = 0;
        var $title = $('<h1>').html(name).appendTo($('body'));
        $.each(suite, function(title, tests){
            var ok = ko = 0;
            var results = [];
            $table = getTable(title);
            $.each(tests, function(index, test){
                var testResult = test[1] === test[2];
                testResult ? ok++ : ko++;
                $table.append(getTest(test, testResult));
            });
            $table.append(getResult(ok, ko));
            totalOk += ok;
            totalKo += ko;
        });
        $title.after('<div class="suite-results ' + (totalKo > 0 ? 'ko' : 'ok') + '">' + (totalOk + totalKo) + ' tests / ' + totalOk + ' pass / ' + totalKo + ' fail</div>')
    };
    return self;
})();