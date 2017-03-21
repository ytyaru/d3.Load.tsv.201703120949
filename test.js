window.onload = function(){
  Main();
}
function Main()
{
var tsvUrl = "https://raw.githubusercontent.com/ytyaru/structure.text.Upload.201703120923/master/res/tmp/2017/0312/Repositories.tsv"

d3.tsv(tsvUrl, function(error, data) {
  makeHtml(data)
});

function makeHtml(data)
{
  makeList(data)
  makeTotal(data)
}

function makeTotal(data)
{
  var table = d3.select("body").insert("table",":first-child").attr("id","TotalHeader");
  var thead = table.append("thead");
  var tbody = table.append("tbody");
  
  var startDt = new Date(data[(data.length - 1)]["CreatedAt"])
  var endDt = new Date(data[0]["CreatedAt"])
  var days = parseInt((endDt.getTime() - startDt.getTime()) / (1000*60*60*24));
  
  var totaldata = {
    "リポジトリ累計数": data.length,
    "経過日数": days,
    "リポジトリ1日平均数": (data.length / days).toFixed(7),
    "開始日": formatDate(startDt,"yyyy-MM-dd")
  }
  thead.append("tr")
    .selectAll("th")
      .data(d3.entries(totaldata))
      .enter()
      .append("th")
      .text(function(d){return d.key;});
  tbody.append("tr")
    .selectAll("td")
      .data(d3.entries(totaldata))
      .enter()
      .append("th")
      .text(function(d){return d.value;});
}

function makeList(data)
{
  var table = d3.select("body").insert("table",":first-child").attr("id","RepositoryList");
  var thead = table.append("thead");
  var tbody = table.append("tbody");
  
  thead.append("tr")
    .selectAll("th")
      .data(d3.entries(data[0]))
      .enter()
      .append("th")
      .text(function(d){return d.key;});
  tbody
    .selectAll("tr")
      .data(data)
      .enter()
      .append("tr")
    .selectAll("td")
      .data(function(d){return d3.entries(d)})
      .enter()
      .append("td")
      .text(function(d){return d.value;});
}

function formatDate(date, format)
{
    if (!format) format = 'yyyy-MM-dd HH:mm:ss.fff';
    format = format.replace(/yyyy/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    if (format.match(/f/g)) {
        var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
        var length = format.match(/f/g).length;
        for (var i = 0; i < length; i++) format = format.replace(/f/, milliSeconds.substring(i, i + 1));
    }
    return format;
}
// 日付の相対表記（yyyy-MM-ddTHH:mm:ssZ→n日）
function abs2rel(baseDate, targetDate)
{
    var elapsedTime = Math.ceil((baseDate.getTime() - targetDate.getTime())/1000);
    if (elapsedTime < 60) { return (elapsedTime / 60) + "秒"; }
    else if (elapsedTime < (60 * 60)) { return Math.floor(elapsedTime / 60) + "分"; }
    else if (elapsedTime < (60 * 60 *24)) { return Math.floor(elapsedTime / 60 / 60) + "時間"; }
    else if (elapsedTime < (60 * 60 *24 * 7)) { return Math.floor(elapsedTime / 60 / 60 / 24) + "日"; }
    else if (elapsedTime < (60 * 60 *24 * 30)) { return Math.floor(elapsedTime / 60 / 60 / 24 / 7) + "週"; }
    else if (elapsedTime < (60 * 60 *24 * 365)) { return Math.floor(elapsedTime / 60 / 60 / 24 / 30) + "ヶ月"; }
    else if (elapsedTime < (60 * 60 *24 * 365 * 100)) { return Math.floor(elapsedTime / 60 / 60 / 24 / 365) + "年"; }
    else { return Math.floor(elapsedTime / 60 / 60 / 24 / 365 / 100) + "世紀"; }
}
}
