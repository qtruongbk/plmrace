var socket = io("https://plmrace.herokuapp.com/");
// var socket = io("http://localhost:4321/");

$(document).ready(function () {
        $("#getdata").click(function () {
                socket.emit("user-request-data")
        })
})

socket.on("res-data", function (data) {
        $("#data").html("");
        let dataTable = []

        let Allvalue = []
        let allTarget = []
        let timeUpdate = '30/06/2022'

        let rateMoney = 10000
        data.forEach(e => {
                Allvalue.push(parseFloat(e.distance))
        })
        let biggest = Math.max(...Allvalue)
        data.forEach(e => {
                if (e.maxValue){
                        allTarget.push(parseFloat(e.maxValue))
                } else {
                        allTarget.push(parseFloat(biggest))
                }
        })
        let totalMoney = allTarget.reduce((prev, current) => prev + current, 0) - Allvalue.reduce((prev, current) => prev + current, 0)
        data.forEach((e, i) => {
                let row = `
             <tr>
                <td>${i + 1}</td>
                <td>${e.name}</td>
                <td>${e.distance}</td>
                <td>${e.totalDuration}</td>
                <td>${e.pace}</td>
                <td>${e.maxValue ? e.maxValue : biggest}</td>
                <td>${(parseFloat(e.maxValue ? e.maxValue : biggest) - parseFloat(e.distance)).toFixed(2)}</td>
                <td>${((parseFloat(e.maxValue ? e.maxValue : biggest) - parseFloat(e.distance)) * rateMoney).toLocaleString("en-US", { style: "currency", currency: "VND" })}</td>
                ${i === 0 ? "<td rowspan='" + data.length + "'>" + (totalMoney * rateMoney).toLocaleString("en-US", { style: "currency", currency: "VND" }) + "</td>" : ''}
                </tr>`
                dataTable.push(row)
        });
        $("#data").append(
                `<style>
                a{
                        color: blue !important;text-decoration: none;
                } 
                a:hover{
                        text-decoration: underline;
                }
                table {
                        border-collapse: separate;
                        border-spacing: 0;
padding-right: 8px;
                  }
                  table tr th,
                  table tr td {
                        border-right: 1px solid #efbbb9;
                        border-bottom: 1px solid #efbbb9;
                        padding: 5px 10px;
white-space: nowrap;
text-align: center;
background-color: white
                }
                  table tr th{
                          border-top:solid 1px #efbbb9;
                          text-align: center !important;
                          background-color: white
                }
                table tr th:first-child,
                table tr td:first-child {
                        border-left: 1px solid #efbbb9;	
                        width: 64px;
                }
                table tr th:first-child,
                table tr td:first-child {
                        border-left: 1px solid #efbbb9;
                }
                table tr th {
                        background: #eee;
                        text-align: left;
                  }
                table tr:first-child th:first-child {
                        border-top-left-radius: 6px;
                }
                table tr:first-child th:last-child {
                        border-top-right-radius: 6px;
                }
                table tr:last-child td:first-child {
                        border-bottom-left-radius: 6px;
                }
                table tr:last-child td:last-child {
                        border-bottom-right-radius: 6px;
                }
.fail{
background-color: #fbeeed;
}
  </style>
</head>
<body>
        <h2><img src="./PLMrace.png"></h2>
        <div class="tong">
        <div class="column"></div>
        <table>
        <tr>
        <th>STT</th>
        <th>Tên</th>
        <th>Quang đường đã chạy(km)</th>
        <th>Tổng thời gian chạy <br>(tính đến ${timeUpdate})</th>
        <th>Pace trung bình</th>
        <th>Mục tiêu(km)</th>
        <th>Chênh lệch (km)</th>
        <th>VNĐ</th>
        <th>Tổng</th>
     </tr>
        ${dataTable.join('')}
        </table>
        <div class="column"></div>
        </div>
</body>`
        );
        // $("#thongbao").append(
        // `<div>load được: ${data.length} bài</div>`
        // )
})