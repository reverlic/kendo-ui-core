(function(){

test("offset throws exception if a timezone with the specified name cannot be found", function() {
    try {
        kendo.timezone.offset(new Date(), "foo");
    }catch(e) {
        equal(e.toString(), 'Error: Timezone "foo" is either incorrect, or kendo.timezones.min.js is not included.');
    }
});

test("offset returns 0 for Etc/UTC", function() {
    var date = new Date(2013, 4, 27);

    equal(kendo.timezone.offset(date, "Etc/UTC"), 0);
});

test("offset returns 0 for Etc/GMT", function() {
    var date = new Date(2013, 4, 27);

    equal(kendo.timezone.offset(date, "Etc/GMT"), 0);
});

test("offset adjusts for DST when rule is 'last[day]'", function() {
    var standard = new Date(2013, 2, 31);

    equal(kendo.timezone.offset(standard, "Europe/Sofia"), -120);

    var daylight = new Date(2013, 2, 31, 4, 0);

    equal(kendo.timezone.offset(daylight, "Europe/Sofia"), -180);
});

test("offset adjusts for DST when rule is '[day]>=[date]'", function() {
    var standard = new Date(2013, 2, 10, 0, 0, 0);

    equal(kendo.timezone.offset(standard, "America/Chicago"), 360);

    var daylight = new Date(2013, 2, 10, 2, 0, 0);

    equal(kendo.timezone.offset(daylight, "America/Chicago"), 300);
});

test("offset adjusts for DST when rule is a concrete date", function() {
    var standard = new Date(1974, 0, 6, 0, 0, 0);

    equal(kendo.timezone.offset(standard, "America/Chicago"), 360);

    var daylight = new Date(1974, 0, 6, 2, 0, 0);

    equal(kendo.timezone.offset(daylight, "America/Chicago"), 300);
});

test("offset adjusts date when it is before DST end", function() {
    var standard = new Date(2014, 0, 10, 12, 0, 0);

    equal(kendo.timezone.offset(standard, "Pacific/Auckland"), -780);
});

test("offset adjusts for DST in zones like '1:00' instead of DST rule references", function(){
    var date = new Date(2012, 2, 1, 0, 0, 0, 0)
    equal(kendo.timezone.offset(date, "Pacific/Apia"), -840);
});

test("offset detects new DST rules for America/Chicago", function() {
    function testDst(dates) {
        var expected = [360, 300, 300, 360];

        for (var idx = 0; idx < dates.length; idx++) {
            equal(kendo.timezone.offset(new Date(dates[idx]), "America/Chicago"), expected[idx]);
        }
    }

    testDst(["2004/04/04 00:00", "2004/04/05 00:00", "2004/10/31 00:00", "2004/11/01 00:00"]);
    testDst(["2005/04/03 00:00", "2005/04/04 00:00", "2005/10/30 00:00", "2005/10/31 00:00"]);
    testDst(["2006/04/02 00:00", "2006/04/03 00:00", "2006/10/29 00:00", "2006/10/30 00:00"]);

    testDst(["2007/03/11 00:00", "2007/03/12 00:00", "2007/11/04 00:00", "2007/11/05 00:00"]);
    testDst(["2008/03/09 00:00", "2008/03/10 00:00", "2008/11/02 00:00", "2008/11/03 00:00"]);
    testDst(["2009/03/08 00:00", "2009/03/09 00:00", "2009/11/01 00:00", "2009/11/02 00:00"]);
    testDst(["2010/03/14 00:00", "2010/03/15 00:00", "2010/11/07 00:00", "2010/11/08 00:00"]);
    testDst(["2011/03/13 00:00", "2011/03/14 00:00", "2011/11/06 00:00", "2011/11/07 00:00"]);
});

tzTest("Sofia", "offset detects DST for America/Sao_Paulo", function () {
    // http://www.timeanddate.com/worldclock/clockchange.html?n=233
    // Standard: GMT-3 from Feb 16 - Nov 1
    // Daylight: GMT-2 from Nov 2 - Feb 16

    equal(kendo.timezone.offset(new Date("2008/02/17 00:00"), "America/Sao_Paulo"), 180);
    equal(kendo.timezone.offset(new Date("2008/10/11 00:00"), "America/Sao_Paulo"), 180);
    equal(kendo.timezone.offset(new Date("2008/10/19 00:00"), "America/Sao_Paulo"), 120);
});

test("offset detects DST for America/New_York", function () {
    // http://www.timeanddate.com/worldclock/city.html?n=179

    // 2006
    equal(kendo.timezone.offset(new Date('2006/04/02 01:59:59'), 'America/New_York'),300);
    equal(kendo.timezone.offset(new Date('2006/04/02 03:00:01'), 'America/New_York'),240);
    equal(kendo.timezone.offset(new Date('2006/10/29 00:59:59'), 'America/New_York'),240);
    equal(kendo.timezone.offset(new Date('2006/10/29 03:00:01'), 'America/New_York'),300);

    // 2009
    equal(kendo.timezone.offset(new Date('2009/03/08 01:59:59'), 'America/New_York'),300);
    equal(kendo.timezone.offset(new Date('2009/03/08 03:00:01'), 'America/New_York'),240);
    equal(kendo.timezone.offset(new Date('2009/11/01 00:59:59'), 'America/New_York'),240);
    equal(kendo.timezone.offset(new Date('2009/11/01 03:00:01'), 'America/New_York'),300);
});

test("offset detects DST for Asia/Jerusalem", function () {
    // http://www.timeanddate.com/worldclock/city.html?n=110

    // 2008
    equal(kendo.timezone.offset(new Date('2008/03/28 01:59:59'), 'Asia/Jerusalem'),-120);
    equal(kendo.timezone.offset(new Date('2008/03/28 03:00:01'), 'Asia/Jerusalem'),-180);
    equal(kendo.timezone.offset(new Date('2008/10/05 00:59:59'), 'Asia/Jerusalem'),-180);
    equal(kendo.timezone.offset(new Date('2008/10/05 03:00:01'), 'Asia/Jerusalem'),-120);

    // 2009
    equal(kendo.timezone.offset(new Date('2009/03/27 01:59:59'), 'Asia/Jerusalem'),-120);
    equal(kendo.timezone.offset(new Date('2009/03/27 03:00:01'), 'Asia/Jerusalem'),-180);
    equal(kendo.timezone.offset(new Date('2009/09/27 00:59:59'), 'Asia/Jerusalem'),-180);
    equal(kendo.timezone.offset(new Date('2009/09/27 03:00:01'), 'Asia/Jerusalem'),-120);
});

test("offset always returns number", function(){
    var date = new Date(2012, 2, 1, 0, 0, 0, 0);
    var oldDate = new Date(1944,6,1,1,0,0);
    equal(typeof kendo.timezone.offset(date, "Asia/Tokyo"), "number");
    equal(typeof kendo.timezone.offset(oldDate, "America/New_York"), "number");
});

test("convert with fractional offset", function() {
    // http://www.wolframalpha.com/input/?i=convert+1912%2F02%2F12+00%3A00+VET+to+GMT
    equal(kendo.toString(kendo.timezone.convert(new Date(1912, 1, 12, 0, 0), "America/Caracas", "Etc/UTC"), "MMM dd yyyy HH:mm:ss"), "Feb 12 1912 04:27:40");
});

test("convert changes the timezone from UTC to a timezone", function() {
    var date = new Date(2013, 2, 27, 10, 0, 0);

    equal(kendo.toString(kendo.timezone.convert(date, "Etc/UTC", "Europe/Sofia"), "MMM dd yyyy HH:mm:ss"), "Mar 27 2013 12:00:00");
});

test("convert changes the timezone from a timezone to UTC", function() {
    var date = new Date(2013, 2, 27, 12, 0, 0);

    equal(kendo.toString(kendo.timezone.convert(date, "Europe/Sofia", "Etc/UTC"), "MMM dd yyyy HH:mm:ss"), "Mar 27 2013 10:00:00");
});

test("convert changes the timezone from a timezone to UTC during DST", function() {
    var date = new Date(2013, 2, 31, 4, 0, 0);

    equal(kendo.toString(kendo.timezone.convert(date, "Europe/Sofia", "Etc/UTC"), "MMM dd yyyy HH:mm:ss"), "Mar 31 2013 01:00:00");
});

test("convert changes the timezone from one timezone to another", function() {
    var date = new Date(2013, 4, 27, 0, 0);

    equal(kendo.toString(kendo.timezone.convert(date, "Europe/Sofia", "America/Los_Angeles"), "MMM dd yyyy HH:mm:ss"), "May 26 2013 14:00:00");
});

test("apply assumes browser timezone offset", function() {
    var date = new Date(Date.UTC(2013, 2, 27, 10, 0, 0));

    equal(kendo.toString(kendo.timezone.apply(date, "Europe/Sofia"), "MMM dd yyyy HH:mm:ss"), "Mar 27 2013 12:00:00");
});

test("abbr returs CET for central EU time", function() {
    equal(kendo.timezone.abbr(new Date(2010, 0, 1), "Europe/Berlin"), "CET");
});

test("abbr returs CEST for central EU summer time", function() {
    equal(kendo.timezone.abbr(new Date(2010, 6, 1), "Europe/Berlin"), "CEST");
});

test("abbr returns GMT for London", function () {
    equal(kendo.timezone.abbr(new Date(2010, 0, 1), "Europe/London"), "GMT");
});

test("abbr returns GMT for Isle of Man territory pointing to London timezone", function () {
    equal(kendo.timezone.abbr(new Date(2010, 0, 1), "Europe/Isle_of_Man"), "GMT");
});

test("abbr returns BST for summer time in London", function () {
    equal(kendo.timezone.abbr(new Date(2010, 6, 1), "Europe/London"), "BST");
});

}());