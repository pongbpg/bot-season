const path = require('path');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://bot-orders.firebaseio.com'
});

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer H+Um79B9DkzqrE/LDPIMxAZ8thwdUe6rFGtzjBiVfx0jbOWh5vCVLgaOIW+BZ78ulZIfjKNk0gK3XH2tW3KpPJgpt77SdnVohNXWTFtVZiDIJBGmzmOjyybjOLCCOtqKbbH6CIyKv/Wdn+O3xW0BVwdB04t89/1O/w1cDnyilFU=`
};
var jsonParser = bodyParser.json();
app.post('/api/linebot', jsonParser, (req, res) => {
    const request = req.body.events[0];
    const msg = request.message.text;
    const userId = request.source.userId;
    // const userRef = db.collection('admins').doc(userId);
    let obj = {
        replyToken: request.replyToken,
        messages: []
    };
    res.json(req.body)
})

app.use(express.static(publicPath));
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'))
});
app.listen(port, () => {
    console.log('Server is up!')
});

const reply2 = (obj) => {
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/reply`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            replyToken: obj.replyToken,
            messages: obj.messages
        })
    });
};
const initMsgOrder = (txt) => {
    const data = Object.assign(...txt.split('#').filter(f => f != "")
        .map(m => {
            if (m.split(':').length == 2) {
                const dontReplces = ["name", "fb", "bank", "addr"];
                const key = m.split(':')[0];
                let value = m.split(':')[1];
                if (!dontReplces.includes(key)) value = value.replace(/\s/g, '');
                if (key !== 'addr') value = value.replace(/\n/g, '');
                if (key == 'tel') value = value.replace(/\D/g, ''); //เหลือแต่ตัวเลข
                if (key !== 'price') {
                    value = value.trim();
                    if (key == 'product') {
                        value = value.split(',').map(p => {
                            if (p.split('=').length == 2) {
                                return {
                                    code: p.split('=')[0],
                                    amount: Number(p.split('=')[1].replace(/\D/g, ''))
                                }
                            } else {
                                return {
                                    code: 'รหัสสินค้า',
                                    amount: 'undefined'
                                }
                            }
                        });
                    }
                } else {
                    value = Number(value.replace(/\D/g, ''));
                }
                return { [key]: value };
            }
        }));
    let text = formatOrder(data);
    const indexUndefined = text.indexOf('undefined');
    let success = true;
    if (indexUndefined > -1) {
        const t = text.substring(0, indexUndefined - 1).split(' ');
        text = 'รายการสั่งของคุณไม่ถูกต้องค่ะ กรุณาตรวจสอบ "' + t[t.length - 1] + '"';
        success = false;
    }
    return { text, success, data };
}
const formatOrder = (data) => {
    return `
    ชื่อ: ${data.name} เบอร์โทร: ${data.tel}
    ที่อยู่: ${data.addr}
    สินค้า: ${data.product
            ? data.product.map((p, i) => '\n' + p.code + ' ' + p.amount + 'ชิ้น')
            : 'undefined'}
    ธนาคาร: ${data.bank} จำนวนเงิน: ${data.price ? formatMoney(data.price) : 'undefined'}
    FB: ${data.fb}
    Page: ${data.page}
    `;
}
const formatMoney = (amount, decimalCount = 2, decimal = ".", thousands = ",") => {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
};
const yyyymmdd = () => {
    function twoDigit(n) { return (n < 10 ? '0' : '') + n; }
    var now = new Date();
    return '' + now.getFullYear() + twoDigit(now.getMonth() + 1) + twoDigit(now.getDate());
}
const fourDigit = (n) => {
    if (n < 10) {
        return '000' + n.toString();
    } else if (n < 100) {
        return '00' + n.toString();
    } else if (n < 1000) {
        return '0' + n.toString()
    } else {
        return n.toString();
    }
}