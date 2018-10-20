const path = require('path');
const request = require('request-promise');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert({
        "type": "service_account",
        "project_id": "bot-orders",
        "private_key_id": "0f2feafb9984394ade8a93d41396e070a82a4b00",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDPpujz1uypAbBJ\nLSLTq7vAIpm5bvps+cFbTOQtbeFtCBPikIaR61usZLznl47OPRjmdsXSw/n2UkAD\nX69vwkFLk2PEhcVc4DXddtiZhyIEmSGBZZhe0WmWYeqQ1knRW4Q7bX6rhtMSST3B\nryp0/6W7sE3fKOl0zil3ee1UHAeSIg2KHksmf58L2k0PGlr2eFXKt9h7v5bHyj8L\n0aqafduZ5Oxd8Or2HQ02RUB0IFRH6KOSCIrEVk4I1JaySTKgJFMB6R6WivpAXFWN\nUgu1u6/ZXoTP0yNxoQD6C5pE+zi4h+mPHi2a8KaHSI3R3/aSX1SoUt8FK5XnOTmU\nwqtPBet3AgMBAAECggEABozfVax2nrDc8hH9wpZCP+ys02VQJQE5O5C7X0DTbEW6\n9YSq72NwlYmVTpZAp6TUakCzkNMkdBlix43MfPFbGe/g+na1zm422huWTZGDszLE\nFHmIoEUULZg9IVXWfPIuw6klO8fu/z6sN2CNLaT612bXrgMeX37kCU7L+8E+mToc\ngLGYxnrDXMRhKHYeIm0tbYQHtelnq4z7eN/gVVaoy8v2YMmVEDNNtK8up1Nr9dfZ\nPO4EXHwdT0LhXOU0+B3fUBM0rU7UZ5IQE4nZlvLwWrCVU89sbT16F2YQrIS+RrKf\nu7YWdtUr2j6+KsxfGzBpi2s0yBJcxO2zw2Eh+ywiMQKBgQD69ETHc/UFxaMxSNsR\n6HdZHh2qop14yztKDjbOBeyV//T3t0RvJT75bIrruq86RUrQI51N6i4GlNh2iJme\nYgdM9ECbxX0QHjxfDyreoNoJZlFfse3Aktc5Vm02IzBCGF9hCVzWj+As3jdn1LWT\naxJByirD81NG8hh3WYZpR3LMpQKBgQDT08C7PzAjnES9On2KNHoHfErww/GgjRy9\nnVhWsUGCDpMkr+y6qpl8jPDQ577Kb8bNzcdKaVRjbwITJacXwJwP92MSj+XUNPjL\nHmZF1NYtzSqye6q+Vyn0mu5ggokm6AiyVfqHOSy012N8etQhVG9oaihpQVZDpyN6\n2nQkxIbQ6wKBgGTJ0AnO/3xW+QjlOt7BX5WSK9YJQ3dtIB3JAafS50cDKo6Gs1x0\nOAuS1WSBcLjVdYuMkjPltqB8DUfl6tSaiFYWzxAAzA66JgMDo3MQZSFbT5lAa71o\n/DmSBYC1tz8EbOIbEYc295DtmpD/9AEGAqobmPtj8XFP8BWXBg2oXWnlAoGAH5W3\nazQkzWqDpWOPTIg+mdcipXvSD4p6+pr3jRWpGudpcVL6DWtar4OkdMHZZP39urow\nORwzhRAMUyaOH7CMlKTilOX38whjAIZr4YW22eV5tFtUPkVo8BwZ5zIPmUmH4m+H\nh5oy3FQxdWIrNz0Lz5nkpK0lW7kURUFFiCX1pDkCgYAIwz26VFwfiRd3utmO6uVr\n4D8XcdPwfsMto+A8l9Njq8nGuikrc3fnsTTA+Phd5szsKgJmgiuqgJi+Gb7jMN7b\nRP6dRYCAUm0uZg+QhO6Uj3RU8PkMjvizvRqi58W9igWnetxLyMw+Na231Gi7bGmX\nyjjEEcxx/yaAotNG5lw9Ow==\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-gl6fx@bot-orders.iam.gserviceaccount.com",
        "client_id": "101969765057138401575",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-gl6fx%40bot-orders.iam.gserviceaccount.com"
    }),
    databaseURL: 'https://bot-orders.firebaseio.com'
});
var db = admin.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true };
db.settings(settings);
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
    const adminRef = db.collection('admins').doc(userId);
    const ownerRef = db.collection('owners').doc(userId);
    let obj = {
        replyToken: request.replyToken,
        messages: []
    };
    // if (request.message.type !== 'text' || request.source.type !== 'group') {
    //}
    if (msg.indexOf('@@admin=') > -1 && msg.split('=').length == 2) {
        adminRef.set({
            userId,
            name: msg.split('=')[1],
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        })
            .then(admin => {
                obj.messages.push({
                    type: 'text',
                    text: `ลงทะเบียน ${msg.split('=')[1]} เป็น Admin เรียบร้อยค่ะ`
                })
                // obj.messages.push({
                //     type: 'sticker',
                //     packageId: '11538',
                //     stickerId: '51626498'
                // })
                reply(obj);
            })
    } else if (msg.indexOf('@@owner=') > -1 && msg.split('=').length == 2) {
        ownerRef.set({
            userId,
            name: msg.split('=')[1],
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        })
            .then(owner => {
                obj.messages.push({
                    type: 'text',
                    text: `ลงทะเบียน ${msg.split('=')[1]} เป็น Owner เรียบร้อยค่ะ`
                })
                // obj.messages.push({
                //     type: 'sticker',
                //     packageId: '11538',
                //     stickerId: '51626498'
                // })
                reply(obj);
            })
    } else {
        adminRef.get()
            .then(user => {
                if (user.exists) {
                    if (request.source.type == 'group') {
                        const groupId = request.source.groupId;
                        if (msg.indexOf('@@ยกเลิก=') > -1 && msg.split('=').length == 2) {
                            const orderId = msg.split('=')[1];
                            const orderRef = db.collection('orders').doc(orderId);
                            orderRef.get()
                                .then(order => {
                                    if (order.exists) {
                                        if (order.data().cutoff) {
                                            obj.messages.push({
                                                type: 'text',
                                                text: `ไม่สามารถยกเลิกรายการสั่งซื้อ ${orderId}\nเนื่องจากได้ทำการตัดรอบไปแล้วค่ะ`
                                            })
                                            reply(obj);
                                        } else {
                                            async function callback() {
                                                for (var p = 0; p < order.data().product.length; p++) {
                                                    await db.collection('products').doc(order.data().product[p].code).get()
                                                        .then(product => {
                                                            const balance = product.data().amount + order.data().product[p].amount;
                                                            db.collection('products').doc(order.data().product[p].code)
                                                                .set({ amount: balance }, { merge: true })
                                                        })
                                                }
                                                await orderRef.delete()
                                                    .then(cancel => {
                                                        obj.messages.push({
                                                            type: 'text',
                                                            text: `ยกเลิกรายการสั่งซื้อ ${orderId} เรียบร้อยค่ะ${formatOrder(order.data())}`
                                                        })
                                                        reply(obj);
                                                    })
                                            }
                                            callback();

                                        }
                                    } else {
                                        obj.messages.push({
                                            type: 'text',
                                            text: `ไม่มีรายการสั่งซื้อนี้: ${orderId}\nกรุณาตรวจสอบ "รหัสสั่งซื้อ" ค่ะ`
                                        })
                                    }
                                    reply(obj);
                                })
                        } else if (msg.indexOf('#') > -1) {
                            initMsgOrder(msg)
                                .then(resultOrder => {
                                    if (resultOrder.success) {
                                        db.collection('counter').doc('orders').get()
                                            .then(counts => {
                                                const countsData = counts.data();
                                                let no = 1;
                                                let cutoff = countsData.cutoff;
                                                if (countsData.date == yyyymmdd()) {
                                                    no = countsData.no + 1;
                                                } else {
                                                    if (cutoff == true) cutoff = false;
                                                }
                                                db.collection('counter').doc('orders').set({ date: yyyymmdd(), no, cutoff }, { merge: true })
                                                const orderId = yyyymmdd() + '-' + fourDigit(no);
                                                db.collection('orders').doc(orderId)
                                                    .set(Object.assign({
                                                        userId, groupId,
                                                        admin: user.data().name,
                                                        cutoffDate: countsData.cutoffDate,
                                                        cutoff: false,
                                                        tracking: '',
                                                        timestamp: admin.firestore.FieldValue.serverTimestamp()
                                                    }, resultOrder.data))
                                                    .then(order => {
                                                        db.collection('groups').doc(groupId).set({})
                                                        async function callback() {
                                                            for (var p = 0; p < resultOrder.data.product.length; p++) {
                                                                await db.collection('products').doc(resultOrder.data.product[p].code).get()
                                                                    .then(product => {
                                                                        const balance = product.data().amount - resultOrder.data.product[p].amount;
                                                                        if (balance <= product.data().alert) {
                                                                            db.collection('owners').get()
                                                                                .then(snapShot => {
                                                                                    snapShot.forEach(owner => {
                                                                                        push({
                                                                                            to: owner.id,
                                                                                            messages: [
                                                                                                {
                                                                                                    "type": "text",
                                                                                                    "text": `สินค้า ${product.id}:${product.data().name}\nเหลือแค่ ${balance} ชิ้นละจ้า`
                                                                                                }
                                                                                            ]
                                                                                        })
                                                                                    })
                                                                                })
                                                                        }
                                                                        db.collection('products').doc(resultOrder.data.product[p].code)
                                                                            .set({ amount: balance }, { merge: true })
                                                                    })
                                                            }
                                                            await obj.messages.push({
                                                                type: 'text',
                                                                text: `รหัสสั่งซื้อ: ${orderId}\n ${resultOrder.text}\nถ้าข้อมูลไม่ถูกต้องหรือต้องการยกเลิกรายการให้พิมพ์ข้อความด้านล่างนี้ค่ะ`
                                                            })
                                                            await obj.messages.push({
                                                                type: 'text',
                                                                text: `@@ยกเลิก=${orderId}`
                                                            })
                                                            await reply(obj);
                                                        }
                                                        callback();
                                                    })
                                            })

                                    } else {
                                        obj.messages.push({ type: `text`, text: resultOrder.text })
                                        reply(obj);
                                    }
                                })

                        }
                    } else {
                        obj.messages.push({
                            type: 'text',
                            text: `คุยในกลุ่มดีกว่านะคะ`
                        })
                        reply(obj);
                    }
                } else {
                    return;
                }
            })
    }
})
app.post('/api/boardcast', jsonParser, (req, res) => {
    const boardcasts = req.body.boardcasts;
    for (var bc = 0; bc < boardcasts.length; bc++) {
        push(boardcasts[bc]);
    }
    return;
})

app.use(express.static(publicPath));
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'))
});
app.listen(port, () => {
    console.log('Server is up!')
});

const reply = (obj) => {
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
const push = (obj) => {
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/push`,
        headers: LINE_HEADER,
        body: JSON.stringify(obj)
    });
};
const initMsgOrder = (txt) => {
    return db.collection('products').get()
        .then(snapShot => {
            let products = [];
            snapShot.forEach(product => {
                products.push({ id: product.id, ...product.data() })
            })
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
                                        const code = p.split('=')[0].toUpperCase();
                                        const amount = Number(p.split('=')[1].replace(/\D/g, ''));
                                        const product = products.find(f => f.id === code)
                                        if (product) {
                                            if (product.amount >= amount) {
                                                return {
                                                    code,
                                                    amount
                                                }
                                            } else {
                                                return {
                                                    code: code + `เหลือเพียง${product.amount}ชิ้น`,
                                                    amount: 'undefined'
                                                }
                                            }
                                        } else {
                                            return {
                                                code: ' รหัส' + code + 'ไม่มีในรายการสินค้า',
                                                amount: 'undefined'
                                            }
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
        })
}
const formatOrder = (data) => {
    return `
ชื่อ: ${data.name}
เบอร์โทร: ${data.tel}
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