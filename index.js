var express = require("express");
var timeRace = require('./public/timeRace');
var app = express();
app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");


var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 4321);

var request = require("request");
var cheerio = require("cheerio");



app.get("/", function (req, res) {
        res.render("trangchu")
        io.on("connection", function (socket) {
                console.log("Startus: OK")
                // socket.on("user-request-data", function () {
                        request("https://84race.com/races/getranking/5961/1", function (err, response, body) {
                                // console.log("body", body)
                                if (err) {
                                        console.log(err)
                                } else {
                                        var soKilomet = []
                                        let listPerson = []

                                        let lastList = []
                                        $ = cheerio.load(body);
                                        var filterDistance = $(body).find("small").css({ "float": "right", color: '' });;
                                    
                                        filterDistance.each(function (i, e) {
                                                if (e["children"][0]) {
                                                        soKilomet.push(e["children"][0].data)
                                                }

                                        })

                                        let filterPerson = $(body).find("strong")
                                        filterPerson.each(function (i, e) {
                                                if (e["children"][0]) {
                                                        listPerson.push(e["children"][0].data)
                                                }
                                        })

                                        function countTime(dataTest) {
                                                let count = {
                                                        hour: 0,
                                                        min: 0,
                                                        sec: 0
                                                }
                                                dataTest.forEach(dt => {
                                                        if (dt.includes('h')) {
                                                                let split = dt.split('h')
                                                                count.hour += parseInt(split[0])
                                                                count.min += parseInt(split[1].split('m')[0])
                                                                count.sec += parseInt(split[1].split('m')[1])
                                                        } else if (dt.includes('m')) {
                                                                count.min += parseInt(dt.split('m')[0])
                                                                count.sec += parseInt(dt.split('m')[1])
                                                        } else {
                                                                count.sec += parseInt(dt)
                                                        }
                                                })

                                                if (count.sec >= 60) {
                                                        count = {
                                                                ...count,
                                                                min: count.min + Math.floor(count.sec / 60),
                                                                sec: count.sec % 60
                                                        }
                                                }

                                                if (count.min >= 60) {
                                                        count = {
                                                                ...count,
                                                                min: count.min % 60,
                                                                hour: count.hour + Math.floor(count.min / 60),
                                                        }
                                                }
                                                return count
                                        }

                                        function countPace(time, distance) {
                                                let totalMin = time.hour * 60 + time.min
                                                return (totalMin / parseFloat(distance)).toFixed(2)
                                        }

                                        let listPLMcount = [
                                                { name: 'Quang Trung', dataTime: timeRace.Truong },
                                                { name: 'Ho Nguyen Quoc Nam', dataTime: timeRace.aNam },
                                                { name: 'Nguyen Tran', maxValue: 100, dataTime: timeRace.aNguyen },
                                                { name: 'Vũ Quang Hoà', maxValue: 125, dataTime: timeRace.aHoa },
                                                { name: 'Phạm ngọc thanh', maxValue: 100, dataTime: timeRace.aThanh },
                                                { name: 'Vũ Đức Phong', maxValue: 100, dataTime: timeRace.aPhong }
                                        ]

                                        listPerson.forEach(person => {
                                                if (listPLMcount.some(plmPerson => person.includes(plmPerson.name))) {

                                                        let position = listPerson.indexOf(person)
                                                        let plm = listPLMcount.find(plmC => person.includes(plmC.name))
                                                        lastList.push({
                                                                ...plm,
                                                                distance: soKilomet[position].split('/')[0],
                                                                totalDuration: `${countTime(plm.dataTime).hour}h ${countTime(plm.dataTime).min}m ${countTime(plm.dataTime).sec}s`,
                                                                pace: `${ countPace(countTime(plm.dataTime), soKilomet[position].split('/')[0])} /km`
                                                        })
                                                }
                                        })
                                        socket.emit("res-data", lastList)
                                }
                        // })
                })
        })

})
